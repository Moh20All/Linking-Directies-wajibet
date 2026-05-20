import mongoose from "mongoose";
const { Schema, model } = mongoose;

const maintenanceSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    assetId: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["routine", "repair", "inspection"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "overdue", "pending"],
      default: "scheduled",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      required: true,
      default: "medium",
    },
    scheduledDate: { type: String, required: true },
    completedDate: { type: String },
    cost: { type: Number, min: 0 },
    description: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// 🔧 Middleware: auto-set status if completedDate exists
maintenanceSchema.pre("save", function (next) {
  if (this.completedDate && this.status !== "completed") {
    this.status = "completed";
  }
  next();
});

const Maintenance = model("Maintenance", maintenanceSchema);
export default Maintenance;
