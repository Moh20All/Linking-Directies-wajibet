import mongoose from "mongoose";
import Member from "./member.model.js";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    parentAccountIds: {
      mother: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        default: null,
      },
      father: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        default: null,
      },
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    birthCity: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["MALE", "FEMALE"],
    },
    registeredGroupId: {
      type: String,
      ref: "Group",
      default: null,
    },
    registered: {
      type: Boolean,
      default: false,
    },
    groupHistory: [
      {
        groupId: { type: String, ref: "Group" },
        season: { type: String },
        reason: { type: String, default: "REGISTRED" },
        date: { type: Date, default: Date.now },
      },
    ],
    academicHistory: [
      {
        groupId: { type: String, required: true },
        groupName: { type: String, required: true },
        season: { type: String, required: true },
        status: {
          type: String,
          enum: ["COMPLETED", "TRANSFERRED_SPECIALTY", "WITHDRAWN"],
          required: true,
        },
        // This stores the ENTIRE marks object for that enrollment
        finalMarks: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true, discriminatorKey: "memberType" }
);

studentSchema.pre("validate", function (next) {
  // const { mother, father } = this.parent_phone_numbers || {};
  // if (!mother && !father) {
  //   this.invalidate(
  //     "parent_phone_numbers",
  //     "At least one parent phone number is required"
  //   );
  // }

  // Enforce consistency between registeredGroupId and registered
  if (!this.registeredGroupId) {
    this.registered = false;
    this.registeredGroupId = null;
  } else {
    this.registered = true;
  }
  // this.parentAccountIds = {
  //   mother: null,
  //   father: null,
  // };
  this.role = "STUDENT"; // Ensure role is set to STUDENT
  next();
});

const Student = Member.discriminator("Student", studentSchema);

export { Member, Student };
