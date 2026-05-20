import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authStaff from "../middlewares/authStaff.middleware.js";
import { authTabAccess } from "../middlewares/authTabAcees.middleware.js";
import { TAB_SECRET } from "../config/env.js";
import School from "../models/school.model.js";
import FinancialProfile from "../models/finance/financialProfile.model.js";
import Attendance from "../models/attendance.model.js";

const attendanceRouter = Router();

// Endpoint to verify password and grant access token
attendanceRouter.post("/verify-password", authStaff, async (req, res) => {
  try {
    const { password } = req.body;
    const schoolId = req.school.schoolId;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const hashedPassword = school.information.tabspwds.attendance;
    if (!hashedPassword) {
      return res
        .status(400)
        .json({ valid: false, error: "Password not set for this tab." });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ valid: false, error: "Invalid password" });
    }

    const tabToken = jwt.sign({ tab: "attendance", schoolId }, TAB_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("tab_access_token", tabToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ valid: true, message: "Password correct, access granted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: "Failed to verify password" });
  }
});

// Endpoint to revoke access token
attendanceRouter.post("/revoke-access", authStaff, (req, res) => {
  try {
    res.clearCookie("tab_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res
      .status(200)
      .json({ message: "Attendance tab access revoked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to revoke attendance tab access" });
  }
});

// Endpoint to check if access is already granted via cookie
attendanceRouter.get(
  "/",
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    res.send({ granted: true, message: "Attendance tab access granted" });
  }
);

// 🔹 New endpoint: Get all active non-student members (normalized for attendance)
attendanceRouter.get(
  "/members",
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;

      let profiles = await FinancialProfile.find(
        {
          schoolId,
          role: { $ne: "STUDENT" },
        },
        { transactions: 0 } // exclude transactions
      )
        .populate({
          path: "teacherId",
          model: "Member",
          select: "full_name email phone_number national_ID", // essential info
        })
        .lean();

      // 🔹 Normalize data for attendance
      const members = profiles.map((profile) => {
        if (profile.role === "TEACHER") {
          return {
            _id: profile._id,
            name: profile.teacherId?.full_name || "Unknown",
            department: "Academic",
            role: "TEACHER",
          };
        }

        // For EMPLOYEE / OTHER
        return {
          _id: profile._id,
          name: profile.name,
          department: profile.department || "General",
          role: profile.role,
        };
      });

      res.status(200).json({ members });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to fetch active non-student members" });
    }
  }
);

// --- CRUD ROUTES FOR ENTIRE DAY ---

/**
 * @route   POST /:date
 * @desc    Create or Update (Upsert) the attendance record for a specific date.
 * @access  Private (Staff with Attendance Tab Access)
 */
attendanceRouter.post(
  "/:date", // e.g., /2024-09-08
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    const { date } = req.params;
    const { records } = req.body; // Expects an array of { memberId, status, remarks }
    const schoolId = req.school.schoolId;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Please use YYYY-MM-DD." });
    }
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Records must be an array." });
    }

    try {
      const attendance = await Attendance.findOneAndUpdate(
        { schoolId, date },
        {
          $set: {
            records: records,
          },
        },
        { new: true, upsert: true, runValidators: true }
      );
      res.status(200).json({
        message: `Attendance for ${date} saved successfully.`,
        attendance,
      });
    } catch (err) {
      console.error("Error saving attendance:", err);
      res.status(500).json({ error: "Failed to save attendance data." });
    }
  }
);

/**
 * @route   GET /:date
 * @desc    Get the attendance record for a specific date.
 * @access  Private (Staff with Attendance Tab Access)
 */
attendanceRouter.get(
  "/:date", // e.g., /2024-09-08
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    const { date } = req.params;
    const schoolId = req.school.schoolId;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Please use YYYY-MM-DD." });
    }

    try {
      const attendance = await Attendance.findOne({ schoolId, date }).populate(
        "records.memberId",
        "name role"
      );
      if (!attendance) {
        return res
          .status(404)
          .json({ message: "No attendance record found for this date." });
      }
      res.status(200).json({ attendance });
    } catch (err) {
      console.error("Error fetching attendance:", err);
      res.status(500).json({ error: "Failed to fetch attendance data." });
    }
  }
);

// --- 🔹 NEW ROUTES FOR INDIVIDUAL RECORDS ---

/**
 * @route   PATCH /:date/records/:memberId
 * @desc    Modify a single attendance record for a specific member and date.
 * @access  Private (Staff with Attendance Tab Access)
 */
attendanceRouter.patch(
  "/:date/records/:memberId",
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    const { date, memberId } = req.params;
    const schoolId = req.school.schoolId;
    const updates = req.body; // e.g., { status: 'Late', remarks: 'Stuck in traffic' }

    try {
      const updateFields = {};
      for (const key of Object.keys(updates)) {
        updateFields[`records.$.${key}`] = updates[key];
      }

      const updatedAttendance = await Attendance.findOneAndUpdate(
        { schoolId, date, "records.memberId": memberId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({
          error: "Attendance record not found for this member on this date.",
        });
      }

      res.status(200).json({
        message: "Record updated successfully.",
        attendance: updatedAttendance,
      });
    } catch (err) {
      console.error("Error updating single record:", err);
      res.status(500).json({ error: "Failed to update attendance record." });
    }
  }
);

/**
 * @route   POST /:date/records
 * @desc    Add a single new attendance record to an existing document.
 * @access  Private (Staff with Attendance Tab Access)
 */
attendanceRouter.post(
  "/:date/records",
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    const { date } = req.params;
    const schoolId = req.school.schoolId;
    const newRecord = req.body; // Expects { memberId, memberName, status, attendanceTime, remarks }

    try {
      // First, ensure the member is not already in the list for that day
      const existingDoc = await Attendance.findOne({
        schoolId,
        date,
        "records.memberId": newRecord.memberId,
      });
      if (existingDoc) {
        return res.status(409).json({
          error: "This member already has an attendance record for this date.",
        });
      }

      const updatedAttendance = await Attendance.findOneAndUpdate(
        { schoolId, date },
        {
          $push: { records: newRecord },
        },
        { new: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({
          error:
            "Attendance sheet for this date does not exist. Please create it first.",
        });
      }

      res.status(201).json({
        message: "Record added successfully.",
        attendance: updatedAttendance,
      });
    } catch (err) {
      console.error("Error adding single record:", err);
      res.status(500).json({ error: "Failed to add attendance record." });
    }
  }
);

/**
 * @route   DELETE /:date/records/:memberId
 * @desc    Delete a single attendance record for a specific member and date.
 * @access  Private (Staff with Attendance Tab Access)
 */
attendanceRouter.delete(
  "/:date/records/:memberId",
  authStaff,
  authTabAccess("attendance"),
  async (req, res) => {
    const { date, memberId } = req.params;
    const schoolId = req.school.schoolId;

    try {
      const updatedAttendance = await Attendance.findOneAndUpdate(
        { schoolId, date },
        {
          $pull: { records: { memberId: memberId } },
        },
        { new: true }
      );

      if (!updatedAttendance) {
        return res
          .status(404)
          .json({ error: "Attendance sheet for this date does not exist." });
      }

      res.status(200).json({
        message: "Record deleted successfully.",
        attendance: updatedAttendance,
      });
    } catch (err) {
      console.error("Error deleting single record:", err);
      res.status(500).json({ error: "Failed to delete attendance record." });
    }
  }
);

export default attendanceRouter;
