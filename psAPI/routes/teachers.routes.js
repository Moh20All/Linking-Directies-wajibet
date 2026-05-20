import { Router } from "express";
import authenticateTeacher from "../middlewares/authTeacher.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";
import Group from "../models/groupe.model.js";
import Mark from "../models/mark.model.js";
import { Teacher } from "../models/teacher.model.js";
import Schedule from "../models/schedule.model.js";
import { getModulesByIds } from "./help.routes.js";
import StudentsAttendance from "../models/studentsAttendance.model.js";

import dayjs from "dayjs";
const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  if (month >= 8) {
    return `${(year % 100).toString().padStart(2, "0")}${((year + 1) % 100)
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${((year - 1) % 100).toString().padStart(2, "0")}${(year % 100)
      .toString()
      .padStart(2, "0")}`;
  }
};

const teachersRouter = Router();

// Apply auth first, then subscription check
teachersRouter.use(authenticateTeacher);
teachersRouter.use(checkSubscription);

teachersRouter.get("/", async (req, res) => {
  const teacher = await Teacher.findById(req.teacher._id).lean();

  if (!teacher) {
    return res.status(404).json({ error: "Teacher not found" });
  }
  res.send({
    teacher,
  });
});

/**
 * @route   GET /my-groups-with-marks
 * @desc    Get all groups for the authenticated teacher, populated with student names and their marks for the teacher's specific module(s).
 * @access  Private (Teacher)
 */
teachersRouter.get(
  "/my-groups-with-marks",
  authenticateTeacher,
  async (req, res) => {
    try {
      // 🔑 Re-fetch the latest teacher document
      const teacher = await Teacher.findById(req.teacher._id).lean();

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      const teacherAssignments = teacher.currentGroups;

      if (!teacherAssignments || teacherAssignments.length === 0) {
        return res.status(200).json([]);
      }

      // Map groupId -> array of moduleIds
      const groupModuleMap = new Map();
      teacherAssignments.forEach((a) => {
        if (!groupModuleMap.has(a.groupId)) {
          groupModuleMap.set(a.groupId, []);
        }
        groupModuleMap.get(a.groupId).push(a.moduleId);
      });

      const groupIds = [...groupModuleMap.keys()];

      // Fetch groups and marks in parallel
      const [groups, marksDocs] = await Promise.all([
        Group.find({
          id: { $in: groupIds },
          schoolId: teacher.schoolId,
        }).lean(),

        Mark.find({
          groupId: { $in: groupIds },
          schoolId: teacher.schoolId,
        }).populate({
          path: "students.studentId",
          select: "full_name",
          model: "Student",
        }),
      ]);

      // Group marksDocs by groupId
      const marksMap = new Map();
      marksDocs.forEach((doc) => {
        if (!marksMap.has(doc.groupId)) {
          marksMap.set(doc.groupId, []);
        }
        marksMap.get(doc.groupId).push(doc);
      });

      // Build final result
      const result = groups.map((group) => {
        const moduleIdsForThisGroup = groupModuleMap.get(group.id) || [];
        const marksForThisGroup = marksMap.get(group.id) || [];

        let studentsWithMarks = [];

        marksForThisGroup.forEach((markDoc) => {
          if (markDoc.students && Array.isArray(markDoc.students)) {
            markDoc.students.forEach((studentMark) => {
              if (!studentMark.studentId) return;

              const relevantMarks = {};

              // Iterate through trimesters for each moduleId
              for (const trimester of studentMark.trimesters) {
                moduleIdsForThisGroup.forEach((moduleId) => {
                  const moduleData = trimester.modules.get(moduleId);
                  if (moduleData) {
                    if (!relevantMarks[moduleId]) {
                      relevantMarks[moduleId] = {};
                    }
                    relevantMarks[moduleId][
                      `trimester_${trimester.trimester}`
                    ] = moduleData;
                  }
                });
              }

              studentsWithMarks.push({
                studentId: studentMark.studentId._id,
                full_name: studentMark.studentId.full_name,
                marks: relevantMarks,
              });
            });
          }
        });

        return {
          ...group,
          teachingModuleIds: moduleIdsForThisGroup,
          students: studentsWithMarks,
        };
      });

      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to fetch teacher groups with marks:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching your groups." });
    }
  }
);

/**
 * =========================================
 * 3) TEACHER SCHEDULE
 * =========================================
 * @route   GET /schedule
 * @desc    Get the authenticated teacher’s schedule entries
 * @access  Private (Teacher)
 */
teachersRouter.get("/schedule", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id).lean();
    const season = getCurrentSeason(); // 👈 import from your utils

    const schedules = await Schedule.find({
      "entries.teacherId": teacher._id,
      schoolId: teacher.schoolId,
      season,
    }).lean();

    const allModuleIds = schedules.flatMap((s) =>
      s.entries.map((e) => e.moduleId)
    );
    const modules = await getModulesByIds("lycee", allModuleIds);
    const moduleMap = new Map(modules.map((m) => [m.id, m.name]));

    const filteredSchedules = schedules.map((s) => ({
      ...s,
      entries: s.entries
        .filter((e) => String(e.teacherId) === String(teacher._id))
        .map((e) => ({
          ...e,
          module: {
            id: e.moduleId,
            name: moduleMap.get(e.moduleId) || "Unknown Module",
          },
        })),
    }));

    res.status(200).json(filteredSchedules);
  } catch (err) {
    console.error("Failed to fetch schedule:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

/**
 * =========================================
 * TEACHER ATTENDANCE ROUTES
 * =========================================
 */

// 👉 Mark attendance for a group & module
teachersRouter.post(
  "/attendance/mark",
  authenticateTeacher,
  async (req, res) => {
    try {
      const { groupId, moduleId, date, absentees } = req.body;
      const { schoolId } = req.teacher; // include season from teacher

      if (!groupId || !moduleId || !date || !Array.isArray(absentees)) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Normalize date to ignore time part (attendance is per day)
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      // 🔍 Find or create attendance document for this school/group/day
      let attendance = await StudentsAttendance.findOne({
        schoolId,
        // season,
        groupId,
        date: normalizedDate,
      });

      if (!attendance) {
        attendance = new StudentsAttendance({
          schoolId,
          // season,
          groupId,
          date: normalizedDate,
          moduleEntries: [],
        });
      }

      // 🔍 Find or create module entry
      let moduleEntry = attendance.moduleEntries.find(
        (m) => m.moduleId.toString() === moduleId
      );

      if (!moduleEntry) {
        moduleEntry = { moduleId, absentees: [] };
        attendance.moduleEntries.push(moduleEntry);
      }

      // ✅ Update absentees for this module
      moduleEntry.absentees = absentees.map((a) => ({
        studentId: a.studentId,
        status: a.status,
        showingUpTime: a.showingUpTime || null,
        remark: a.remark || null,
        sessionId: a.sessionId || null,
      }));

      await attendance.save();
      res.status(200).json({ message: "Attendance marked", attendance });
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      res.status(500).json({ error: "Failed to mark attendance" });
    }
  }
);

// 👉 Get attendance report for a group on a date
teachersRouter.get(
  "/attendance/report/:groupId/:date",
  async (req, res) => {
    try {
      const { groupId, date } = req.params;
      const { schoolId } = req.teacher;

      const attendance = await StudentsAttendance.findOne({
        schoolId,
        groupId,
        date: new Date(date),
      }).populate("moduleEntries.moduleId moduleEntries.absentees.studentId");

      if (!attendance) {
        return res
          .status(404)
          .json({ error: "No attendance record found for this group/date" });
      }

      res.status(200).json(attendance);
    } catch (err) {
      console.error("Failed to fetch attendance report:", err);
      res.status(500).json({ error: "Failed to fetch attendance report" });
    }
  }
);

// 👉 Get a student’s attendance history
teachersRouter.get(
  "/attendance/student/:studentId",
  authenticateTeacher,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { schoolId } = req.teacher;

      const records = await StudentsAttendance.find({
        schoolId,
        "moduleEntries.absentees.studentId": studentId,
      });

      const history = records.map((rec) => ({
        date: rec.date,
        groupId: rec.groupId,
        modules: rec.moduleEntries
          .filter((m) =>
            m.absentees.some((a) => a.studentId.toString() === studentId)
          )
          .map((m) => {
            const entry = m.absentees.find(
              (a) => a.studentId.toString() === studentId
            );
            return {
              moduleId: m.moduleId,
              status: entry.status,
              showingUpTime: entry.showingUpTime,
            };
          }),
      }));

      res.status(200).json(history);
    } catch (err) {
      console.error("Failed to fetch student attendance:", err);
      res.status(500).json({ error: "Failed to fetch student attendance" });
    }
  }
);

teachersRouter.get(
  "/attendance-report/:groupId",
  authenticateTeacher,
  async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.teacher._id).lean();
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      const { groupId } = req.params;

      // 🔒 Check if teacher teaches this group
      const teachesGroup = teacher.currentGroups.some(
        (g) => g.groupId.toString() === groupId
      );
      if (!teachesGroup) {
        return res.status(403).json({
          error: "You are not authorized to view this group's attendance",
        });
      }

      // 🎯 Handle date range
      const today = dayjs();
      const defaultFrom =
        today.month() >= 8
          ? dayjs(`${today.year()}-09-01`)
          : dayjs(`${today.year() - 1}-09-01`);

      const { from, to } = req.body || {};
      const startDate = from ? dayjs(from) : defaultFrom;
      const endDate = to ? dayjs(to) : today;

      // 🔍 Get student list from Mark document
      const markDoc = await Mark.findOne({
        schoolId: teacher.schoolId,
        groupId,
      }).populate("students.studentId", "full_name");

      if (!markDoc) {
        return res.status(404).json({
          error: "No students found for this group (Mark document missing)",
        });
      }

      const studentReport = {};
      markDoc.students.forEach((s) => {
        if (!s.studentId) return;
        studentReport[s.studentId._id.toString()] = {
          studentId: s.studentId._id,
          full_name: s.studentId.full_name,
          present: 0,
          absent: 0,
          late: 0,
        };
      });

      // 🔍 Fetch attendance records for this group within range
      const attendanceDocs = await StudentsAttendance.find({
        schoolId: teacher.schoolId,
        groupId,
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      })
        .populate("moduleEntries.absentees.studentId", "full_name")
        .lean();

      if (!attendanceDocs || attendanceDocs.length === 0) {
        return res.status(200).json({
          groupId,
          from: startDate.format("YYYY-MM-DD"),
          to: endDate.format("YYYY-MM-DD"),
          totalSessions: 0,
          students: Object.values(studentReport), // all present by default
        });
      }

      // 📊 Process attendance
      attendanceDocs.forEach((doc) => {
        doc.moduleEntries.forEach((mod) => {
          // All students in this module were present by default
          Object.keys(studentReport).forEach((sid) => {
            studentReport[sid].present += 1;
          });

          // Overwrite with absentees/late
          mod.absentees.forEach((a) => {
            if (!a.studentId) return;
            const sid = a.studentId._id.toString();

            // remove the "present" increment we just gave
            studentReport[sid].present -= 1;

            if (a.status === "absent") {
              studentReport[sid].absent += 1;
            } else if (a.status === "late") {
              studentReport[sid].late += 1;
            }
          });
        });
      });

      res.status(200).json({
        groupId,
        from: startDate.format("YYYY-MM-DD"),
        to: endDate.format("YYYY-MM-DD"),
        totalSessions: attendanceDocs.length,
        students: Object.values(studentReport),
      });
    } catch (err) {
      console.error("Failed to fetch attendance report:", err);
      res.status(500).json({ error: "Failed to fetch attendance report" });
    }
  }
);

teachersRouter.put("/marks/update", async (req, res) => {
  try {
    const { groupId, moduleId, trimester, studentId, updates } = req.body;
    const { schoolId } = req.teacher;

    if (!groupId || !moduleId || !trimester || !studentId || !updates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔍 Find teacher and confirm they teach this group + module
    const teacher = await Teacher.findById(req.teacher._id).lean();
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teachesThisGroup = teacher.currentGroups.some(
      (cg) =>
        cg.groupId.toString() === groupId && cg.moduleId.toString() === moduleId
    );
    if (!teachesThisGroup) {
      return res.status(403).json({
        error: "You are not authorized to update marks for this group/module",
      });
    }

    // 🔍 Find the Mark document
    const markDoc = await Mark.findOne({ schoolId, groupId });
    if (!markDoc) {
      return res.status(404).json({ error: "Mark document not found" });
    }

    // 🔒 Ensure module exists in this group
    const moduleExists = markDoc.modulesMeta.some(
      (m) => m.id.toString() === moduleId
    );
    if (!moduleExists) {
      return res.status(400).json({
        error: `Module ${moduleId} is not part of group ${groupId}`,
      });
    }

    // 🔍 Find the student entry
    const studentEntry = markDoc.students.find(
      (s) => String(s.studentId) === String(studentId)
    );
    if (!studentEntry) {
      return res.status(404).json({ error: "Student not found in this group" });
    }

    // 🔍 Find the trimester entry
    const trimesterEntry = studentEntry.trimesters.find(
      (t) => String(t.trimester) === String(trimester)
    );
    if (!trimesterEntry) {
      return res.status(404).json({
        error: `Trimester ${trimester} not found for student`,
      });
    }

    // 🔍 Find or create module data
    let moduleData = trimesterEntry.modules.get(moduleId);
    if (!moduleData) {
      moduleData = {
        coefficient: 1,
        dev1: 0,
        dev2: 0,
        exam: 0,
        constant_observation: 0,
        value: 0,
      };
    }

    // ✅ Apply only allowed updates
    const allowedFields = [
      "dev1",
      "dev2",
      "exam",
      "constant_observation",
      "coefficient",
    ];
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        moduleData[key] = updates[key];
      }
    }

    // ✅ Recalculate value
    const dev1 = moduleData.dev1 || 0;
    const dev2 = moduleData.dev2 || 0;
    const exam = moduleData.exam || 0;
    const constant_observation = moduleData.constant_observation || 0;

    moduleData.value =
      ((dev1 + dev2) / 2 + constant_observation + exam * 3) / 5;

    // Re-set module data
    trimesterEntry.modules.set(moduleId, moduleData);

    await markDoc.save();

    res.status(200).json({
      message: "Mark updated successfully",
      studentId,
      moduleId,
      trimester,
      updated: moduleData,
    });
  } catch (err) {
    console.error("Failed to update mark:", err);
    res.status(500).json({ error: "Failed to update mark" });
  }
});

export default teachersRouter;
