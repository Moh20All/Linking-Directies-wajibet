import mongoose from "mongoose";
import FinancialProfile from "./financialProfile.model.js";

const { Schema } = mongoose;

const teacherFinancialProfileSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    salary: {
      type: Number,
      min: [0, "Salary must be positive"],
      default: 0,
    },
    role: { type: String, required: true, default: "TEACHER" },

    bankAccount: {
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
    },

    lastPayment: {
      date: { type: Date },
      amount: { type: Number, min: 0 },
      transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    },
  },
  { timestamps: true }
);

// teacherFinancialProfileSchema.pre("save", async function (next) {
//   this.role = "TEACHER";
//   next();
// });

const TeacherFinancialProfile = FinancialProfile.discriminator(
  "TeacherFinancialProfile",
  teacherFinancialProfileSchema
);

export default TeacherFinancialProfile;
