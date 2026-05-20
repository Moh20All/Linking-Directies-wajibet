import { Router } from "express";
import Meeting from "../models/meeting.model.js";
import authStaff from "../middlewares/authStaff.middleware.js";
import authTeacher from "../middlewares/authTeacher.middleware.js";
import authParent from "../middlewares/authParent.middleware.js";
import { authTabAccess } from "../middlewares/authTabAcees.middleware.js";
import Mark from "../models/mark.model.js";
import { Student } from "../models/student.model.js";
import { Parent } from "../models/parent.model.js";

import Group from "../models/groupe.model.js";
import { Teacher } from "../models/teacher.model.js";

const meetingRouter = Router();

/**
 * TEACHER requests a meeting with a parent
 */
meetingRouter.post("/teacher/request", authTeacher, async (req, res) => {
  try {
    const schoolId = req.teacher.schoolId;
    const teacherId = req.teacher._id;
    const { invitedId, adminId, cause, requestedDate, notes } = req.body;

    if (!invitedId || !cause || !requestedDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const meeting = await Meeting.create({
      schoolId,
      requesterType: "Teacher",
      requesterId: teacherId,
      invitedType: "Parent",
      invitedId: invitedId,
      adminId,
      cause,
      requestedDate,
      notes,
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

/**
 * PARENT requests a meeting with a teacher
 */
meetingRouter.post("/parent/request", authParent, async (req, res) => {
  try {
    const schoolId = req.parent.schoolId;
    const parentId = req.parent._id;
    const { invitedId, adminId, cause, requestedDate, notes } = req.body;

    if (!invitedId || !cause || !requestedDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const meeting = await Meeting.create({
      schoolId,
      requesterType: "Parent",
      requesterId: parentId,
      invitedType: "Teacher",
      invitedId: invitedId,
      adminId,
      cause,
      requestedDate,
      notes,
    });

    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN creates a meeting (with parent + teacher)
 */
meetingRouter.post(
  "/admin/create",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const adminId = req.staff._id;
      const { teacherId, parentId, cause, scheduledDate, notes } = req.body;

      if (!teacherId || !parentId || !cause || !scheduledDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const meeting = await Meeting.create({
        schoolId,
        requesterType: "Staff",
        requesterId: adminId,
        invitedType: "Parent", // Parent is formally invited
        invitedId: parentId,
        adminId,
        cause,
        requestedDate: scheduledDate,
        scheduledDate,
        notes,
        status: "Approved by Admin",
      });

      res.status(201).json(meeting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * ADMIN approves or rejects meeting requests
 */
meetingRouter.patch(
  "/:id/admin-action",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const { action, scheduledDate } = req.body;
      const schoolId = req.school.schoolId;

      const meeting = await Meeting.findOne({ _id: req.params.id, schoolId });
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });

      if (action === "approve") {
        meeting.status = "Approved by Admin";
        if (scheduledDate) meeting.scheduledDate = scheduledDate;
      } else if (action === "reject") {
        meeting.status = "Rejected by Admin";
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      await meeting.save();
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * TEACHER or PARENT responds to an approved meeting
 */
meetingRouter.patch("/:id/respond", async (req, res) => {
  try {
    const { response } = req.body;
    const schoolId = req.school.schoolId;

    const meeting = await Meeting.findOne({ _id: req.params.id, schoolId });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    if (response === "accept") meeting.status = "Accepted";
    else if (response === "decline") meeting.status = "Declined";
    else if (response === "reschedule") meeting.status = "Rescheduled";
    else return res.status(400).json({ error: "Invalid response" });

    await meeting.save();
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN fetches all meetings for the school
 */
meetingRouter.get(
  "/",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const meetings = await Meeting.find({ schoolId }).populate(
        "requesterId invitedId adminId"
      );
      res.json(meetings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * TEACHER fetches their meetings
 */
meetingRouter.get("/teacher/my-meetings", authTeacher, async (req, res) => {
  try {
    const schoolId = req.teacher.schoolId;
    const teacherId = req.teacher._id;
    const currentGroups = req.teacher.currentGroups;

    // --- 1) Get meetings for this teacher ---
    // 4. Fetch parent’s meetings
    const excludedStatuses = [
      "Closed",
      "Canceled",
      "Requested",
      "Rejected by Admin",
      "Declined",
      "Reschedule Requested",
      "No Show",
    ];
    const meetings = await Meeting.find({
      schoolId,
      $or: [
        { requesterId: teacherId },
        { invitedId: teacherId, status: { $nin: excludedStatuses } },
      ],
    })
      .populate("requesterId", "full_name email phone_number role")
      .populate("invitedId", "full_name email phone_number role")
      .populate("adminId", "full_name email role");

    // --- 2) Get students from teacher's groups (by Marks collection) ---
    const groupIds = currentGroups.map((g) => g.groupId);

    const marks = await Mark.find({
      schoolId,
      groupId: { $in: groupIds },
    }).select("students groupId");

    const studentIds = marks.flatMap((m) => m.students || []);
    const studentIDS = studentIds.map((s) => s.studentId);

    if (studentIDS.length === 0) {
      return res.json({ meetings, availableParents: [] });
    }

    // --- 3) Get students with registered parents ---
    const students = await Student.find({
      _id: { $in: studentIDS },
      schoolId,
      $or: [
        { "parentAccountIds.mother": { $ne: null } },
        { "parentAccountIds.father": { $ne: null } },
      ],
    })
      .populate("parentAccountIds.mother parentAccountIds.father")
      .select("full_name parentAccountIds registeredGroupId");

    // --- 4) Build parent -> children map (safe fields only) ---
    const parentsMap = new Map();

    students.forEach((student) => {
      const { parentAccountIds } = student;

      ["mother", "father"].forEach((role) => {
        const parent = parentAccountIds[role];
        if (parent) {
          const key = parent._id.toString();
          if (!parentsMap.has(key)) {
            parentsMap.set(key, {
              _id: parent._id,
              full_name: parent.full_name,
              email: parent.email,
              phone_number: parent.phone_number,
              relationship: parent.relationship,
              children: [],
            });
          }
          parentsMap.get(key).children.push({
            _id: student._id,
            full_name: student.full_name,
            registeredGroupId: student.registeredGroupId,
          });
        }
      });
    });

    const availableParents = Array.from(parentsMap.values());

    res.json({
      meetings,
      availableParents,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher respond to a meeting
meetingRouter.patch("/teacher/respond/:id", authTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const teacherId = req.teacher._id;

    if (!["accept", "decline", "reschedule"].includes(response)) {
      return res.status(400).json({ error: "Invalid response option" });
    }

    // Find meeting
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Ensure teacher is invited
    if (meeting.invitedId.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to respond to this meeting" });
    }

    // Teachers can only respond if meeting has been approved by admin
    if (
      meeting.status !== "Approved by Admin" &&
      meeting.status !== "Rescheduled"
    ) {
      return res.status(400).json({
        error: `Cannot respond. Current status is "${meeting.status}".`,
      });
    }

    // Map responses → statuses
    const statusMap = {
      accept: "Accepted",
      decline: "Declined",
      reschedule: "Reschedule Requested",
    };

    meeting.status = statusMap[response];
    await meeting.save();

    // Return populated updated meeting
    const populatedMeeting = await Meeting.findById(id).populate(
      "requesterId invitedId adminId"
    );

    res.json(populatedMeeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PARENT fetches their meetings
 */
meetingRouter.get("/parent/my-meetings", authParent, async (req, res) => {
  try {
    const schoolId = req.parent.schoolId;
    const parentId = req.parent._id;

    // 1. Parent’s children
    const childrenIds = req.parent.children;

    // 2. Get children’s groups
    const children = await Student.find({ _id: { $in: childrenIds } }).select(
      "registeredGroupId"
    );
    const groupIds = children.map((c) => c.registeredGroupId);

    // 3. Get teachers teaching in those groups
    const groups = await Group.find({ id: { $in: groupIds } }).select(
      "teachers groupName id"
    );

    const teacherIds = [
      ...new Set(
        groups.flatMap((g) => g.teachers.map((t) => t.teacherId.toString()))
      ),
    ];

    const teachers = await Teacher.find({ _id: { $in: teacherIds } }).select(
      "_id full_name email phone_number"
    );

    // 4. Fetch parent’s meetings
    const excludedStatuses = [
      "Closed",
      "Canceled",
      "Requested",
      "Rejected by Admin",
      "Declined",
      "Reschedule Requested",
      "No Show",
    ];

    const meetings = await Meeting.find({
      schoolId,
      $or: [
        { requesterId: parentId },
        {
          invitedId: parentId,
          status: { $nin: excludedStatuses },
        },
      ],
    }).populate("requesterId invitedId adminId");

    // 5. Send response
    res.json({
      meetings,
      availableTeachers: teachers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

meetingRouter.patch("/parent/respond/:id", authParent, async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const parentId = req.parent._id;

    if (!["accept", "decline", "reschedule"].includes(response)) {
      return res.status(400).json({ error: "Invalid response option" });
    }

    // Find meeting
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Check if parent is invited
    if (meeting.invitedId.toString() !== parentId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to respond to this meeting" });
    }

    // Map responses → statuses
    const statusMap = {
      accept: "Accepted",
      decline: "Declined",
      reschedule: "Reschedule Requested",
    };

    meeting.status = statusMap[response];
    await meeting.save();

    // Return updated meeting (with populated info)
    const populatedMeeting = await Meeting.findById(id).populate(
      "requesterId invitedId adminId"
    );

    res.json(populatedMeeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// Teacher → Reschedule Meeting
// ==========================
meetingRouter.patch(
  "/teacher/reschedule/:id",
  authTeacher,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newDate, decline } = req.body;
      const teacherId = req.teacher._id;

      const meeting = await Meeting.findById(id);
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });

      // Only requester can reschedule
      if (meeting.requesterId.toString() !== teacherId.toString()) {
        return res
          .status(403)
          .json({ error: "Not authorized to reschedule this meeting" });
      }

      if (meeting.status !== "Reschedule Requested") {
        return res
          .status(400)
          .json({ error: "Meeting is not awaiting reschedule" });
      }

      if (decline) {
        meeting.status = "Rescheduled Declined";
      } else {
        if (!newDate) {
          return res
            .status(400)
            .json({ error: "New date is required to reschedule" });
        }
        meeting.requestedDate = newDate;
        meeting.status = "Rescheduled";
      }

      await meeting.save();

      const populated = await Meeting.findById(id).populate(
        "requesterId invitedId adminId"
      );
      res.json(populated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==========================
// Parent → Reschedule Meeting
// ==========================
meetingRouter.patch("/parent/reschedule/:id", authParent, async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, decline } = req.body;
    const parentId = req.parent._id;

    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Only requester can reschedule
    if (meeting.requesterId._id.toString() !== parentId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to reschedule this meeting" });
    }

    if (meeting.status !== "Reschedule Requested") {
      return res
        .status(400)
        .json({ error: "Meeting is not awaiting reschedule" });
    }

    if (decline) {
      meeting.status = "Rescheduled Declined";
    } else {
      if (!newDate) {
        return res
          .status(400)
          .json({ error: "New date is required to reschedule" });
      }
      meeting.requestedDate = newDate;
      meeting.status = "Rescheduled";
    }

    await meeting.save();

    const populated = await Meeting.findById(id).populate(
      "requesterId invitedId adminId"
    );
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// ADMIN ROUTES
// ==========================

// Get all meetings for the school
meetingRouter.get(
  "/admin/all",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const meetings = await Meeting.find({ schoolId }).populate(
        "requesterId invitedId adminId"
      );
      res.json(meetings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Confirm a meeting
meetingRouter.patch(
  "/admin/confirm/:id",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const meeting = await Meeting.findOne({ _id: req.params.id, schoolId });
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });

      meeting.status = "Approved by Admin";
      if (req.body.scheduledDate)
        meeting.scheduledDate = req.body.scheduledDate;

      await meeting.save();
      const populated = await Meeting.findById(meeting._id).populate(
        "requesterId invitedId adminId"
      );
      res.json(populated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Decline a meeting
meetingRouter.patch(
  "/admin/decline/:id",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const meeting = await Meeting.findOne({ _id: req.params.id, schoolId });
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });

      meeting.status = "Rejected by Admin";
      await meeting.save();

      const populated = await Meeting.findById(meeting._id).populate(
        "requesterId invitedId adminId"
      );
      res.json(populated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete a meeting
meetingRouter.delete(
  "/admin/:id",
  authStaff,
  authTabAccess("pedagogy"),
  async (req, res) => {
    try {
      const schoolId = req.school.schoolId;
      const meeting = await Meeting.findOneAndDelete({
        _id: req.params.id,
        schoolId,
      });

      if (!meeting) return res.status(404).json({ error: "Meeting not found" });

      res.json({ success: true, message: "Meeting deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default meetingRouter;
