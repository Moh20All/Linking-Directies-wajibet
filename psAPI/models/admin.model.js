import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Admin", adminSchema);
