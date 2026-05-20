import { Router } from "express";
import mongoose from "mongoose";
import authenticateHeadMaster from "../middlewares/authMaster.middleware.js";
import bcrypt from "bcryptjs";
import Member from "../models/member.model.js";
import School from "../models/school.model.js";
import Transaction from "../models/finance/transaction.model.js";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import Group from "../models/groupe.model.js";
import Mark from "../models/mark.model.js";
import Attendance from "../models/attendance.model.js";
import StudentsAttendance from "../models/studentsAttendance.model.js";

import checkSubscription from "../middlewares/checkSubscription.middleware.js";

const headmasterRouter = Router();

headmasterRouter.use((req, res, next) => {
    // Optional: Log path for debugging if needed
    next();
});

headmasterRouter.get("/", authenticateHeadMaster, async (req, res) => {
  res.send({
    message: "HeadMaster API",
  });
});

/**
 * @route   GET /dashboard-overview
 * @desc    Get a comprehensive overview of the school's performance
 * @access  Private (Headmaster)
 */
headmasterRouter.get(
  "/dashboard-overview",
  authenticateHeadMaster,
  checkSubscription,
  async (req, res) => {
    try {
      const { schoolId } = req.school;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        pedagogyStats,
        financeSummary,
        academicPerformance,
        workerAttendanceRecords,
        studentAbsenceRecords,
        studentAttendanceByGroup,
        topTeachers,
      ] = await Promise.all([
        // Pedagogy Stats
        (async () => {
          const [
            studentCount,
            teacherCount,
            activeGroupCount,
            unassignedStudentCount,
          ] = await Promise.all([
            Student.countDocuments({ schoolId }),
            Teacher.countDocuments({ schoolId }),
            Group.countDocuments({ schoolId }),
            Student.countDocuments({ schoolId, registered: false }),
          ]);
          return {
            studentCount,
            teacherCount,
            activeGroupCount,
            unassignedStudentCount,
          };
        })(),
        // Financial Summary
        Transaction.aggregate([
          { $match: { schoolId: new mongoose.Types.ObjectId(schoolId) } },
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: {
                  $cond: [
                    { $in: ["$type", ["student_fees", "inflow"]] },
                    "$amount",
                    0,
                  ],
                },
              },
              totalExpenses: {
                $sum: {
                  $cond: [
                    { $in: ["$type", ["salary", "outflow"]] },
                    "$amount",
                    0,
                  ],
                },
              },
            },
          },
        ]),
        // Academic Performance
        Mark.aggregate([
          { $match: { schoolId } },
          { $unwind: "$students" },
          {
            $project: {
              _id: 0,
              groupId: "$groupId",
              studentId: "$students.studentId",
              trimesterAvgs: {
                $map: {
                  input: "$students.trimesters",
                  as: "t",
                  in: {
                    $let: {
                      vars: {
                        modules: { $objectToArray: "$$t.modules" },
                      },
                      in: {
                        $divide: [
                          {
                            $sum: {
                              $map: {
                                input: "$$modules",
                                as: "m",
                                in: {
                                  $multiply: [
                                    "$$m.v.value",
                                    "$$m.v.coefficient",
                                  ],
                                },
                              },
                            },
                          },
                          {
                            $sum: {
                              $map: {
                                input: "$$modules",
                                as: "m",
                                in: "$$m.v.coefficient",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          { $unwind: "$trimesterAvgs" },
          { $match: { trimesterAvgs: { $ne: null } } },
          {
            $group: {
              _id: "$groupId",
              studentCount: { $addToSet: "$studentId" },
              avgGradeSum: { $sum: "$trimesterAvgs" },
              trimesterCount: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "groups",
              localField: "_id",
              foreignField: "id",
              as: "groupInfo",
            },
          },
          { $unwind: "$groupInfo" },
          {
            $project: {
              _id: 0,
              level: "$groupInfo.level",
              speciality: "$groupInfo.speciality.name",
              studentCount: { $size: "$studentCount" },
              averageGrade: { $divide: ["$avgGradeSum", "$trimesterCount"] },
            },
          },
        ]),
        // Worker Attendance
        Attendance.find({
          schoolId,
          date: { $gte: thirtyDaysAgo.toISOString().split("T")[0] },
        }),
        // Student Absences (total counts)
        StudentsAttendance.aggregate([
          {
            $match: {
              schoolId: new mongoose.Types.ObjectId(schoolId),
              date: { $gte: thirtyDaysAgo },
            },
          },
          { $unwind: "$moduleEntries" },
          { $unwind: "$moduleEntries.absentees" },
          {
            $group: {
              _id: "$moduleEntries.absentees.status",
              count: { $sum: 1 },
            },
          },
        ]),
        // Student Attendance by Group (hotspots)
        StudentsAttendance.aggregate([
          {
            $match: {
              schoolId: new mongoose.Types.ObjectId(schoolId),
              date: { $gte: thirtyDaysAgo },
            },
          },
          { $unwind: "$moduleEntries" },
          { $unwind: "$moduleEntries.absentees" },
          { $group: { _id: "$groupId", totalAbsences: { $sum: 1 } } },
          { $sort: { totalAbsences: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "groups",
              localField: "_id",
              foreignField: "id",
              as: "groupInfo",
            },
          },
          { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 0,
              groupName: { $ifNull: ["$groupInfo.groupName", "$_id"] },
              totalAbsences: 1,
            },
          },
        ]),
        // Top Teachers by assignment count
        Teacher.aggregate([
          { $match: { schoolId: schoolId } },
          {
            $project: { full_name: 1, groupCount: { $size: "$currentGroups" } },
          },
          { $sort: { groupCount: -1 } },
          { $limit: 5 },
        ]),
      ]);

      // Process Finance
      const finance = financeSummary[0] || { totalIncome: 0, totalExpenses: 0 };
      finance.netProfit = finance.totalIncome - finance.totalExpenses;

      // Process Worker Attendance
      const workerBreakdown = {};
      let presentOrLate = 0;
      workerAttendanceRecords.forEach((day) => {
        day.records.forEach((rec) => {
          workerBreakdown[rec.status] = (workerBreakdown[rec.status] || 0) + 1;
          if (rec.status === "Present" || rec.status === "Late")
            presentOrLate++;
        });
      });
      const totalWorkerRecords = Object.values(workerBreakdown).reduce(
        (a, b) => a + b,
        0
      );
      const workerPercentage =
        totalWorkerRecords > 0
          ? Math.round((presentOrLate / totalWorkerRecords) * 100)
          : 0;

      // Process Student Attendance
      const studentAbsences = studentAbsenceRecords.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      res.status(200).json({
        pedagogy: pedagogyStats,
        finance,
        academics: academicPerformance,
        attendance: {
          workerPercentage,
          workerBreakdown,
          studentAbsences,
          studentAttendanceByGroup,
        },
        topTeachers,
      });
    } catch (err) {
      console.error("Dashboard overview error:", err);
      res.status(500).json({ error: "Failed to fetch dashboard overview" });
    }
  }
);

headmasterRouter.post("/member", authenticateHeadMaster, checkSubscription, async (req, res) => {
  try {
    const { username, password, full_name, phone_number, email } = req.body;
    const schoolId = req.school.schoolId;
    const fullUsername = `ad${username}@${req.school.derivationKey}`;

    if (!username || !password || !full_name || !phone_number || !email) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await Member.findOne({
      $or: [{ email }, { fullUsername }, { phone_number }],
      schoolId,
    });
    if (existing) {
      return res.status(409).json({
        error:
          "A member with this username, email, or phone number already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({
      username,
      full_name,
      phone_number,
      email,
      fullUsername,
      password: hashedPassword,
      role: "STAFF",
      schoolId,
    });
    await newMember.save();

    const { password: _, ...memberData } = newMember.toObject();
    res.status(201).json({
      message: "STAFF member created successfully",
      member: memberData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create staff member" });
  }
});

headmasterRouter.get("/members", authenticateHeadMaster, checkSubscription, async (req, res) => {
  try {
    const schoolId = req.school.schoolId;
    const members = await Member.find({ schoolId })
      .select("-password -__v")
      .lean();
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get members" });
  }
});

headmasterRouter.put(
  "/member/:id",
  authenticateHeadMaster,
  checkSubscription,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name, phone_number, email, password } = req.body;
      const schoolId = req.school.schoolId;

      const member = await Member.findOne({ _id: id, schoolId });

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      if (email && email !== member.email) {
        const existing = await Member.findOne({
          email,
          schoolId,
          _id: { $ne: id },
        });
        if (existing)
          return res
            .status(409)
            .json({ error: "Email is already in use by another member." });
        member.email = email;
      }

      if (phone_number && phone_number !== member.phone_number) {
        const existing = await Member.findOne({
          phone_number,
          schoolId,
          _id: { $ne: id },
        });
        if (existing)
          return res.status(409).json({
            error: "Phone number is already in use by another member.",
          });
        member.phone_number = phone_number;
      }

      if (full_name) member.full_name = full_name;

      if (password) {
        if (password.length < 8)
          return res
            .status(400)
            .json({ error: "Password must be at least 8 characters long" });
        member.password = await bcrypt.hash(password, 10);
      }

      await member.save();

      const sanitizedMember = member.toObject();
      delete sanitizedMember.password;
      delete sanitizedMember.__v;

      res.status(200).json({
        message: "Staff member updated successfully",
        member: sanitizedMember,
      });
    } catch (err) {
      console.error("Failed to update staff member:", err);
      res.status(500).json({ error: "Failed to update staff member" });
    }
  }
);

headmasterRouter.post(
  "/school/tabspwds",
  authenticateHeadMaster,
  checkSubscription,
  async (req, res) => {
    try {
      const { pedagogy, finance, attendance, assets } = req.body;
      const schoolId = req.school.schoolId;
      const school = await School.findById(schoolId);

      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      if (pedagogy)
        school.information.tabspwds.pedagogy = await bcrypt.hash(pedagogy, 10);
      if (finance)
        school.information.tabspwds.finance = await bcrypt.hash(finance, 10);
      if (attendance)
        school.information.tabspwds.attendance = await bcrypt.hash(
          attendance,
          10
        );
      if (assets)
        school.information.tabspwds.assets = await bcrypt.hash(assets, 10);

      await school.save();

      res.json({
        message: "Tab passwords updated successfully",
        updated: {
          pedagogy: !!pedagogy,
          finance: !!finance,
          attendance: !!attendance,
          assets: !!assets,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update tab passwords" });
    }
  }
);

// School Settings Routes
headmasterRouter.get(
  "/school/settings",
  authenticateHeadMaster,
  checkSubscription,
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const school = await School.findById(schoolId).select(
        "information derivationKey"
      );
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.status(200).json(school);
    } catch (error) {
      console.error("Failed to fetch school settings:", error);
      res.status(500).json({ error: "Failed to fetch school settings" });
    }
  }
);

headmasterRouter.put(
  "/school/settings",
  authenticateHeadMaster,
  checkSubscription,
  async (req, res) => {
    try {
      const { name, location } = req.body;
      const schoolId = req.school.schoolId;

      if (!name && !location) {
        return res.status(400).json({ error: "No update data provided." });
      }

      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      if (name) school.information.name = name;
      if (location) {
        if (location.x) school.information.location.x = location.x;
        if (location.y) school.information.location.y = location.y;
      }

      await school.save();
      res
        .status(200)
        .json({
          message: "School settings updated successfully.",
          school: {
            information: school.information,
            derivationKey: school.derivationKey,
          },
        });
    } catch (error) {
      console.error("Failed to update school settings:", error);
      res.status(500).json({ error: "Failed to update school settings" });
    }
  }
);

headmasterRouter.get("/groups", authenticateHeadMaster, checkSubscription, async (req, res) => {
  try {
    const schoolId = req.school.schoolId;
    const groups = await Group.find({ schoolId }).select("groupName id level speciality season").lean();
    
    // Map id to groupId for frontend consistency if needed, or just let frontend handle it
    // The Group model says 'id' is the readable ID (groupId). 
    // And 'groupName' is the name.
    
    // We return them as is, frontend expects 'groupId' in teacherInfo.currentGroups.
    // So we might want to map id -> groupId here or in frontend service.
    // Let's return as is.
    const mappedGroups = groups.map(g => ({
      ...g,
      groupId: g.id // Map id to groupId because frontend expects groupId in teacherInfo
    }));

    res.json(mappedGroups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

export default headmasterRouter;
