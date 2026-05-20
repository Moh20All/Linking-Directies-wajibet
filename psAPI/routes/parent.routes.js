import { Router } from "express";
import authenticateParent from "../middlewares/authParent.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";
import { Parent } from "../models/parent.model.js";
import { Student } from "../models/student.model.js";
import Group from "../models/groupe.model.js";
import Mark from "../models/mark.model.js";
import Schedule from "../models/schedule.model.js";
import StudentsAttendance from "../models/studentsAttendance.model.js";
import { getModulesByIds } from "./help.routes.js";
import dayjs from "dayjs";

const parentRouter = Router();

// Middleware to protect all parent routes
parentRouter.use(authenticateParent);
parentRouter.use(checkSubscription);

/**
 * @route   GET /api/parents/
 * @desc    Get the authenticated parent's profile
 * @access  Private (Parent)
 */
parentRouter.get("/", async (req, res) => {
  try {
    const parent = await Parent.findById(req.parent._id)
      .select("-password")
      .populate("children", "full_name registeredGroupId");

    if (!parent) {
      return res.status(404).json({ error: "Parent profile not found." });
    }

    res.status(200).json(parent);
  } catch (error) {
    console.error("Failed to fetch parent profile:", error);
    res.status(500).json({ error: "Failed to fetch parent profile." });
  }
});

/**
 * @route   GET /api/parents/children/dashboard
 * @desc    Get a full dashboard of information for each of the parent's children
 * @access  Private (Parent)
 */
parentRouter.get("/children/dashboard", async (req, res) => {
  try {
    const parent = await Parent.findById(req.parent._id).populate({
      path: "children",
      model: "Student",
    });

    if (!parent) {
      return res.status(404).json({ error: "Parent not found." });
    }

    if (!parent.children || parent.children.length === 0) {
      return res.status(200).json([]);
    }

    // Helper to get current season
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
    const season = getCurrentSeason();

    const childrenDataPromises = parent.children.map(async (child) => {
      // Ensure child is a full document
      const student = await Student.findById(child._id)
        .select("-password")
        .lean();
      if (!student || !student.registeredGroupId) {
        return {
          student,
          group: null,
          teachers: [],
          schedule: null,
          marks: null,
          attendance: {},
        };
      }

      // 1. Get Group and Teachers info
      const group = await Group.findOne({ id: student.registeredGroupId })
        .populate("teachers.teacherId", "full_name email phone_number")
        .lean();

      // 2. Get Schedule
      const schedule = await Schedule.findOne({
        groupId: student.registeredGroupId,
        season,
      }).lean();

      // 3. Get Marks
      const markDoc = await Mark.findOne({
        groupId: student.registeredGroupId,
      }).lean();
      const studentMarks = markDoc?.students.find(
        (s) => s.studentId.toString() === student._id.toString()
      );

      // 4. Get Attendance
      const attendanceRecords = await StudentsAttendance.find({
        schoolId: student.schoolId,
        groupId: student.registeredGroupId,
        "moduleEntries.absentees.studentId": student._id,
      }).lean();

      const attendanceSummary = {
        absences: 0,
        lates: 0,
        details: [],
      };

      attendanceRecords.forEach((record) => {
        record.moduleEntries.forEach((moduleEntry) => {
          moduleEntry.absentees.forEach((absentee) => {
            if (absentee.studentId.toString() === student._id.toString()) {
              if (absentee.status === "absent") attendanceSummary.absences++;
              if (absentee.status === "late") attendanceSummary.lates++;
              attendanceSummary.details.push({
                date: dayjs(record.date).format("YYYY-MM-DD"),
                moduleId: moduleEntry.moduleId,
                status: absentee.status,
                showingUpTime: absentee.showingUpTime,
                remark: absentee.remark,
              });
            }
          });
        });
      });

      return {
        student,
        group,
        schedule,
        marks: studentMarks || null,
        attendance: attendanceSummary,
      };
    });

    const childrenDashboards = await Promise.all(childrenDataPromises);

    res.status(200).json(childrenDashboards);
  } catch (error) {
    console.error("Failed to fetch children dashboard data:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

export default parentRouter;
