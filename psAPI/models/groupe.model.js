import mongoose from "mongoose";
import SchoolStructure from "./specialities.model.js";
import Mark from "./mark.model.js";

const { Schema, model } = mongoose;

function generateAbbreviation(name) {
  return name
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 2) return ""; // skip very short words
      const validChar = [...word].find((ch) => /[A-Za-zÀ-ÿ]/.test(ch));
      return validChar ? validChar.toUpperCase() : "";
    })
    .join("");
}

function getCurrentSeason() {
  const today = new Date();
  let startYear = today.getFullYear();
  const month = today.getMonth() + 1;

  if (month >= 7) {
    startYear += 1;
  }
  const prevYearShort = String(startYear - 1).slice(-2);
  const thisYearShort = String(startYear).slice(-2);
  return `${prevYearShort}${thisYearShort}`;
}

function getNextGroupLetter(count) {
  const MAX_LETTER_INDEX = 8;
  if (count > MAX_LETTER_INDEX) {
    const err = new Error(
      `Too many groups: maximum is ${MAX_LETTER_INDEX + 1} (A-G)`
    );
    err.name = "ValidationError";
    throw err;
  }
  return String.fromCharCode(65 + count);
}

const groupSchema = new Schema(
  {
    id: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 12 },
    speciality: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true, trim: true },
      abbreviation: { type: String, trim: true },
    },
    classNumber: { type: Number, required: true, min: 1 },
    season: { type: String },
    groupName: { type: String, trim: true },
    schoolId: { type: String, required: true, ref: "School" },
    teachers: {
      type: [
        {
          teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Member",
          },
          moduleId: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
  { id: false }
);

// ✅ Pre-validation: Setup group name, ID, etc.
groupSchema.pre("validate", async function (next) {
  try {
    if (
      this.speciality?.id &&
      !(this.speciality.id instanceof mongoose.Types.ObjectId)
    ) {
      this.speciality.id = new mongoose.Types.ObjectId(this.speciality.id);
    }

    if (this.speciality?.id && !this.speciality.name) {
      const structure = await SchoolStructure.findOne({
        $or: [
          { "primaire.specialities._id": this.speciality.id },
          { "cem.specialities._id": this.speciality.id },
          { "lycee.specialities._id": this.speciality.id },
        ],
      });

      if (!structure) return next(new Error("Speciality not found"));

      const allSpecialities = [
        ...(structure.primaire?.specialities || []),
        ...(structure.cem?.specialities || []),
        ...(structure.lycee?.specialities || []),
      ];

      const match = allSpecialities.find(
        (s) => s._id.toString() === this.speciality.id.toString()
      );

      if (!match) return next(new Error("Speciality not matched"));

      this.speciality.name = match.name.name_fr;
    }

    if (!this.speciality.abbreviation) {
      this.speciality.abbreviation = generateAbbreviation(this.speciality.name);
    }

    if (!this.season) {
      this.season = getCurrentSeason();
    }

    const Group = this.constructor;
    const count = await Group.countDocuments({
      level: this.level,
      season: this.season,
      "speciality.abbreviation": this.speciality.abbreviation,
      schoolId: this.schoolId,
    });

    const nextLetter = getNextGroupLetter(count);

    if (!this.groupName) {
      this.groupName = `${this.level}-${this.speciality.abbreviation}-${nextLetter}`;
    }

    if (!this.id) {
      this.id = `grp${this.season}-${this.groupName}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Post-save hook: Create Mark after group is saved
groupSchema.post("save", async function (doc, next) {
  try {
    const existing = await Mark.findOne({ groupId: doc.id });
    const existing2 = await Group.findOne({
      schoolId: doc.schoolId,
      name: doc.name,
      season: doc.season,
    });
    if (existing || existing2) return next();

    const structure = await SchoolStructure.findOne({
      $or: [
        { "primaire.specialities._id": doc.speciality.id },
        { "cem.specialities._id": doc.speciality.id },
        { "lycee.specialities._id": doc.speciality.id },
      ],
    });

    const schoolTypes = ["primaire", "cem", "lycee"];
    let modules = [];

    for (const type of schoolTypes) {
      const specialities = structure[type]?.specialities || [];
      const match = specialities.find(
        (s) => s._id.toString() === doc.speciality.id.toString()
      );
      if (match) {
        const level = match.levels.find((l) => l.level === doc.level);
        if (level) {
          modules = level.modules.map((mod) => ({
            id: mod.id,
            name: mod.name,
            coefficient: mod.coeficient,
            isOptional: !mod.obligatory,
          }));
        }
        break;
      }
    }

    if (modules.length > 0) {
      await Mark.create({
        groupId: doc.id,
        season: doc.season,
        modulesMeta: modules,
      });
    }

    next();
  } catch (err) {
    console.error("Failed to auto-create Mark:", err);
    next(err);
  }
});

const Group = model("Group", groupSchema);
export default Group;
