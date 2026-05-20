// models/studentsAttendance.model.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const StudentsAttendance = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    // season: {
    //   type: String, // e.g. "2024/2025"
    //   required: true,
    // },
    groupId: {
      type: String, // example: "grp2526-3-SE-D"
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    moduleEntries: [
      {
        moduleId: { type: String, required: true }, // e.g. "math101"
        absentees: [
          {
            studentId: {
              type: Schema.Types.ObjectId,
              ref: "Student",
              required: true,
            },
            status: {
              type: String,
              enum: ["absent", "late"],
              required: true,
            },
            showingUpTime: { type: String }, // if late, store "08:35"
            remark: { type: String },
            sessionId: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default model("StudentsAttendance", StudentsAttendance);
