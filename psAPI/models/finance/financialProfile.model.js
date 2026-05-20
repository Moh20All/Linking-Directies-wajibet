import mongoose from "mongoose";
const { Schema, model } = mongoose;

const financialProfileSchema = new Schema(
  {
    schoolId: {
      type: String,
      ref: "School",
      required: [true, "School ID is required"],
    },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "STAFF", "OTHER"],
      required: [true, "Role is required"],
    },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { timestamps: true, discriminatorKey: "financialProfile" }
);

export default model("FinancialProfile", financialProfileSchema);
