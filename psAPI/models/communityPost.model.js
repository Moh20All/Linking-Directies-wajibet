import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
});

const ReplySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  content: String,
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now },
});

const CommunityPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // ✅ New field
    content: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: false, // ✅ Optional for Headmaster
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    groups: [{ type: String, required: true }], // ✅ Group IDs as strings
    files: [FileSchema],
    replies: [ReplySchema],
  },
  { timestamps: true }
);

export default mongoose.model("CommunityPost", CommunityPostSchema);
