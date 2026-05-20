import { Router } from "express";
import authStaff from "../middlewares/authStaff.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";
import { authTabAccess } from "../middlewares/authTabAcees.middleware.js";
import { JWT_SECRET, JWT_REFRESH_SECRET, TAB_SECRET } from "../config/env.js";
import Member from "../models/member.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Group from "../models/groupe.model.js"; // import your Group model

import School from "../models/school.model.js"; // import your School model
import SchoolStructure from "../models/specialities.model.js";
import Mark from "../models/mark.model.js";

import { Student } from "../models/student.model.js"; // make sure you import Student
import { Teacher } from "../models/teacher.model.js";
import { Parent } from "../models/parent.model.js"; // Import the Parent model
import Schedule from "../models/schedule.model.js"; // Import the new Schedule model
import { Types } from "mongoose";

import {
  assignTeacherToGroup,
  unassignTeacherFromGroup,
} from "../utils/teacherAssignment.js";

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

const pedagogyRouter = Router();

// Apply auth first, then subscription check
pedagogyRouter.use(authStaff);
pedagogyRouter.use(checkSubscription);

pedagogyRouter.post("/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    const schoolId = req.school.schoolId;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const hashedPassword = school.information.tabspwds.pedagogy;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ valid: false, error: "Invalid password" });
    }

    const tabToken = jwt.sign({ tab: "pedagogy", schoolId }, TAB_SECRET, {
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

pedagogyRouter.post("/revoke-access", (req, res) => {
  try {
    res.clearCookie("tab_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Tab access revoked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to revoke tab access" });
  }
});

pedagogyRouter.get(
  "/",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    res.send({
      message: "pedagogy tab access granted",
    });
  }
);

pedagogyRouter.get(
  "/members",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const members = await Member.find({ schoolId })
        .select("-password -__v -updatedAt -fullUsername -username -schoolId")
        .sort({ createdAt: -1 });
      res.json(members);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  }
);

pedagogyRouter.get(
  "/member/:username",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const usernameParam = req.params.username;
      const schoolId = req.school.schoolId.toString();
      const member = await Member.findOne({
        $or: [
          { username: usernameParam },
          { fullUsername: usernameParam },
          { email: usernameParam },
        ],
        schoolId,
      });

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      if (member.schoolId.toString() !== req.school.schoolId.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (
        member.role !== "TEACHER" &&
        member.role !== "STUDENT" &&
        member.role !== "PARENT"
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({
        ...member._doc,
        password: undefined,
        __v: undefined,
        updatedAt: undefined,
        fullUsername: undefined,
        username: undefined,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get member info" });
    }
  }
);

function getCurrentSchoolSeason() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan, 5 = June

  if (month >= 5) {
    // After May → new season
    return `${(year % 100).toString().padStart(2, "0")}${((year + 1) % 100)
      .toString()
      .padStart(2, "0")}`;
  } else {
    // Before June → same academic year
    return `${((year - 1) % 100).toString().padStart(2, "0")}${(year % 100)
      .toString()
      .padStart(2, "0")}`;
  }
}

pedagogyRouter.post(
  "/student",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        full_name,
        phone_number,
        email,
        nationality,
        birthDate,
        birthCity,
        sex,
        registeredGroupId,
      } = req.body;

      const role = "STUDENT";
      const schoolId = req.school.schoolId;
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // Check capacity
      const maxStudents = school.information.max_students || 200; // Default fallback
      const currentStudentsCount = await Student.countDocuments({ schoolId });

      if (currentStudentsCount >= maxStudents) {
        return res.status(403).json({
          error: "Student capacity reached. Please upgrade your plan.",
        });
      }

      const fullUsername = `st${username}@${school.derivationKey}`;

      if (
        !username ||
        !password ||
        !full_name ||
        !phone_number ||
        !email ||
        !nationality ||
        !birthDate ||
        !birthCity ||
        !sex
      ) {
        return res
          .status(400)
          .json({ error: "All required fields must be filled" });
      }

      const existing = await Member.findOne({
        $or: [{ email }, { fullUsername }, { phone_number }],
        schoolId,
      });

      if (existing) {
        return res.status(409).json({
          error: "User already exists with this email, phone, or national ID",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const groupHistory = [];
      let registered = false;

      if (registeredGroupId) {
        registered = true;
        const season = getCurrentSchoolSeason();
        groupHistory.push({
          groupId: registeredGroupId,
          season,
        });
      }

      const student = new Student({
        username,
        password: hashedPassword,
        full_name,
        phone_number,
        email,
        fullUsername,
        role,
        schoolId,
        nationality,
        birthDate,
        birthCity,
        sex,
        registeredGroupId: registered ? registeredGroupId : null,
        registered,
        groupHistory,
      });

      await student.save();

      res.status(201).json({
        message: "Student created successfully",
        student: {
          ...student._doc,
          password: undefined,
        },
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: "Duplicate key error", details: err.message });
      }
      res
        .status(500)
        .json({ error: "Failed to create student", details: err.message });
    }
  }
);

// pedagogyRouter.get(
//   "/students",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const schoolId = req.school.schoolId;
//       const students = await Student.find({ schoolId }).select(
//         "-password -__v -updatedAt"
//       );
//       res.status(200).json({ count: students.length, students });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch students" });
//     }
//   }
// );

// pedagogyRouter.get(
//   "/students",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const schoolId = req.school.schoolId;

//       // Get students first
//       const students = await Student.find({ schoolId }).select(
//         "-password -__v -updatedAt -academicHistory"
//       );

//       // Collect all group IDs from students
//       const groupIds = students
//         .map((s) => s.registeredGroupId)
//         .filter((id) => !!id);
//       const groups = await Group.find({ id: { $in: groupIds } }).lean();
//       const groupMap = {};
//       for (const g of groups) {
//         groupMap[g.id] = g;
//       }
//       const enrichedStudents = students.map((student) => ({
//         ...student.toObject(),
//         group: student.registeredGroupId
//           ? groupMap[student.registeredGroupId] || null
//           : null,
//       }));
//       res
//         .status(200)
//         .json({ count: enrichedStudents.length, students: enrichedStudents });
//     } catch (err) {
//       console.error(err);
//       res
//         .status(500)
//         .json({ error: "Failed to fetch students with group info" });
//     }
//   }
// );

pedagogyRouter.get(
  "/students",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;

      // Get students with populated parents
      const students = await Student.find({ schoolId })
        .select("-password -__v -updatedAt -academicHistory")
        .populate("parentAccountIds.father", "full_name email phone_number") // pick fields you want
        .populate("parentAccountIds.mother", "full_name email phone_number");

      // Collect all group IDs from students
      const groupIds = students
        .map((s) => s.registeredGroupId)
        .filter((id) => !!id);

      const groups = await Group.find({ id: { $in: groupIds } }).lean();

      // Build a quick lookup
      const groupMap = {};
      for (const g of groups) {
        groupMap[g.id] = g;
      }

      // Attach group info
      const enrichedStudents = students.map((student) => ({
        ...student.toObject(),
        group: student.registeredGroupId
          ? groupMap[student.registeredGroupId] || null
          : null,
      }));

      res
        .status(200)
        .json({ count: enrichedStudents.length, students: enrichedStudents });
    } catch (err) {
      console.error("Fetch students error:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch students with group and parent info" });
    }
  }
);

pedagogyRouter.post(
  "/groupe",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      var { level, speciality, classNumber, season } = req.body;
      const schoolId = req.school.schoolId;
      if (!season) {
        season = getCurrentSeason();
      }

      // Validate required fields
      if (
        !level ||
        !speciality ||
        !speciality.id ||
        !season ||
        !classNumber ||
        !schoolId
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Fetch the school to get its type (primaire, cem, lycee)
      const school = await School.findById(schoolId);
      if (!school || !school.information?.type) {
        return res
          .status(404)
          .json({ error: "School not found or type missing" });
      }

      const schoolType = school.information.type.toLowerCase(); // 'primaire', 'cem', or 'lycee'

      // Optional: check if speciality is allowed in school's parameters
      if (
        Array.isArray(school.parameters?.specilaities) && // Note: typo preserved if exists in schema
        !school.parameters.specilaities.includes(speciality.id)
      ) {
        return res.status(403).json({
          error: "This speciality is not authorized for this school",
        });
      }

      // Load school structure to validate speciality & level
      const structure = await SchoolStructure.findOne();
      if (!structure || !structure[schoolType]) {
        return res
          .status(404)
          .json({ error: "School structure or type data not found" });
      }

      const specialities = structure[schoolType].specialities || [];
      const matchedSpeciality = specialities.find(
        (s) => s._id.toString() === speciality.id
      );

      if (!matchedSpeciality) {
        return res
          .status(404)
          .json({ error: "Speciality not available for this school type" });
      }

      const matchedLevel = matchedSpeciality.levels.find(
        (lvl) => lvl.level.toString() === level.toString()
      );

      if (!matchedLevel) {
        return res
          .status(404)
          .json({ error: `Level ${level} not defined for this speciality` });
      }

      // ✅ All validations passed - proceed to create the group
      const newGroup = new Group({
        level,
        speciality,
        classNumber,
        schoolId,
        season,
      });

      await newGroup.save();

      res
        .status(201)
        .json({ message: "Group created successfully", group: newGroup });
    } catch (err) {
      console.error(err);

      // Duplicate group (based on unique fields)
      if (err.code === 11000) {
        return res.status(409).json({
          error: "Group with this name already exists",
        });
      }

      // Mongoose validation errors
      if (err.name === "ValidationError") {
        return res.status(400).json({
          error: err.message,
        });
      }

      // Server error
      res.status(500).json({
        error: "Failed to create group",
      });
    }
  }
);

pedagogyRouter.get(
  "/groupes",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const groupes = await Group.find({ schoolId }).sort({ createdAt: -1 });

      res.status(200).json({ count: groupes.length, groupes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch groupes" });
    }
  }
);

pedagogyRouter.get(
  "/groupes/current",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;

      const season = getCurrentSeason();

      const groupes = await Group.find({ schoolId, season }).sort({
        createdAt: -1,
      });

      res.status(200).json({ count: groupes.length, groupes });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to fetch groupes for current season" });
    }
  }
);

// pedagogyRouter.get(
//   "/student/:identifier",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const { identifier } = req.params;
//       const schoolId = req.school.schoolId;
//       let query = {
//         schoolId,
//       };
//       if (Types.ObjectId.isValid(identifier)) {
//         query._id = identifier;
//       } else if (identifier.includes("@")) {
//         query.fullUsername = identifier;
//       } else {
//         const school = await School.findById(schoolId);
//         if (!school) {
//           return res.status(404).json({ error: "School not found" });
//         }
//         query.fullUsername = `st${identifier}@${school.derivationKey}`;
//       }

//       const student = await Student.findOne(query).select(
//         "-password -__v -updatedAt"
//       );

//       if (!student) {
//         return res.status(404).json({ error: "Student not found" });
//       }

//       res.status(200).json({ student });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to get student info" });
//     }
//   }
// );

pedagogyRouter.get(
  "/student/:identifier",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { identifier } = req.params;
      const schoolId = req.school.schoolId;

      let query = { schoolId };

      if (Types.ObjectId.isValid(identifier)) {
        query._id = identifier;
      } else if (identifier.includes("@")) {
        query.fullUsername = identifier;
      } else {
        const school = await School.findById(schoolId);
        if (!school) {
          return res.status(404).json({ error: "School not found" });
        }
        query.fullUsername = `st${identifier}@${school.derivationKey}`;
      }

      const student = await Student.findOne(query).select(
        "-password -__v -updatedAt -academicHistory"
      );

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // --- Fetch the group info if available ---
      let groupInfo = null;
      if (student.registeredGroupId) {
        const group = await Group.findOne({
          id: student.registeredGroupId,
        }).lean();
        if (group) {
          groupInfo = {
            id: group.id,
            level: group.level,
            speciality: group.speciality,
            classNumber: group.classNumber,
            season: group.season,
            groupName: group.groupName,
            schoolId: group.schoolId,
          };
        }
      }

      const enrichedStudent = {
        ...student.toObject(),
        group: groupInfo,
      };

      res.status(200).json({ student: enrichedStudent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get student info" });
    }
  }
);

pedagogyRouter.post(
  "/student/group",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { studentId, groupId } = req.body;
      const schoolId = req.school.schoolId;

      if (!studentId || !groupId) {
        return res
          .status(400)
          .json({ error: "studentId and groupId are required" });
      }

      const group = await Group.findOne({ id: groupId, schoolId });
      if (!group) {
        return res
          .status(404)
          .json({ error: "Group not found or does not belong to your school" });
      }

      const student = await Student.findOne({ _id: studentId, schoolId });
      if (!student) {
        return res.status(404).json({
          error: "Student not found or does not belong to your school",
        });
      }

      if (student.registered) {
        return res
          .status(400)
          .json({ error: "Student is already assigned to a group" });
      }

      student.registeredGroupId = groupId;
      student.registered = true;

      const currentSeason = group.season || getCurrentSchoolSeason();

      const alreadyInHistory = student.groupHistory.some(
        (h) => h.groupId === groupId && h.season === currentSeason
      );
      if (!alreadyInHistory) {
        student.groupHistory.push({ groupId, season: currentSeason });
      }

      await student.save();

      // ✅ Add to marks model
      let marks = await Mark.findOne({ groupId, schoolId });
      if (!marks) {
        marks = new Mark({ groupId, schoolId });
        await marks.validate(); // triggers modulesMeta init
      }

      if (!marks.students.some((s) => s.studentId.toString() === studentId)) {
        const trimesters = [1, 2, 3].map((t) => ({
          trimester: t,
          modules: new Map(
            marks.modulesMeta.map((m) => [
              m.id,
              {
                value: 0,
                coefficient: m.coefficient,
                isOptional: m.isOptional,
                dev1: 0,
                dev2: 0,
                exam: 0,
                constant_observation: 0,
              },
            ])
          ),
        }));

        marks.students.push({ studentId, trimesters });
        await marks.save();
      }

      res.status(200).json({
        message: "Student assigned to group successfully",
        student: {
          studentID: student._id,
          full_name: student.full_name,
          registeredGroupId: student.registeredGroupId,
          registered: student.registered,
          groupHistory: student.groupHistory,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to assign student to group" });
    }
  }
);

pedagogyRouter.post(
  "/student/group/bulk",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { groupId, students: studentIds } = req.body;
    const { schoolId } = req.school;

    if (!groupId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ error: "groupId and a non-empty students array are required" });
    }

    const session = await Student.startSession();
    session.startTransaction();

    try {
      const group = await Group.findOne({ id: groupId, schoolId }).session(
        session
      );
      if (!group) {
        throw new Error("Group not found or does not belong to your school");
      }

      // Find all candidate students at once to check their status
      const studentsToProcess = await Student.find({
        _id: { $in: studentIds },
        schoolId,
      }).session(session);

      const studentMap = new Map(
        studentsToProcess.map((s) => [s._id.toString(), s])
      );

      const success = [];
      const failed = [];
      const studentUpdateOperations = [];
      const newMarksEntries = [];

      const currentSeason = group.season || getCurrentSchoolSeason();

      let marksDoc = await Mark.findOne({ groupId, schoolId }).session(session);
      if (!marksDoc) {
        marksDoc = new Mark({ groupId, schoolId });
        await marksDoc.validate(); // Ensure modulesMeta is initialized
      }

      const existingMarkedStudentIds = new Set(
        marksDoc.students.map((s) => s.studentId.toString())
      );

      for (const studentId of studentIds) {
        const student = studentMap.get(studentId);

        if (!student) {
          failed.push({ studentId, reason: "Not found" });
          continue;
        }

        if (student.registered) {
          failed.push({
            studentId,
            reason: "Already registered to another group",
          });
          continue;
        }

        // Prepare student document update operation
        const updatePayload = {
          $set: {
            registered: true,
            registeredGroupId: groupId,
          },
          $push: { groupHistory: { groupId, season: currentSeason } },
        };
        studentUpdateOperations.push({
          updateOne: { filter: { _id: student._id }, update: updatePayload },
        });

        // Prepare new entry for the Mark document if it doesn't exist yet
        if (!existingMarkedStudentIds.has(student._id.toString())) {
          const trimesters = [1, 2, 3].map((t) => ({
            trimester: t,
            modules: new Map(
              marksDoc.modulesMeta.map((m) => [
                m.id,
                {
                  value: 0,
                  coefficient: m.coefficient,
                  isOptional: m.isOptional,
                  dev1: 0,
                  dev2: 0,
                  exam: 0,
                  constant_observation: 0,
                },
              ])
            ),
          }));
          newMarksEntries.push({ studentId: student._id, trimesters });
        }

        success.push({ studentId: student._id, full_name: student.full_name });
      }

      // Perform bulk database updates if there's anything to update
      if (studentUpdateOperations.length > 0) {
        await Student.bulkWrite(studentUpdateOperations, { session });
      }

      if (newMarksEntries.length > 0) {
        marksDoc.students.push(...newMarksEntries);
        await marksDoc.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Bulk assignment process completed.",
        successCount: success.length,
        failureCount: failed.length,
        success,
        failed,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Server error during bulk group assignment:", err);
      res.status(500).json({
        error: err.message || "Server error during bulk group assignment",
      });
    }
  }
);

// pedagogyRouter.put(
//   "/student/group/change",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const { studentId, newGroupId } = req.body;
//       const schoolId = req.school.schoolId;

//       if (!studentId || !newGroupId) {
//         return res
//           .status(400)
//           .json({ error: "studentId and newGroupId are required" });
//       }

//       const student = await Student.findOne({ _id: studentId, schoolId });
//       if (!student) {
//         return res
//           .status(404)
//           .json({ error: "Student not found or not part of your school" });
//       }

//       const newGroup = await Group.findOne({ id: newGroupId, schoolId });
//       if (!newGroup) {
//         return res
//           .status(404)
//           .json({ error: "Group not found or not part of your school" });
//       }

//       const currentSeason = newGroup.season || getCurrentSchoolSeason();

//       if (!student.registered) {
//         return res
//           .status(400)
//           .json({ error: "Student is not registered to any group yet" });
//       }

//       if (student.registeredGroupId === newGroupId) {
//         return res.status(200).json({
//           message: "Student already registered to this group",
//           student: {
//             studentID: student._id,
//             full_name: student.full_name,
//             registeredGroupId: student.registeredGroupId,
//             groupHistory: student.groupHistory,
//           },
//         });
//       }

//       const oldGroup = await Group.findOne({
//         id: student.registeredGroupId,
//         schoolId,
//       });

//       if (!oldGroup) {
//         return res
//           .status(400)
//           .json({ error: "Old group not found or invalid" });
//       }

//       if (oldGroup.level !== newGroup.level) {
//         return res.status(400).json({
//           error: "Cannot transfer student between different levels",
//         });
//       }

//       const oldGroupId = student.registeredGroupId;

//       // === ⬇️ Handle marks
//       const oldMark = await Mark.findOne({ groupId: oldGroupId });
//       let studentMark = null;

//       if (oldMark) {
//         const foundIndex = oldMark.students.findIndex(
//           (s) => s.studentId.toString() === studentId
//         );

//         if (foundIndex !== -1) {
//           studentMark = oldMark.students[foundIndex];
//           oldMark.students.splice(foundIndex, 1);
//           await oldMark.save();
//         }
//       }

//       let newMark = await Mark.findOne({ groupId: newGroupId, schoolId });
//       if (!newMark) {
//         newMark = new Mark({ groupId: newGroupId, schoolId });
//         await newMark.validate(); // trigger modulesMeta
//       }

//       const alreadyExists = newMark.students.some(
//         (s) => s.studentId.toString() === studentId
//       );

//       if (!alreadyExists) {
//         if (!studentMark) {
//           const trimesters = [1, 2, 3].map((t) => ({
//             trimester: t,
//             modules: new Map(
//               newMark.modulesMeta.map((m) => [
//                 m.id,
//                 {
//                   value: 0,
//                   coefficient: m.coefficient,
//                   isOptional: m.isOptional,
//                   devoir1: 0,
//                   devoir2: 0,
//                   exam: 0,
//                   constant_observation: 0,
//                 },
//               ])
//             ),
//           }));
//           studentMark = { studentId, trimesters };
//         }

//         newMark.students.push(studentMark);
//         await newMark.save();
//       }

//       student.groupHistory.push({
//         groupId: newGroupId,
//         season: currentSeason,
//         reason: "TRANSFERED",
//       });

//       student.registeredGroupId = newGroupId;
//       await student.save();

//       return res.status(200).json({
//         message: "Group changed successfully",
//         student: {
//           studentID: student._id,
//           full_name: student.full_name,
//           registeredGroupId: student.registeredGroupId,
//           groupHistory: student.groupHistory,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Failed to change group for student" });
//     }
//   }
// );

pedagogyRouter.get(
  "/group/:groupId/students",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const schoolId = req.school.schoolId;

      if (!groupId) {
        return res.status(400).json({ error: "Group ID is required" });
      }

      const students = await Student.find({
        schoolId,
        registeredGroupId: groupId,
      }).select("full_name phone_number birthDate sex");

      res.status(200).json({
        groupId,
        count: students.length,
        students,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Failed to fetch students for this group" });
    }
  }
);

pedagogyRouter.get(
  "/students/nogroup",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;

      const studentsWithoutGroup = await Student.find({
        schoolId,
        $or: [
          { registeredGroupId: null },
          { registeredGroupId: { $exists: false } },
        ],
      }).select("full_name email phone_number birthDate sex");

      res.status(200).json({
        count: studentsWithoutGroup.length,
        students: studentsWithoutGroup,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch students without group" });
    }
  }
);

pedagogyRouter.post(
  "/teacher",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        full_name,
        phone_number,
        national_ID,
        email,
        modules,
        currentGroups,
      } = req.body;

      const role = "TEACHER";
      const schoolId = req.school.schoolId;

      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const fullUsername = `tr${username}@${school.derivationKey}`;

      if (
        !username ||
        !password ||
        !full_name ||
        !phone_number ||
        !national_ID ||
        !email ||
        !modules ||
        modules.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "All required fields must be filled" });
      }

      const existing = await Member.findOne({
        $or: [{ email }, { fullUsername }, { phone_number }, { national_ID }],
        schoolId,
      });

      if (existing) {
        return res.status(409).json({
          error: "User already exists with this email, phone, or national ID",
        });
      }

      // ✅ Validate currentGroups: must be array of { groupId, moduleId }
      let validCurrentGroups = [];
      if (Array.isArray(currentGroups)) {
        validCurrentGroups = currentGroups.filter(
          (cg) => cg.groupId && cg.moduleId
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = new Teacher({
        username,
        password: hashedPassword,
        full_name,
        phone_number,
        national_ID,
        email,
        fullUsername,
        role,
        schoolId,
        modules,
        currentGroups: validCurrentGroups,
      });

      await teacher.save();

      res.status(201).json({
        message: "Teacher created successfully",
        teacher: {
          ...teacher._doc,
          password: undefined,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create teacher" });
    }
  }
);

pedagogyRouter.post(
  "/teachers/assign",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { groupId, assignments } = req.body;

      if (!groupId || !Array.isArray(assignments) || assignments.length === 0) {
        return res.status(400).json({
          error: "groupId and a non-empty assignments array are required",
        });
      }

      // ✅ Load group
      const group = await Group.findOne({ id: groupId });
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // ✅ Load structure
      const structure = await SchoolStructure.findOne({
        $or: [
          { "primaire.specialities._id": group.speciality.id },
          { "cem.specialities._id": group.speciality.id },
          { "lycee.specialities._id": group.speciality.id },
        ],
      });
      if (!structure) {
        return res
          .status(404)
          .json({ error: "Speciality structure not found" });
      }

      // ✅ Get speciality info
      const schoolTypes = ["primaire", "cem", "lycee"];
      let speciality = null;
      for (const type of schoolTypes) {
        const specialities = structure[type]?.specialities || [];
        const match = specialities.find(
          (s) => s._id.toString() === group.speciality.id.toString()
        );
        if (match) {
          speciality = match;
          break;
        }
      }
      if (!speciality) {
        return res
          .status(404)
          .json({ error: "Speciality not found in structure" });
      }

      // ✅ Get level info
      const levelData = speciality.levels.find(
        (lvl) => lvl.level === group.level
      );
      if (!levelData) {
        return res.status(404).json({ error: "Level not found in speciality" });
      }

      // ✅ Allowed modules
      const allowedModuleIds = new Set(levelData.modules.map((m) => m.id));
      const existingModules = new Set(group.teachers.map((t) => t.moduleId));
      const teachersToUpdate = {};
      const successful = [];
      const failed = [];

      for (const { teacherId, moduleId } of assignments) {
        try {
          if (!teacherId || !moduleId) {
            failed.push({
              teacherId,
              moduleId,
              reason: "Missing teacherId or moduleId",
            });
            continue;
          }

          if (!allowedModuleIds.has(moduleId)) {
            failed.push({
              teacherId,
              moduleId,
              reason: `Module ${moduleId} not allowed for this group's level/speciality`,
            });
            continue;
          }

          if (existingModules.has(moduleId)) {
            failed.push({
              teacherId,
              moduleId,
              reason: `Module ${moduleId} already assigned in this group`,
            });
            continue;
          }

          let teacher = teachersToUpdate[teacherId];
          if (!teacher) {
            teacher = await Teacher.findById(teacherId);
            if (!teacher) {
              failed.push({
                teacherId,
                moduleId,
                reason: `Teacher ${teacherId} not found`,
              });
              continue;
            }
            teachersToUpdate[teacherId] = teacher;
          }

          const hasModule = teacher.modules.some((m) => m.id === moduleId);
          if (!hasModule) {
            failed.push({
              teacherId,
              moduleId,
              reason: `Teacher ${teacherId} does not have module ${moduleId}`,
            });
            continue;
          }

          const alreadyTeaching = group.teachers.some(
            (t) =>
              t.teacherId.toString() === teacherId && t.moduleId === moduleId
          );
          if (alreadyTeaching) {
            failed.push({
              teacherId,
              moduleId,
              reason: `Teacher ${teacherId} already teaches module ${moduleId} in this group`,
            });
            continue;
          }

          // ✅ Assign
          group.teachers.push({ teacherId, moduleId });
          teacher.currentGroups.push({ groupId, moduleId });
          teacher.teachingHistory.push({
            groupId,
            moduleId,
            reason: "assigned",
            timestamp: new Date(),
          });

          existingModules.add(moduleId);
          successful.push({ teacherId, moduleId, status: "assigned" });
        } catch (err) {
          failed.push({
            teacherId,
            moduleId,
            reason: `Unexpected error: ${err.message}`,
          });
        }
      }

      await group.save();
      await Promise.all(Object.values(teachersToUpdate).map((t) => t.save()));

      res.json({
        message: "Assignment process completed",
        groupId: group.id,
        successful,
        failed,
        updatedTeachers: Object.values(teachersToUpdate).map((teacher) => ({
          _id: teacher._id,
          full_name: teacher.full_name,
          currentGroups: teacher.currentGroups,
          teachingHistory: teacher.teachingHistory,
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to assign teachers" });
    }
  }
);

pedagogyRouter.post(
  "/teachers/unassign",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { teacherId, assignments } = req.body;

      if (
        !teacherId ||
        !Array.isArray(assignments) ||
        assignments.length === 0
      ) {
        return res.status(400).json({
          error: "teacherId and a non-empty assignments array are required",
        });
      }

      // ✅ Fetch teacher
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      // ✅ Group cache to avoid multiple DB calls
      const groupCache = {};
      const unassigned = [];
      const failed = [];

      for (const { groupId, moduleId } of assignments) {
        if (!groupId || !moduleId) {
          failed.push({
            groupId,
            moduleId,
            reason: "Missing groupId or moduleId",
          });
          continue;
        }

        // ✅ Load group
        let group = groupCache[groupId];
        if (!group) {
          group = await Group.findOne({ id: groupId });
          if (!group) {
            failed.push({
              groupId,
              moduleId,
              reason: "Group not found",
            });
            continue;
          }
          groupCache[groupId] = group;
        }

        // ✅ Check if teacher is assigned to this module in this group
        const isAssigned = group.teachers.some(
          (t) => t.teacherId.toString() === teacherId && t.moduleId === moduleId
        );
        if (!isAssigned) {
          failed.push({
            groupId,
            moduleId,
            reason: "Teacher is not assigned to this module in the group",
          });
          continue;
        }

        // ✅ Remove from group.teachers
        group.teachers = group.teachers.filter(
          (t) =>
            !(t.teacherId.toString() === teacherId && t.moduleId === moduleId)
        );

        // ✅ Remove from teacher.currentGroups
        teacher.currentGroups = teacher.currentGroups.filter(
          (g) => !(g.groupId === groupId && g.moduleId === moduleId)
        );

        // ✅ Add to teachingHistory
        teacher.teachingHistory.push({
          groupId,
          moduleId,
          reason: "removed",
          timestamp: new Date(),
        });

        unassigned.push({ groupId, moduleId });
      }

      // ✅ Save changes
      await Promise.all(Object.values(groupCache).map((g) => g.save()));
      await teacher.save();

      res.status(200).json({
        message: "Unassignment operation completed",
        teacherId,
        unassigned,
        failed,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to unassign teacher" });
    }
  }
);

pedagogyRouter.put(
  "/teacher/:id",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        username,
        password,
        full_name,
        phone_number,
        national_ID,
        email,
        modules,
        currentGroups,
      } = req.body;

      const schoolId = req.school.schoolId;
      const teacher = await Teacher.findOne({ _id: id, schoolId });

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      // Update only provided fields
      if (username) teacher.username = username;
      if (password) teacher.password = await bcrypt.hash(password, 10);
      if (full_name) teacher.full_name = full_name;
      if (phone_number) teacher.phone_number = phone_number;
      if (national_ID) teacher.national_ID = national_ID;
      if (email) teacher.email = email;
      if (Array.isArray(modules)) teacher.modules = modules;

      // Validate currentGroups (must be array of { groupId, moduleId })
      if (Array.isArray(currentGroups)) {
        teacher.currentGroups = currentGroups.filter(
          (cg) => cg.groupId && cg.moduleId
        );
      }

      await teacher.save();

      res.status(200).json({
        message: "Teacher updated successfully",
        teacher: {
          ...teacher._doc,
          password: undefined,
        },
      });
    } catch (err) {
      console.error("Error updating teacher:", err);
      res.status(500).json({ error: "Failed to update teacher" });
    }
  }
);

pedagogyRouter.get(
  "/student/:studentId/marks",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const schoolId = req.school.schoolId;

      const student = await Student.findOne({ _id: studentId, schoolId });
      if (!student || !student.registered || !student.registeredGroupId)
        return res
          .status(404)
          .json({ error: "Student not found or not registered" });

      const mark = await Mark.findOne({ groupId: student.registeredGroupId });
      if (!mark)
        return res.status(404).json({ error: "Marks not found for group" });

      const studentMarks = mark.students.find(
        (s) => s.studentId.toString() === studentId
      );
      if (!studentMarks)
        return res.status(404).json({ error: "No marks for student" });

      return res.json({
        schoolID: student.schoolId,
        studentID: student._id,
        student: student.full_name,
        groupe: student.registeredGroupId,
        marks: studentMarks.trimesters,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch marks" });
    }
  }
);

pedagogyRouter.get(
  "/student/:studentId/marks/:trimester",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { studentId, trimester } = req.params;
      const schoolId = req.school.schoolId;

      const student = await Student.findOne({ _id: studentId, schoolId });
      if (!student || !student.registered || !student.registeredGroupId)
        return res
          .status(404)
          .json({ error: "Student not found or not registered" });

      const mark = await Mark.findOne({ groupId: student.registeredGroupId });
      if (!mark)
        return res.status(404).json({ error: "Marks not found for group" });

      const studentMarks = mark.students.find(
        (s) => s.studentId.toString() === studentId
      );
      if (!studentMarks)
        return res.status(404).json({ error: "No marks for student" });

      const trimesterNum = parseInt(trimester);
      const trimesterData = studentMarks.trimesters.find(
        (t) => t.trimester === trimesterNum
      );
      if (!trimesterData)
        return res
          .status(404)
          .json({ error: `No marks for trimester ${trimester}` });

      return res.json({
        schoolID: student.schoolId,
        studentID: student._id,
        student: student.full_name,
        groupe: student.registeredGroupId,
        marks: {
          trimester: trimesterNum,
          modules: trimesterData.modules,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch marks" });
    }
  }
);

pedagogyRouter.delete(
  "/groupe/:id",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { id: groupId } = req.params;
    const schoolId = req.school.schoolId;

    try {
      // --- 1. Find the group ---
      const group = await Group.findOne({ id: groupId, schoolId });
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      const session = await Group.startSession();
      session.startTransaction();

      try {
        // --- 2. Update all students ---
        const currentSeason = group.season || getCurrentSchoolSeason();
        await Student.updateMany(
          { registeredGroupId: groupId, schoolId },
          {
            $set: {
              registered: false,
              registeredGroupId: null,
            },
            $push: {
              groupHistory: {
                groupId,
                season: currentSeason,
                action: "REMOVED",
                date: new Date(),
              },
            },
          },
          { session }
        );

        // --- 3. Update all teachers ---
        const teachers = await Teacher.find(
          { "currentGroups.groupId": groupId, schoolId },
          null,
          { session }
        );

        for (const teacher of teachers) {
          teacher.currentGroups = teacher.currentGroups.filter(
            (g) => g.groupId !== groupId
          );
          teacher.teachingHistory.push({
            groupId,
            season: currentSeason,
            reason: "removed",
            date: new Date(),
          });
          await teacher.save({ session });
        }

        // --- 4. Delete marks for this group ---
        await Mark.deleteMany({ groupId, schoolId }, { session });

        // --- 5. Delete the group itself ---
        await Group.deleteOne({ id: groupId, schoolId }, { session });

        await session.commitTransaction();
        session.endSession();

        res
          .status(200)
          .json({ message: "Group and related data deleted successfully" });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    } catch (err) {
      console.error("Failed to delete group:", err);
      res.status(500).json({ error: "Failed to delete group" });
    }
  }
);

pedagogyRouter.get(
  "/teachers",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;

      // Fetch all teachers (Teacher discriminator automatically filters role)
      const teachers = await Teacher.find({ schoolId })
        .select(
          "_id full_name fullUsername username email phone_number national_ID modules currentGroups teachingHistory createdAt updatedAt"
        )
        .sort({ full_name: 1 }) // sort alphabetically by name
        .lean();

      res.status(200).json({ count: teachers.length, teachers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  }
);

pedagogyRouter.get(
  "/groupStudentAssignments",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const season = getCurrentSeason();

      // 1. Get all groups for the current season
      const groupes = await Group.find({ schoolId, season })
        .sort({ createdAt: -1 })
        .lean();

      if (!groupes.length) {
        return res.status(200).json({ count: 0, data: [] });
      }

      // 2. Collect all group IDs
      const groupIds = groupes.map((g) => g.id);

      // 3. Find all Mark documents for these groups and populate student details
      const marksData = await Mark.find({
        groupId: { $in: groupIds },
        schoolId,
      })
        .populate({
          path: "students.studentId",
          select: "full_name email phone_number sex", // Select specific, non-sensitive fields
          model: "Student",
        })
        .lean();

      // 4. Create a map for quick lookup: groupId -> list of students
      const studentAssignments = new Map();
      for (const mark of marksData) {
        const students = mark.students
          .map((s) => s.studentId)
          .filter((student) => student !== null); // Filter out any students that might have been deleted

        studentAssignments.set(mark.groupId, students);
      }

      // 5. Combine groups with their student lists
      const result = groupes.map((groupe) => ({
        ...groupe,
        students: studentAssignments.get(groupe.id) || [],
        studentCount: (studentAssignments.get(groupe.id) || []).length,
      }));

      res.status(200).json({ count: result.length, groups: result });
    } catch (err) {
      console.error("Failed to fetch group student assignments:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch group student assignments" });
    }
  }
);

// **NEW**: GET /student/:studentId/history - Dedicated endpoint for academic history
pedagogyRouter.get(
  "/student/:studentId/history",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const schoolId = req.school.schoolId;

      const student = await Student.findOne({ _id: studentId, schoolId })
        .select("full_name academicHistory") // <-- Select ONLY the history
        .lean();

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    } catch (err) {
      console.error("Failed to fetch student academic history:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch student academic history" });
    }
  }
);

// **REFACTORED**: PUT /student/group/change - The core logic update
pedagogyRouter.put(
  "/student/group/change",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { studentId, newGroupId } = req.body;
    const schoolId = req.school.schoolId;

    if (!studentId || !newGroupId) {
      return res
        .status(400)
        .json({ error: "studentId and newGroupId are required" });
    }

    const session = await Student.startSession();
    session.startTransaction();

    try {
      const student = await Student.findOne({
        _id: studentId,
        schoolId,
      }).session(session);
      if (!student) throw new Error("Student not found.");

      const oldGroup = await Group.findOne({
        id: student.registeredGroupId,
        schoolId,
      }).lean();
      if (!oldGroup) throw new Error("Old group not found.");

      const newGroup = await Group.findOne({ id: newGroupId, schoolId }).lean();
      if (!newGroup) throw new Error("New group not found.");

      const oldGroupId = student.registeredGroupId;
      const oldMarkDoc = await Mark.findOne({ groupId: oldGroupId }).session(
        session
      );
      let studentMarkData = null;
      let studentMarkIndex = -1;

      if (oldMarkDoc) {
        studentMarkIndex = oldMarkDoc.students.findIndex(
          (s) => s.studentId.toString() === studentId
        );
        if (studentMarkIndex > -1) {
          studentMarkData = oldMarkDoc.students[studentMarkIndex];
        }
      }

      // === The Core Logic Branch ===
      if (
        oldGroup.speciality.id.toString() === newGroup.speciality.id.toString()
      ) {
        // --- Case 1: Same Specialty Transfer ---
        if (studentMarkData) {
          oldMarkDoc.students.splice(studentMarkIndex, 1);
          await oldMarkDoc.save({ session });
        }

        let newMarkDoc = await Mark.findOne({ groupId: newGroupId }).session(
          session
        );
        if (!newMarkDoc) {
          newMarkDoc = new Mark({ groupId: newGroupId, schoolId });
          await newMarkDoc.validate();
        }

        if (
          !newMarkDoc.students.some((s) => s.studentId.toString() === studentId)
        ) {
          newMarkDoc.students.push(studentMarkData || { studentId }); // Move old marks or create placeholder
          await newMarkDoc.save({ session });
        }
      } else {
        // --- Case 2: Different Specialty Transfer (Archive & Re-enroll) ---
        if (studentMarkData) {
          // Archive to student document
          student.academicHistory.push({
            groupId: oldGroup.id,
            groupName: oldGroup.groupName,
            season: oldGroup.season,
            status: "TRANSFERRED_SPECIALTY",
            finalMarks: studentMarkData.toObject(), // Archive a clean copy
          });

          // Remove from old mark document
          oldMarkDoc.students.splice(studentMarkIndex, 1);
          await oldMarkDoc.save({ session });
        }

        // Create fresh record in new mark document
        let newMarkDoc = await Mark.findOne({ groupId: newGroupId }).session(
          session
        );
        if (!newMarkDoc) {
          newMarkDoc = new Mark({ groupId: newGroupId, schoolId });
          await newMarkDoc.validate();
        }
        if (
          !newMarkDoc.students.some((s) => s.studentId.toString() === studentId)
        ) {
          // Creates a brand new, empty record
          newMarkDoc.students.push({ studentId });
          await newMarkDoc.save({ session });
        }
      }

      // Finally, update the student's main status
      student.registeredGroupId = newGroupId;
      student.groupHistory.push({
        groupId: newGroupId,
        season: newGroup.season,
        reason: "TRANSFERED",
      });
      await student.save({ session });

      await session.commitTransaction();
      session.endSession();

      res
        .status(200)
        .json({ message: "Student group changed successfully", student });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Failed to change student group:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to change group for student" });
    }
  }
);

pedagogyRouter.put(
  "/student/group/unassign",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { studentId } = req.body;
    const { schoolId } = req.school;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const session = await Student.startSession();
    session.startTransaction();

    try {
      const student = await Student.findOne({
        _id: studentId,
        schoolId,
      }).session(session);
      if (!student) throw new Error("Student not found.");
      if (!student.registeredGroupId)
        throw new Error("Student is not assigned to any group.");

      const oldGroup = await Group.findOne({
        id: student.registeredGroupId,
        schoolId,
      }).lean();
      if (!oldGroup)
        throw new Error("Student's current group could not be found.");

      const oldMarkDoc = await Mark.findOne({ groupId: oldGroup.id }).session(
        session
      );
      if (oldMarkDoc) {
        const studentMarkIndex = oldMarkDoc.students.findIndex(
          (s) => s.studentId.toString() === studentId
        );

        if (studentMarkIndex > -1) {
          const studentMarkData = oldMarkDoc.students[studentMarkIndex];

          // 1. Archive marks to student's academic history
          student.academicHistory.push({
            groupId: oldGroup.id,
            groupName: oldGroup.groupName,
            season: oldGroup.season,
            status: "WITHDRAWN",
            finalMarks: studentMarkData.toObject(),
          });

          // 2. Remove student entry from the Mark document
          oldMarkDoc.students.splice(studentMarkIndex, 1);
          await oldMarkDoc.save({ session });
        }
      }

      // 3. Update the student's status
      student.groupHistory.push({
        groupId: student.registeredGroupId,
        season: oldGroup.season,
        reason: "UNASSIGNED",
        date: new Date(),
      });
      student.registeredGroupId = null;
      student.registered = false;
      await student.save({ session });

      await session.commitTransaction();
      session.endSession();

      res
        .status(200)
        .json({ message: "Student unassigned successfully", student });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Failed to unassign student:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to unassign student" });
    }
  }
);

/**
 * @route   GET /api/staff/pedagogy/schedule/:groupId
 * @desc    Get the schedule for a specific group for the current season
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.get(
  "/schedule/:groupId",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { schoolId } = req.school;
      const season = getCurrentSeason();

      const schedule = await Schedule.findOne({ groupId, schoolId, season });

      if (!schedule) {
        // It's not an error if a schedule hasn't been created yet.
        // Return an empty array for the frontend to handle.
        return res.status(200).json({ groupId, season, entries: [] });
      }

      res.status(200).json(schedule);
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  }
);

/**
 * @route   PUT /api/staff/pedagogy/schedule/:groupId
 * @desc    Create or update the schedule for a group for the current season
 * @access  Private (Staff, Pedagogy Tab)
 */
// pedagogyRouter.put(
//   "/schedule/:groupId",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const { groupId } = req.params;
//       const { entries } = req.body; // Expect an array of schedule entries
//       const { schoolId } = req.school;
//       const season = getCurrentSeason();

//       if (!Array.isArray(entries)) {
//         return res
//           .status(400)
//           .json({ error: "Request body must contain an 'entries' array." });
//       }

//       // Use findOneAndUpdate with upsert to either create a new schedule or update an existing one.
//       const updatedSchedule = await Schedule.findOneAndUpdate(
//         { groupId, schoolId, season },
//         { $set: { entries } },
//         { new: true, upsert: true, runValidators: true }
//       );

//       res.status(200).json({
//         message: "Schedule saved successfully",
//         schedule: updatedSchedule,
//       });
//     } catch (err) {
//       console.error("Failed to save schedule:", err);
//       res.status(500).json({ error: "Failed to save schedule" });
//     }
//   }
// );

pedagogyRouter.put(
  "/schedule/:groupId",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { entries } = req.body;
      const { schoolId } = req.school;
      const season = getCurrentSeason();

      if (!Array.isArray(entries)) {
        return res
          .status(400)
          .json({ error: "Request body must contain an 'entries' array." });
      }

      // Fetch current schedule (before update)
      const existingSchedule = await Schedule.findOne({
        groupId,
        schoolId,
        season,
      });

      // Save or update schedule
      const updatedSchedule = await Schedule.findOneAndUpdate(
        { groupId, schoolId, season },
        { $set: { entries } },
        { new: true, upsert: true, runValidators: true }
      );

      // === Sync teachers with schedule ===
      const prevAssignments = new Set(
        existingSchedule
          ? existingSchedule.entries.map((e) => `${e.teacherId}-${e.moduleId}`)
          : []
      );
      const newAssignments = new Set(
        entries.map((e) => `${e.teacherId}-${e.moduleId}`)
      );

      const toAssign = [...newAssignments].filter(
        (x) => !prevAssignments.has(x)
      );
      const toUnassign = [...prevAssignments].filter(
        (x) => !newAssignments.has(x)
      );

      // Perform assign
      for (const key of toAssign) {
        const [teacherId, moduleId] = key.split("-");
        await assignTeacherToGroup({ groupId, teacherId, moduleId });
      }

      // Perform unassign
      for (const key of toUnassign) {
        const [teacherId, moduleId] = key.split("-");
        await unassignTeacherFromGroup({ groupId, teacherId, moduleId });
      }

      res.status(200).json({
        message: "Schedule saved and teachers synced successfully",
        schedule: updatedSchedule,
      });
    } catch (err) {
      console.error("Failed to save schedule:", err);
      res.status(500).json({ error: "Failed to save schedule" });
    }
  }
);

/**
 * @route   DELETE /api/staff/pedagogy/schedule/:groupId
 * @desc    Clear the schedule for a group for the current season
 * @access  Private (Staff, Pedagogy Tab)
 */
// pedagogyRouter.delete(
//   "/schedule/:groupId",
//   authStaff,
//   authTabAccess("pedagogy"),
//   async (req, res) => {
//     try {
//       const { groupId } = req.params;
//       const { schoolId } = req.school;
//       const season = getCurrentSeason();

//       const result = await Schedule.findOneAndDelete({
//         groupId,
//         schoolId,
//         season,
//       });

//       if (!result) {
//         return res
//           .status(404)
//           .json({ error: "No schedule found for this group to delete." });
//       }

//       res.status(200).json({ message: "Schedule cleared successfully." });
//     } catch (err) {
//       console.error("Failed to clear schedule:", err);
//       res.status(500).json({ error: "Failed to clear schedule" });
//     }
//   }
// );

pedagogyRouter.delete(
  "/schedule/:groupId",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { schoolId } = req.school;
      const season = getCurrentSeason();

      const schedule = await Schedule.findOneAndDelete({
        groupId,
        schoolId,
        season,
      });
      if (!schedule) {
        return res
          .status(404)
          .json({ error: "No schedule found for this group to delete." });
      }

      // === Unassign all teachers from this schedule ===
      for (const { teacherId, moduleId } of schedule.entries) {
        await unassignTeacherFromGroup({ groupId, teacherId, moduleId });
      }

      res
        .status(200)
        .json({ message: "Schedule cleared and teachers unassigned." });
    } catch (err) {
      console.error("Failed to clear schedule:", err);
      res.status(500).json({ error: "Failed to clear schedule" });
    }
  }
);

pedagogyRouter.get(
  "/overview-stats",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { schoolId } = req.school;
      const currentSeason = getCurrentSchoolSeason();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // --- Perform all database queries in parallel for maximum efficiency ---
      const [
        totalStudents,
        totalTeachers,
        activeGroupsCount,
        newStudentsLast30Days,
        registeredStudentsCount,
        teachersWithAssignments,
        levelDistribution,
        topTeachers,
      ] = await Promise.all([
        Student.countDocuments({ schoolId }),
        Teacher.countDocuments({ schoolId }),
        Group.countDocuments({ schoolId, season: currentSeason }),
        Student.countDocuments({
          schoolId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
        Student.countDocuments({ schoolId, registered: true }),
        Teacher.countDocuments({
          schoolId,
          "currentGroups.0": { $exists: true },
        }),
        // Advanced query to get student counts per level
        Student.aggregate([
          {
            $match: {
              schoolId,
              registered: true,
              registeredGroupId: { $ne: null },
            },
          },
          {
            $lookup: {
              from: "groups",
              localField: "registeredGroupId",
              foreignField: "id",
              as: "groupInfo",
            },
          },
          { $unwind: "$groupInfo" },
          { $group: { _id: "$groupInfo.level", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        // Advanced query to get top teachers by assignment count
        Teacher.aggregate([
          { $match: { schoolId, "currentGroups.0": { $exists: true } } },
          {
            $project: {
              full_name: 1,
              assignmentCount: { $size: "$currentGroups" },
            },
          },
          { $sort: { assignmentCount: -1 } },
          { $limit: 5 },
        ]),
      ]);

      const unassignedStudentsCount = totalStudents - registeredStudentsCount;

      // Format the results into a single, clean object for the frontend
      const finalStats = {
        totalStudents,
        totalTeachers,
        activeGroupsCount,
        newStudents: newStudentsLast30Days,
        assignedTeachers: teachersWithAssignments,
        registeredStudentsCount,
        unassignedStudentsCount,
        levelDistribution: levelDistribution.map((item) => ({
          level: `Level ${item._id}`,
          count: item.count,
        })),
        topTeachers: topTeachers.map((item) => ({
          name: item.full_name,
          count: item.assignmentCount,
        })),
      };

      res.status(200).json(finalStats);
    } catch (err) {
      console.error("Failed to fetch overview statistics:", err);
      res.status(500).json({ error: "Failed to fetch overview statistics" });
    }
  }
);

// ===================================================================
// Parent Management Routes
// ===================================================================

/**
 * @route   POST /api/staff/pedagogy/parent
 * @desc    Create a new parent account
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.post(
  "/parent",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        full_name,
        phone_number,
        email,
        national_ID,
        relationship,
        profession,
        address,
      } = req.body;

      const schoolId = req.school.schoolId;
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const fullUsername = `pa${username}@${school.derivationKey}`;

      // Basic validation
      if (
        !username ||
        !password ||
        !full_name ||
        !phone_number ||
        !email ||
        !national_ID ||
        !relationship
      ) {
        return res
          .status(400)
          .json({ error: "All required fields must be filled" });
      }

      // Check for existing user
      const existing = await Member.findOne({
        $or: [{ email }, { fullUsername }, { phone_number }, { national_ID }],
        schoolId,
      });
      if (existing) {
        return res.status(409).json({
          error: "User already exists with this email, phone, or national ID",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const parent = new Parent({
        username,
        password: hashedPassword,
        full_name,
        phone_number,
        email,
        fullUsername,
        role: "PARENT",
        schoolId,
        national_ID,
        relationship,
        profession,
        address,
        children: [],
      });

      await parent.save();

      res.status(201).json({
        message: "Parent account created successfully",
        parent: {
          ...parent.toObject(),
          password: undefined,
        },
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to create parent account" });
    }
  }
);
import mongoose from "mongoose";

/**
 * @route   POST /api/staff/pedagogy/parent/link-student
 * @desc    Link a parent to a student's account
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.post(
  "/parent/link-student",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { parentId, studentId, relationship } = req.body; // relationship: 'mother' or 'father'
    const schoolId = req.school.schoolId;

    if (!parentId || !studentId || !relationship) {
      return res.status(400).json({
        error: "Parent ID, Student ID, and relationship are required",
      });
    }

    // Only allow 'father' or 'mother'
    if (!["father", "mother"].includes(relationship)) {
      return res.status(400).json({
        error: "Relationship must be either 'father' or 'mother'.",
      });
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const student = await Student.findOne({
        _id: studentId,
        schoolId,
      }).session(session);
      if (!student) {
        throw new Error("Student not found.");
      }

      const parent = await Parent.findOne({ _id: parentId, schoolId }).session(
        session
      );
      if (!parent) {
        throw new Error("Parent not found.");
      }

      // Check if this relationship role is already filled
      if (relationship === "father" && student.parentAccountIds.father) {
        throw new Error("This student already has a father linked.");
      }
      if (relationship === "mother" && student.parentAccountIds.mother) {
        throw new Error("This student already has a mother linked.");
      }

      // Update student document explicitly
      if (relationship === "father") {
        student.parentAccountIds.father = parent._id;
      } else if (relationship === "mother") {
        student.parentAccountIds.mother = parent._id;
      }

      // Add student to parent's children array if not already present
      if (!parent.children.includes(student._id)) {
        parent.children.push(student._id);
      }

      await student.save({ session });
      await parent.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        message: `Successfully linked ${parent.full_name} as the ${relationship} to ${student.full_name}.`,
        student,
      });
    } catch (err) {
      await session.abortTransaction();
      console.error("Linking error:", err);
      res.status(500).json({ error: err.message || "Failed to link accounts" });
    } finally {
      session.endSession();
    }
  }
);

/**
 * @route   GET /api/staff/pedagogy/parents
 * @desc    Get all parent accounts
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.get(
  "/parents",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const parents = await Parent.find({ schoolId })
        .select("-password -__v -updatedAt")
        .populate("children", "full_name");
      res.status(200).json({ count: parents.length, parents });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch parents" });
    }
  }
);

// pedagogyRouter.get(
//   "/students",
// PARENT MANAGEMENT ROUTES
// ===================================================================

/**
 * @route   POST /api/staff/pedagogy/parent
 * @desc    Create a new parent account
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.post(
  "/parent",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        full_name,
        phone_number,
        email,
        national_ID,
        relationship, // "MOTHER" or "FATHER"
        profession,
        address,
      } = req.body;

      const { schoolId, derivationKey } = req.school;

      const fullUsername = `pa${username}@${derivationKey}`;

      // Basic validation
      if (
        !username ||
        !password ||
        !full_name ||
        !phone_number ||
        !email ||
        !national_ID ||
        !relationship
      ) {
        return res
          .status(400)
          .json({ error: "All required parent fields must be filled" });
      }

      // Check for existing user
      const existing = await Member.findOne({
        $or: [{ email }, { fullUsername }, { phone_number }, { national_ID }],
        schoolId,
      });

      if (existing) {
        return res.status(409).json({
          error:
            "A user already exists with this email, phone, or national ID.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newParent = new Parent({
        username,
        password: hashedPassword,
        full_name,
        phone_number,
        email,
        fullUsername,
        role: "PARENT",
        schoolId,
        national_ID,
        relationship,
        profession,
        address,
      });

      await newParent.save();

      const { password: _, ...parentData } = newParent.toObject();

      res.status(201).json({
        message: "Parent account created successfully",
        parent: parentData,
      });
    } catch (err) {
      console.error("Failed to create parent:", err);
      res.status(500).json({ error: "Failed to create parent account" });
    }
  }
);

/**
 * @route   POST /api/staff/pedagogy/student/link-parent
 * @desc    Link a student to a parent account
 * @access  Private (Staff, Pedagogy Tab)
 */
pedagogyRouter.post(
  "/student/link-parent",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    const { studentId, parentId } = req.body;
    const { schoolId } = req.school;

    if (!studentId || !parentId) {
      return res
        .status(400)
        .json({ error: "studentId and parentId are required." });
    }

    try {
      const [student, parent] = await Promise.all([
        Student.findOne({ _id: studentId, schoolId }),
        Parent.findOne({ _id: parentId, schoolId }),
      ]);

      if (!student) {
        return res.status(404).json({ error: "Student not found." });
      }
      if (!parent) {
        return res.status(404).json({ error: "Parent not found." });
      }

      const relationshipField = parent.relationship.toLowerCase(); // 'mother' or 'father'

      if (student.parentAccountIds[relationshipField]) {
        return res.status(409).json({
          error: `Student already has a ${relationshipField} linked.`,
        });
      }

      // Link parent to student
      student.parentAccountIds[relationshipField] = parent._id;

      // Link student to parent (ensuring no duplicates)
      await Parent.updateOne(
        { _id: parent._id },
        { $addToSet: { children: student._id } }
      );

      await student.save();

      res.status(200).json({
        message: "Parent linked to student successfully.",
        student,
      });
    } catch (err) {
      console.error("Failed to link parent:", err);
      res.status(500).json({ error: "Failed to link parent to student." });
    }
  }
);

export default pedagogyRouter;
