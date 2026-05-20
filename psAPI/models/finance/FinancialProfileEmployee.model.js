import mongoose from "mongoose";
import FinancialProfile from "./financialProfile.model.js";

const { Schema } = mongoose;

const employeeFinancialProfileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    department: { type: String, trim: true },

    salary: {
      type: Number,
      required: true,
      min: [0, "Salary must be positive"],
    },

    bankAccount: {
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
    },
    hireDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastPayment: {
      date: { type: Date },
      amount: { type: Number, min: 0 },
      transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    },
  },
  { timestamps: true }
);

const EmployeeFinancialProfile = FinancialProfile.discriminator(
  "EmployeeFinancialProfile",
  employeeFinancialProfileSchema
);

export default EmployeeFinancialProfile;
