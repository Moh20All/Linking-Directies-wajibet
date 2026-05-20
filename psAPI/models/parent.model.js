// models/parent.model.js
import mongoose from "mongoose";
import Member from "./member.model.js";

const { Schema } = mongoose;
const nationalIdRegex = /^[A-Z0-9]{6,20}$/i;
const parentSchema = new Schema(
  {
    relationship: {
      type: String,
      enum: ["mother", "father"],
      required: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    national_ID: {
      type: String,
      required: [true, "National ID is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return nationalIdRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid national ID!`,
      },
    },
    profession: {
      type: String,
      trim: true,
      required: false,
    },
    address: {
      type: String,
      trim: true,
      required: false,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: {
        type: String,
        trim: true,
        match: /^\+?\d{7,15}$/,
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: "memberType",
  }
);

const Parent = Member.discriminator("Parent", parentSchema);

export { Parent };
