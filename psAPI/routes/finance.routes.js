import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Attendance from "../models/attendance.model.js"; // <-- make sure this is the right path

// Middleware
import authStaff from "../middlewares/authStaff.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";
import { authTabAccess } from "../middlewares/authTabAcees.middleware.js";

// Config
import { TAB_SECRET } from "../config/env.js";

// Models
import School from "../models/school.model.js";
import FinancialProfile from "../models/finance/financialProfile.model.js";
import StudentFinancialProfile from "../models/finance/FinancialProfileStudent.model.js";
import TeacherFinancialProfile from "../models/finance/FinancialProfileTeacher.model.js";
import EmployeeFinancialProfile from "../models/finance/FinancialProfileEmployee.model.js";
import Transaction from "../models/finance/transaction.model.js";
import StudentPayment from "../models/finance/studentPayment.model.js";
import Member from "../models/member.model.js";

const financeRouter = Router();

// ===================================================================
// Authentication + Access Control
// ===================================================================

// Apply auth first, then subscription check
financeRouter.use(authStaff);
financeRouter.use(checkSubscription);

financeRouter.post("/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    const schoolId = req.school.schoolId;

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ error: "School not found" });

    const hashedPassword = school.information.tabspwds.finance;
    if (!hashedPassword)
      return res.status(400).json({ valid: false, error: "Password not set" });

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch)
      return res.status(401).json({ valid: false, error: "Invalid password" });

    const tabToken = jwt.sign({ tab: "finance", schoolId }, TAB_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("tab_access_token", tabToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ valid: true, message: "Access granted" });
  } catch (err) {
    console.error("Verify password error:", err);
    res.status(500).json({ valid: false, error: "Server error" });
  }
});

financeRouter.post("/revoke-access", (req, res) => {
  try {
    res.clearCookie("tab_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Access revoked" });
  } catch (err) {
    console.error("Revoke access error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protect below routes with tab access
financeRouter.use(authTabAccess("finance"));

financeRouter.get("/", (req, res) => {
  res.status(200).send({ granted: true, message: "Finance access granted" });
});

// ===================================================================
// Missing Profiles
// ===================================================================

financeRouter.get("/profiles/missing", async (req, res) => {
  const schoolId = req.school.schoolId;
  try {
    const studentProfiles = await StudentFinancialProfile.find({
      schoolId,
    }).select("studentId");
    const teacherProfiles = await TeacherFinancialProfile.find({
      schoolId,
    }).select("teacherId");

    const linkedStudents = studentProfiles.map((p) => p.studentId);
    const linkedTeachers = teacherProfiles.map((p) => p.teacherId);

    const missingStudents = await Member.find({
      schoolId,
      role: "STUDENT",
      _id: { $nin: linkedStudents },
    }).select("full_name email role");

    const missingTeachers = await Member.find({
      schoolId,
      role: "TEACHER",
      _id: { $nin: linkedTeachers },
    }).select("full_name email role");

    res
      .status(200)
      .json({ students: missingStudents, teachers: missingTeachers });
  } catch (err) {
    console.error("Missing profiles error:", err);
    res.status(500).json({
      error: "Failed to fetch missing profiles",
      details: err.message,
    });
  }
});

// ===================================================================
// Profiles CRUD
// ===================================================================

financeRouter.post("/profiles", async (req, res) => {
  const { memberId, role, profileData } = req.body;
  const schoolId = req.school.schoolId;

  try {
    let ProfileModel;

    if (role === "STUDENT") {
      if (!memberId)
        return res.status(400).json({ error: "Student ID required" });
      const student = await Member.findOne({
        _id: memberId,
        schoolId,
        role: "STUDENT",
      });
      if (!student) return res.status(404).json({ error: "Student not found" });

      ProfileModel = StudentFinancialProfile;
      const exists = await ProfileModel.findOne({
        schoolId,
        studentId: memberId,
      });
      if (exists)
        return res.status(409).json({ error: "Profile already exists" });

      const newProfile = new ProfileModel({
        ...profileData,
        schoolId,
        studentId: memberId,
      });
      await newProfile.save();
      return res
        .status(201)
        .json({ message: "Profile created", profile: newProfile });
    }

    if (role === "TEACHER") {
      if (!memberId)
        return res.status(400).json({ error: "Teacher ID required" });
      const teacher = await Member.findOne({
        _id: memberId,
        schoolId,
        role: "TEACHER",
      });
      if (!teacher) return res.status(404).json({ error: "Teacher not found" });

      ProfileModel = TeacherFinancialProfile;
      const exists = await ProfileModel.findOne({
        schoolId,
        teacherId: memberId,
      });
      if (exists)
        return res.status(409).json({ error: "Profile already exists" });

      const newProfile = new ProfileModel({
        ...profileData,
        schoolId,
        teacherId: memberId,
      });
      await newProfile.save();
      return res
        .status(201)
        .json({ message: "Profile created", profile: newProfile });
    }

    if (role === "STAFF") {
      ProfileModel = EmployeeFinancialProfile;
      const newProfile = new ProfileModel({ ...profileData, schoolId });
      await newProfile.save();
      return res
        .status(201)
        .json({ message: "Profile created", profile: newProfile });
    }

    return res.status(400).json({ error: "Invalid role" });
  } catch (err) {
    console.error("Create profile error:", err);
    res
      .status(500)
      .json({ error: "Failed to create profile", details: err.message });
  }
});

/**
 * @route POST /profiles/bulk
 * @desc Create multiple financial profiles at once
 * @body { profiles: { memberId?: string, role: "STUDENT"|"TEACHER"|"STAFF", profileData?: object }[] }
 * @access Private (Finance Staff)
 */
financeRouter.post("/profiles/bulk", async (req, res) => {
  const { profiles } = req.body;
  const schoolId = req.school.schoolId;

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return res.status(400).json({ error: "Profiles array is required" });
  }

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const payload of profiles) {
    const { memberId, role, profileData = {} } = payload;

    try {
      let ProfileModel;

      if (role === "STUDENT") {
        if (!memberId) throw new Error("Student ID required");
        const student = await Member.findOne({
          _id: memberId,
          schoolId,
          role: "STUDENT",
        });
        if (!student) throw new Error("Student not found");

        ProfileModel = StudentFinancialProfile;
        const exists = await ProfileModel.findOne({
          schoolId,
          studentId: memberId,
        });
        if (exists) throw new Error("Profile already exists");

        const newProfile = new ProfileModel({
          ...profileData,
          schoolId,
          studentId: memberId,
        });
        await newProfile.save();
        successCount++;
        results.push({
          status: "success",
          role,
          memberId,
          profile: newProfile,
        });
      } else if (role === "TEACHER") {
        if (!memberId) throw new Error("Teacher ID required");
        const teacher = await Member.findOne({
          _id: memberId,
          schoolId,
          role: "TEACHER",
        });
        if (!teacher) throw new Error("Teacher not found");

        ProfileModel = TeacherFinancialProfile;
        const exists = await ProfileModel.findOne({
          schoolId,
          teacherId: memberId,
        });
        if (exists) throw new Error("Profile already exists");

        const newProfile = new ProfileModel({
          ...profileData,
          schoolId,
          teacherId: memberId,
        });
        await newProfile.save();
        successCount++;
        results.push({
          status: "success",
          role,
          memberId,
          profile: newProfile,
        });
      } else if (role === "STAFF") {
        ProfileModel = EmployeeFinancialProfile;
        const newProfile = new ProfileModel({ ...profileData, schoolId });
        await newProfile.save();
        successCount++;
        results.push({ status: "success", role, profile: newProfile });
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      errorCount++;
      results.push({
        status: "error",
        role: payload.role,
        memberId: payload.memberId,
        message: err.message,
      });
    }
  }

  return res.status(207).json({
    message: `Bulk creation completed: ${successCount} success, ${errorCount} errors`,
    successCount,
    errorCount,
    results,
  });
});

// financeRouter.get("/profiles", async (req, res) => {
//   const { role } = req.query;
//   const schoolId = req.school.schoolId;

//   try {
//     let profiles = [];

//     if (!role || role.toUpperCase() === "STUDENT") {
//       const students = await StudentFinancialProfile.find({ schoolId })
//         .populate("studentId", "full_name email")
//         .populate({
//           path: "transactions",
//           options: { sort: { createdAt: -1 } }, // newest first
//         });
//       if (!role) profiles.push(...students);
//       else profiles = students;
//     }

//     if (!role || role.toUpperCase() === "TEACHER") {
//       const teachers = await TeacherFinancialProfile.find({ schoolId })
//         .populate("teacherId", "full_name email")
//         .populate({
//           path: "transactions",
//           options: { sort: { createdAt: -1 } },
//         });
//       if (!role) profiles.push(...teachers);
//       else profiles = teachers;
//     }

//     if (!role || role.toUpperCase() === "STAFF") {
//       const employees = await EmployeeFinancialProfile.find({
//         schoolId,
//       }).populate({
//         path: "transactions",
//         options: { sort: { createdAt: -1 } },
//       });
//       if (!role) profiles.push(...employees);
//       else profiles = employees;
//     }

//     res.status(200).json(profiles);
//   } catch (err) {
//     console.error("Fetch profiles error:", err);
//     res.status(500).json({
//       error: "Failed to fetch profiles",
//       details: err.message,
//     });
//   }
// });

financeRouter.get("/profiles", async (req, res) => {
  const { role } = req.query;
  const schoolId = req.school.schoolId;

  try {
    let profiles = [];

    // ----- Date range for current month -----
    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getMonth() - 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // 1️⃣ Get all attendance docs for this school in the current month
    const monthAttendance = await Attendance.find({
      schoolId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    }).lean();

    // Helper to extract attendance for one member
    const buildAttendanceReport = (memberId) => {
      const report = [];

      for (const day of monthAttendance) {
        const record = day.records.find(
          (r) => r.memberId.toString() === memberId.toString()
        );

        if (record) {
          report.push({
            date: day.date,
            status: record.status,
            time: record.attendanceTime || null,
            remarks: record.remarks || "",
          });
        } else {
          // Member missing from record → treat as "Unmarked"
          report.push({
            date: day.date,
            status: "Unmarked",
            time: null,
            remarks: "",
          });
        }
      }

      return report;
    };

    // ---------------- Students ----------------
    if (!role || role.toUpperCase() === "STUDENT") {
      const students = await StudentFinancialProfile.find({ schoolId })
        .populate("studentId", "full_name email")
        .populate({
          path: "transactions",
          options: { sort: { createdAt: -1 } },
        });

      if (!role) profiles.push(...students);
      else profiles = students;
    }

    // ---------------- Teachers ----------------
    if (!role || role.toUpperCase() === "TEACHER") {
      const teachers = await TeacherFinancialProfile.find({ schoolId })
        .populate("teacherId", "full_name email")
        .populate({
          path: "transactions",
          options: { sort: { createdAt: -1 } },
        });

      const teachersWithAttendance = teachers.map((profile) => ({
        ...profile.toObject(),
        attendanceReport: buildAttendanceReport(profile._id),
      }));

      if (!role) profiles.push(...teachersWithAttendance);
      else profiles = teachersWithAttendance;
    }

    // ---------------- Staff ----------------
    if (!role || role.toUpperCase() === "STAFF") {
      const employees = await EmployeeFinancialProfile.find({
        schoolId,
      }).populate({
        path: "transactions",
        options: { sort: { createdAt: -1 } },
      });

      const employeesWithAttendance = employees.map((profile) => {
        return {
          ...profile.toObject(),
          attendanceReport: profile ? buildAttendanceReport(profile._id) : [],
        };
      });

      if (!role) profiles.push(...employeesWithAttendance);
      else profiles = employeesWithAttendance;
    }

    res.status(200).json(profiles);
  } catch (err) {
    console.error("Fetch profiles error:", err);
    res.status(500).json({
      error: "Failed to fetch profiles",
      details: err.message,
    });
  }
});

financeRouter.get("/profiles/:profileId", async (req, res) => {
  try {
    const profile = await FinancialProfile.findById(req.params.profileId)
      .populate("studentId", "full_name email")
      .populate("teacherId", "full_name email")
      .populate("transactions");

    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch profile", details: err.message });
  }
});

financeRouter.put("/profiles/:profileId", async (req, res) => {
  const { profileId } = req.params;
  const updates = req.body;

  try {
    // Find the profile first
    const existingProfile = await FinancialProfile.findById(profileId);
    if (!existingProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    let updatedProfile;

    // Choose the correct model based on role
    switch (existingProfile.role) {
      case "STUDENT":
        updatedProfile = await StudentFinancialProfile.findByIdAndUpdate(
          profileId,
          updates,
          { new: true, runValidators: true }
        ).populate("studentId", "full_name email transactions");
        break;

      case "TEACHER":
        updatedProfile = await TeacherFinancialProfile.findByIdAndUpdate(
          profileId,
          updates,
          { new: true, runValidators: true }
        ).populate("teacherId", "full_name email transactions");
        break;

      case "STAFF":
        updatedProfile = await EmployeeFinancialProfile.findByIdAndUpdate(
          profileId,
          updates,
          { new: true, runValidators: true }
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid profile role" });
    }

    res.status(200).json({
      message: "Profile updated",
      profile: updatedProfile,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      error: "Failed to update profile",
      details: err.message,
    });
  }
});

financeRouter.delete("/profiles/:profileId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const profile = await FinancialProfile.findById(
      req.params.profileId
    ).session(session);
    if (!profile) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Profile not found" });
    }

    await Transaction.deleteMany({ paymentProfileId: profile._id }).session(
      session
    );
    await FinancialProfile.findByIdAndDelete(profile._id).session(session);

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Profile & transactions deleted" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete profile error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete profile", details: err.message });
  }
});

// ===================================================================
// Transactions
// ===================================================================

financeRouter.post("/transactions", async (req, res) => {
  const {
    paymentProfileId,
    amount,
    type,
    description,
    paymentMethod,
    reference,
  } = req.body;
  const schoolId = req.school.schoolId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let profile = null;

    // Only fetch profile if paymentProfileId is provided
    if (paymentProfileId) {
      profile = await FinancialProfile.findById(paymentProfileId).session(
        session
      );
      if (!profile) {
        throw new Error("Profile not found");
      }
    }

    // Create transaction
    const transaction = new Transaction({
      schoolId,
      paymentProfileId: paymentProfileId || null, // allow null
      amount,
      type,
      description,
      paymentMethod,
      reference,
    });
    await transaction.save({ session });

    // Link transaction to profile if exists
    if (profile) {
      profile.transactions.push(transaction._id);

      if (type === "salary") {
        profile.lastPayment = {
          date: new Date(),
          amount,
          transactionId: transaction._id,
        };
      }

      await profile.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction error:", err);
    res
      .status(500)
      .json({ error: "Failed to create transaction", details: err.message });
  }
});

financeRouter.post("/transactions/student-payment", async (req, res) => {
  const { studentId, amount, paymentPlan, description, paymentMethod } =
    req.body;
  const schoolId = req.school.schoolId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const studentProfile = await StudentFinancialProfile.findOne({
      studentId,
      schoolId,
    }).session(session);
    if (!studentProfile) throw new Error("Student profile not found");

    const payment = new StudentPayment({
      schoolId,
      paymentProfileId: studentProfile._id,
      studentId,
      amount,
      paymentPlan,
      description,
      paymentMethod,
      type: "student_fees",
    });
    await payment.save({ session });

    studentProfile.transactions.push(payment._id);
    await studentProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Student payment recorded", payment });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Student payment error:", err);
    res
      .status(500)
      .json({ error: "Failed to record payment", details: err.message });
  }
});

financeRouter.get("/transactions", async (req, res) => {
  const { type } = req.query;
  const schoolId = req.school.schoolId;
  const filter = { schoolId };
  if (type) filter.type = type;

  try {
    const transactions = await Transaction.find(filter)
      .populate({
        path: "paymentProfileId",
        select: "-transactions",
        populate: [
          { path: "studentId", select: "full_name" },
          { path: "teacherId", select: "full_name" },
        ],
      })
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Fetch transactions error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

financeRouter.delete("/transactions/:transactionId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    ).session(session);
    if (!transaction) throw new Error("Transaction not found");

    await FinancialProfile.findByIdAndUpdate(transaction.paymentProfileId, {
      $pull: { transactions: transaction._id },
    }).session(session);

    await Transaction.findByIdAndDelete(req.params.transactionId).session(
      session
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete transaction error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete transaction", details: err.message });
  }
});

// ===================================================================
// Dashboard
// ===================================================================

financeRouter.get("/dashboard-stats", async (req, res) => {
  const schoolId = req.school.schoolId;

  try {
    // Fetch all transactions for this school
    const transactions = await Transaction.find({ schoolId }).sort({
      createdAt: 1,
    });

    // Count profiles
    const [studentCount, teacherCount, employeeCount] = await Promise.all([
      StudentFinancialProfile.countDocuments({ schoolId }),
      TeacherFinancialProfile.countDocuments({ schoolId }),
      EmployeeFinancialProfile.countDocuments({ schoolId }),
    ]);

    // If no transactions, return default response
    if (!transactions.length) {
      return res.status(200).json({
        message: "No financial data available yet.",
        overall: {
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0,
          profileCounts: {
            students: studentCount,
            teachers: teacherCount,
            employees: employeeCount,
          },
          incomeByType: {},
          expensesByType: {},
        },
        monthlyData: [],
        latestTransactions: [],
      });
    }

    const INCOME_TYPES = ["student_fees", "inflow"];
    const EXPENSE_TYPES = ["salary", "outflow"];

    // Aggregate overall and monthly stats
    const overall = {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      incomeByType: {},
      expensesByType: {},
      profileCounts: {
        students: studentCount,
        teachers: teacherCount,
        employees: employeeCount,
      },
    };

    const monthlyMap = new Map();

    transactions.forEach((t) => {
      const monthKey = t.createdAt.toISOString().slice(0, 7); // "YYYY-MM"

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          totalIncome: 0,
          totalExpenses: 0,
          net: 0,
          transactionCount: 0,
          incomeByType: {},
          expensesByType: {},
        });
      }

      const monthStats = monthlyMap.get(monthKey);
      monthStats.transactionCount++;

      if (INCOME_TYPES.includes(t.type)) {
        monthStats.totalIncome += t.amount;
        monthStats.incomeByType[t.type] =
          (monthStats.incomeByType[t.type] || 0) + t.amount;
        overall.totalIncome += t.amount;
        overall.incomeByType[t.type] =
          (overall.incomeByType[t.type] || 0) + t.amount;
      } else if (EXPENSE_TYPES.includes(t.type)) {
        monthStats.totalExpenses += t.amount;
        monthStats.expensesByType[t.type] =
          (monthStats.expensesByType[t.type] || 0) + t.amount;
        overall.totalExpenses += t.amount;
        overall.expensesByType[t.type] =
          (overall.expensesByType[t.type] || 0) + t.amount;
      }
    });

    overall.netProfit = overall.totalIncome - overall.totalExpenses;

    // Fill in missing months up to current month
    const finalMonthlyData = [];
    const start = new Date(transactions[0].createdAt);
    const end = new Date();
    let year = start.getFullYear();
    let month = start.getMonth(); // 0-based

    while (
      year < end.getFullYear() ||
      (year === end.getFullYear() && month <= end.getMonth())
    ) {
      const monthKey = `${year}-${(month + 1).toString().padStart(2, "0")}`;
      const data = monthlyMap.get(monthKey) || {
        month: monthKey,
        totalIncome: 0,
        totalExpenses: 0,
        net: 0,
        transactionCount: 0,
        incomeByType: { student_fees: 0, inflow: 0 },
        expensesByType: { salary: 0, outflow: 0 },
      };
      data.net = data.totalIncome - data.totalExpenses;
      finalMonthlyData.push(data);

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }

    // Fetch latest 10 transactions with populated profiles
    const latestTransactions = await Transaction.find({ schoolId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "paymentProfileId",
        select: "role",
        populate: [
          { path: "studentId", select: "full_name" },
          { path: "teacherId", select: "full_name" },
        ],
      });

    res.status(200).json({
      overall,
      monthlyData: finalMonthlyData.reverse(), // most recent first
      latestTransactions,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch dashboard stats", details: err.message });
  }
});

export default financeRouter;
