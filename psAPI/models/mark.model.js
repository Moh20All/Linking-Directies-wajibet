import mongoose from "mongoose";
import Group from "./groupe.model.js";
import SchoolStructure from "./specialities.model.js";

const { Schema, model } = mongoose;

// Schema for each individual mark type (e.g., devoir1, exam, etc.)
const individualMarkSchema = new Schema(
  {
    value: { type: Number, default: 0 },
    coefficient: { type: Number, required: true },
  },
  { _id: false }
);

// Schema for each module's full mark entry
const markEntrySchema = new Schema(
  {
    value: { type: Number, default: 0 },
    coefficient: { type: Number, required: true },
    isOptional: { type: Boolean, default: false },

    // ✅ Add these fields explicitly
    dev1: { type: Number, default: 0 },
    dev2: { type: Number, default: 0 },
    exam: { type: Number, default: 0 },
    constant_observation: { type: Number, default: 0 },
  },
  { _id: false }
);

// Schema for each trimester for a student
const trimesterSchema = new Schema(
  {
    trimester: { type: Number, required: true },
    modules: {
      type: Map,
      of: markEntrySchema,
      default: {},
    },
  },
  { _id: false }
);

// Schema for an individual student's marks
const studentMarkSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    trimesters: {
      type: [trimesterSchema],
      default: [],
    },
  },
  { _id: false }
);

// The full marks record for a group
const marksSchema = new Schema(
  {
    schoolId: { type: String, required: true, ref: "School" },
    groupId: {
      type: String,
      required: true,
      unique: true,
      ref: "Group",
    },
    season: {
      type: String,
      required: true,
    },
    students: {
      type: [studentMarkSchema],
      default: [],
    },
    modulesMeta: {
      type: [
        {
          id: { type: String, required: true },
          name: {
            name_fr: String,
            name_en: String,
            name_ar: String,
          },
          coefficient: { type: Number, required: true },
          isOptional: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Auto-generate modulesMeta when document is first created
marksSchema.pre("validate", async function (next) {
  if (!this.schoolId) {
    return next(new Error("schoolId must be provided"));
  }
  if (!this.isNew || this.modulesMeta.length > 0) return next();

  try {
    const group = await Group.findOne({
      id: this.groupId,
      schoolId: this.schoolId,
    });
    if (!group) return next(new Error("Group not found"));

    const structure = await SchoolStructure.findOne({
      $or: [
        { "primaire.specialities._id": group.speciality.id },
        { "cem.specialities._id": group.speciality.id },
        { "lycee.specialities._id": group.speciality.id },
      ],
    });

    if (!structure) return next(new Error("Speciality structure not found"));

    let matchedSpeciality;
    const schoolTypes = ["primaire", "cem", "lycee"];
    for (const type of schoolTypes) {
      const specs = structure[type]?.specialities || [];
      const match = specs.find(
        (s) => s._id.toString() === group.speciality.id.toString()
      );
      if (match) {
        matchedSpeciality = match;
        break;
      }
    }

    if (!matchedSpeciality) return next(new Error("Speciality not matched"));

    const levelData = matchedSpeciality.levels.find(
      (lvl) => lvl.level === group.level
    );
    if (!levelData) return next(new Error("Level not found"));

    // Save modules meta data
    this.modulesMeta = levelData.modules.map((m) => ({
      id: m.id,
      name: m.name,
      coefficient: m.coeficient,
      isOptional: !m.obligatory,
    }));

    this.season = group.season;
    next();
  } catch (err) {
    next(err);
  }
});

const Mark = model("Mark", marksSchema);
export default Mark;
