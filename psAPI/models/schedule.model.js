import { Schema, model } from "mongoose";

/**
 * Represents a single class session within a group's weekly schedule.
 * These are embedded within the main Schedule document.
 */
const scheduleEntrySchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    moduleId: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    roomName: { type: String, required: true },
  },
  { _id: true } // Mongoose will auto-generate a unique _id for each entry
);

/**
 * Represents the complete weekly schedule for a single group for a specific academic season.
 */
const scheduleSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    groupId: { type: String, required: true },
    season: { type: String, required: true },
    entries: [scheduleEntrySchema], // An array of all class sessions for the week
  },
  { timestamps: true }
);

// Create a compound unique index to ensure a group can only have one schedule document per season.
scheduleSchema.index({ groupId: 1, season: 1 }, { unique: true });

const Schedule = model("Schedule", scheduleSchema);
export default Schedule;
