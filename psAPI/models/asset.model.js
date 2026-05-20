import mongoose from "mongoose";
const { Schema, model } = mongoose;

const assetSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["excellent", "good", "fair", "poor", "needs-repair"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "disposed"],
      required: true,
    },
    ownership: {
      type: String,
      enum: ["school-owned", "leased", "donated", "borrowed"],
      required: true,
    },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number, min: 0 },
    currentValue: { type: Number, min: 0 },
    serialNumber: { type: String, trim: true, sparse: true },
    manufacturer: { type: String, trim: true },
    model: { type: String, trim: true },
    warranty: { type: String, trim: true },
    notes: { type: String, trim: true },
    assignedTo: { type: String, trim: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  { timestamps: true }
);

const Asset = model("Asset", assetSchema);
export default Asset;
