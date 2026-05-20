import { Router } from "express";
import authenticateStudent from "../middlewares/authStudent.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";
// import Student from "../models/student.model.js";
import { Student } from "../models/student.model.js";
import Mark from "../models/mark.model.js";
import Schedule from "../models/schedule.model.js";
import Group from "../models/groupe.model.js";
import School from "../models/school.model.js";
import { getModulesByIds } from "./help.routes.js";

const studentsRouter = Router();

// Apply auth first, then subscription check
studentsRouter.use(authenticateStudent);
studentsRouter.use(checkSubscription);

/**
 * @route   GET /
 * @desc    Check if student has access
 * @access  Private (Student)
 */
studentsRouter.get("/", async (req, res) => {
  const student = await Student.findById(req.student._id).lean();

  if (!student) {
    return res.status(200).json({ granted: false, error: "Student not found" });
  }
  res.send({
    granted: true,
    ...student,
    password: null,
  });
});

// Helper to get the current academic season
const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed (January is 0)

  // Season starts in September (month index 8)
  if (month >= 8) {
    const startYear = year.toString().slice(-2);
    const endYear = (year + 1).toString().slice(-2);
    return `${startYear}${endYear}`;
  } else {
    const startYear = (year - 1).toString().slice(-2);
    const endYear = year.toString().slice(-2);
    return `${startYear}${endYear}`;
  }
};

/**
 * @route   GET /info
 * @desc    Get detailed information for the authenticated student, including their group
 * @access  Private (Student)
 */
studentsRouter.get("/info", authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
      .select("-password -__v")
      .populate({
        path: "parentAccountIds.mother",
        select: "full_name email phone_number",
      })
      .populate({
        path: "parentAccountIds.father",
        select: "full_name email phone_number",
      })
      .lean();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    let group = null;
    let schedule = null;
    let marks = null;
    const season = getCurrentSeason();

    // Fetch school information to get the type (e.g., 'lycee', 'cem')
    const school = await School.findById(student.schoolId)
      .select("information.type")
      .lean();
    const schoolType = school?.information?.type; // Default to lycee if not found

    if (student.registered && student.registeredGroupId) {
      // Get Group Info
      group = await Group.findOne({ id: student.registeredGroupId })
        .populate({
          path: "teachers.teacherId",
          select: "full_name email phone_number modules",
        })
        .lean();

      // Get Schedule Info
      const scheduleDoc = await Schedule.findOne({
        groupId: student.registeredGroupId,
        schoolId: student.schoolId,
        season,
      }).lean();

      if (scheduleDoc) {
        const scheduleModuleIds = scheduleDoc.entries.map((e) => e.moduleId);
        const scheduleModules = await getModulesByIds(
          schoolType,
          scheduleModuleIds
        );
        const scheduleModuleMap = new Map(
          scheduleModules.map((m) => [m.id, m.name])
        );
        const populatedEntries = scheduleDoc.entries.map((e) => ({
          ...e,
          moduleName: scheduleModuleMap.get(e.moduleId) || "Unknown Module",
        }));
        schedule = { ...scheduleDoc, entries: populatedEntries };
      }

      // Get Marks Info
      const markDoc = await Mark.findOne({
        groupId: student.registeredGroupId,
        schoolId: student.schoolId,
      }).lean();

      if (markDoc) {
        const studentMarks = markDoc.students.find(
          (s) => s.studentId.toString() === student._id.toString()
        );
        if (studentMarks) {
          const allModuleIds = new Set();
          studentMarks.trimesters.forEach((trimester) => {
            Object.keys(trimester.modules).forEach((moduleId) => {
              allModuleIds.add(moduleId);
            });
          });
          const modulesInfo = await getModulesByIds(schoolType, [
            ...allModuleIds,
          ]);
          const moduleMap = new Map(modulesInfo.map((m) => [m.id, m.name]));
          const populatedTrimesters = studentMarks.trimesters.map(
            (trimester) => {
              const populatedModules = {};
              for (const moduleId in trimester.modules) {
                populatedModules[moduleId] = {
                  ...trimester.modules[moduleId],
                  moduleName: moduleMap.get(moduleId) || "Unknown Module",
                };
              }
              return { ...trimester, modules: populatedModules };
            }
          );
          marks = {
            groupId: markDoc.groupId,
            trimesters: populatedTrimesters,
          };
        }
      }
    }

    res.send({
      ...student,
      schoolType,
      group,
      schedule,
      marks,
    });
  } catch (error) {
    console.error("Error fetching student info:", error);
    res.status(500).json({ error: "Could not fetch student information." });
  }
});

/**
 * @route   GET /schedule
 * @desc    Get the schedule for the authenticated student's current group
 * @access  Private (Student)
 */
studentsRouter.get("/schedule", authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).lean();
    if (!student || !student.registered || !student.registeredGroupId) {
      return res
        .status(404)
        .json({ error: "Student is not registered to a group." });
    }

    const season = getCurrentSeason();
    const schedule = await Schedule.findOne({
      groupId: student.registeredGroupId,
      schoolId: student.schoolId,
      season,
    }).lean();

    if (!schedule) {
      return res
        .status(404)
        .json({ error: "Schedule not found for your group." });
    }

    // Get module names
    const allModuleIds = schedule.entries.map((e) => e.moduleId);
    const modules = await getModulesByIds("lycee", allModuleIds); // Assuming 'lycee', adjust if needed
    const moduleMap = new Map(modules.map((m) => [m.id, m.name]));

    const populatedEntries = schedule.entries.map((e) => ({
      ...e,
      moduleName: moduleMap.get(e.moduleId) || "Unknown Module",
    }));

    res.status(200).json({ ...schedule, entries: populatedEntries });
  } catch (err) {
    console.error("Failed to fetch schedule:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

/**
 * @route   GET /marks
 * @desc    Get the marks for the authenticated student
 * @access  Private (Student)
 */
studentsRouter.get("/marks", async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).lean();
    if (!student || !student.registered || !student.registeredGroupId) {
      return res
        .status(404)
        .json({ error: "Student not found or not registered to a group." });
    }

    const markDoc = await Mark.findOne({
      groupId: student.registeredGroupId,
      schoolId: student.schoolId,
    }).lean();

    if (!markDoc) {
      return res
        .status(404)
        .json({ error: "Marks document not found for your group." });
    }

    const studentMarks = markDoc.students.find(
      (s) => s.studentId.toString() === student._id.toString()
    );

    if (!studentMarks) {
      return res
        .status(404)
        .json({ error: "Marks not found for this student." });
    }

    // Get all unique module IDs from all trimesters
    const allModuleIds = new Set();
    studentMarks.trimesters.forEach((trimester) => {
      Object.keys(trimester.modules).forEach((moduleId) => {
        allModuleIds.add(moduleId);
      });
    });

    const modulesInfo = await getModulesByIds("lycee", [...allModuleIds]); // Assuming 'lycee'
    const moduleMap = new Map(modulesInfo.map((m) => [m.id, m.name]));

    // Enhance the marks object with module names
    const populatedTrimesters = studentMarks.trimesters.map((trimester) => {
      const populatedModules = {};
      for (const moduleId in trimester.modules) {
        populatedModules[moduleId] = {
          ...trimester.modules[moduleId],
          moduleName: moduleMap.get(moduleId) || "Unknown Module",
        };
      }
      return { ...trimester, modules: populatedModules };
    });

    res.status(200).json({
      groupId: markDoc.groupId,
      trimesters: populatedTrimesters,
    });
  } catch (err) {
    console.error("Failed to fetch marks:", err);
    res.status(500).json({ error: "Failed to fetch marks" });
  }
});

export default studentsRouter;
