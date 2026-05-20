import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * @description Represents the attendance status of a single member for a given day.
 * This is a sub-document within the main Attendance schema.
 */
const memberAttendanceSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "FinancialProfile",
      required: true,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Present",
        "Absent",
        "Late",
        "Justified Absence",
        "Holiday",
        "Rest Day",
      ],
      required: true,
    },
    attendanceTime: {
      type: String, // Stored in "HH:MM" 24-hour format.
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
); // No need for a separate _id on the sub-document

/**
 * @description Represents the main attendance sheet for a single day.
 * Each document corresponds to one day's attendance for the entire school.
 */
const attendanceSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    records: [memberAttendanceSchema],
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields for the overall document.

attendanceSchema.index({ schoolId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
