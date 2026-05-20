import mongoose from "mongoose";
import Transaction from "./transaction.model.js";

const { Schema } = mongoose;

const studentPaymentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    nextPaymentDate: { type: Date },
    paymentPlan: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
      default: "MONTHLY",
    },
  },
  { timestamps: true }
);

// Auto-calc nextPaymentDate
studentPaymentSchema.pre("validate", function (next) {
  if (this.paymentPlan) {
    const baseDate = this.createdAt || new Date();
    if (this.paymentPlan === "QUARTERLY")
      baseDate.setMonth(baseDate.getMonth() + 3);
    else if (this.paymentPlan === "YEARLY")
      baseDate.setFullYear(baseDate.getFullYear() + 1);
    else baseDate.setMonth(baseDate.getMonth() + 1);
    this.nextPaymentDate = baseDate;
  }
  next();
});

const StudentPayment = Transaction.discriminator(
  "StudentPayment",
  studentPaymentSchema
);

export default StudentPayment;
