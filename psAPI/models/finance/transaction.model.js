import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    paymentProfileId: {
      type: Schema.Types.ObjectId,
      ref: "FinancialProfile",
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be >= 0"],
    },
    type: {
      type: String,
      enum: ["outflow", "inflow", "student_fees", "salary"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "card", "other"],
      default: "cash",
    },
    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  { timestamps: true, discriminatorKey: "transactionType" }
);

export default model("Transaction", transactionSchema);
