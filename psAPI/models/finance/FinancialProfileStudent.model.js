import mongoose from "mongoose";
import FinancialProfile from "./financialProfile.model.js";

const { Schema } = mongoose;

const studentFinancialProfileSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  role: { type: String, required: true, default: "STUDENT" },
});

// studentFinancialProfileSchema.pre("save", async function (next) {
//   this.role = "STUDENT";
//   next();
// });

const StudentFinancialProfile = FinancialProfile.discriminator(
  "StudentFinancialProfile",
  studentFinancialProfileSchema
);

export default StudentFinancialProfile;
