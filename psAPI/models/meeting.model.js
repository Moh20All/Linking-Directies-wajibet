import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    requesterType: {
      type: String,
      enum: ["Teacher", "Parent", "Staff"],
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "requesterType",
    },
    invitedType: {
      type: String,
      enum: ["Teacher", "Parent"],
      required: true,
    },
    invitedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "invitedType",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      //   required: true,
    },
    cause: {
      type: String,
      enum: [
        "Academic Performance",
        "Behavioral Issues",
        "Attendance Issues",
        "Health & Wellbeing",
        "Administrative Request",
        "Extracurricular Activities",
        "General Follow-up",
        "Conflict Resolution",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Requested",
        "Rejected by Admin",
        "Approved by Admin",
        "Invitation Sent",
        "Acknowledged",
        "Accepted",
        "Declined",
        "Rescheduled",
        "Rescheduled Accepted",
        "Rescheduled Declined",
        "Reschedule Requested",
        "Confirmed",
        "In Progress",
        "Completed",
        "Canceled",
        "No Show",
        "Closed",
      ],
      default: "Requested",
    },
    requestedDate: { type: Date, required: true },
    scheduledDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
