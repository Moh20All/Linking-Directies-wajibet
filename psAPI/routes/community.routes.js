import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import CommunityPost from "../models/communityPost.model.js";
import Group from "../models/groupe.model.js";
import { Student } from "../models/student.model.js";
import upload from "../middlewares/upload.middleware.js";
import uploadForStudent from "../middlewares/uploadForStudent.middleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 🔑 Middlewares
import authCommunity from "../middlewares/authCommunity.middleware.js";
import authenticateStudent from "../middlewares/authStudent.middleware.js";
import authenticateParent from "../middlewares/authParent.middleware.js";

const communityRouter = Router();

/**
 * 📌 Upload multiple files to temp folder
 */
communityRouter.post(
  "/uploads/temp",
  authCommunity,
  upload.array("files"),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded" });

      // Return temp paths for frontend to use in create post
      const tempFiles = req.files.map((file) => ({
        filename: file.filename,
        tempPath: file.path,
        mimetype: file.mimetype,
      }));

      res.status(200).json({ files: tempFiles });
    } catch (err) {
      console.error("❌ Temp Upload Error:", err);
      console.log(err);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

communityRouter.post(
  "/uploads/temp/student",
  authenticateStudent,
  uploadForStudent.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      // Return temp paths for frontend to use in create post
      const tempFiles = {
        filename: req.file.filename,
        tempPath: req.file.path,
        mimetype: req.file.mimetype,
      };

      res.status(200).json({ file: tempFiles });
    } catch (err) {
      console.error("❌ Temp Upload Error:", err);
      console.log(err);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

/**
 * 📌 Teacher creates a post using temp files
 */
communityRouter.post("/posts", authCommunity, async (req, res) => {
  try {
    const { title, content, groups, tempFiles } = req.body;

    if (!title?.trim())
      return res.status(400).json({ error: "Title is required" });
    if (!content?.trim())
      return res.status(400).json({ error: "Content is required" });

    const teacherId = req.teacher._id;
    const schoolId = req.teacher.schoolId;

    // Save post first (without files)
    const post = await CommunityPost.create({
      title,
      content,
      teacher: teacherId,
      school: schoolId,
      groups: groups || [],
      files: [],
    });

    // Move temp files to final directory
    const finalFiles = [];
    for (const f of tempFiles || []) {
      const groupId = groups?.[0] || "general";
      const finalDir = path.join(
        "uploads",
        String(schoolId),
        "posts",
        String(post._id),
        String(groupId)
      );
      fs.mkdirSync(finalDir, { recursive: true });

      const filename = path.basename(f.tempPath); // ensure filename
      const finalPath = path.join(finalDir, filename);

      fs.renameSync(f.tempPath, finalPath);

      finalFiles.push({
        filename,
        path: finalPath,
        mimetype: f.mimetype,
      });
    }

    post.files = finalFiles;
    await post.save();

    res.status(201).json({ message: "✅ Post created successfully", post });
  } catch (err) {
    console.error("❌ Create Post Error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

/**
 * 📌 Student replies to a post
 */
// communityRouter.post(
//   "/posts/:postId/studentreply",
//   authenticateStudent,
//   upload.array("files"),
//   async (req, res) => {
//     console.log("trying to upload");
//     try {
//       const { content } = req.body;
//       const { postId } = req.params;

//       if (!content?.trim()) {
//         return res.status(400).json({ error: "Reply content is required" });
//       }

//       const post = await CommunityPost.findById(postId).populate("groups");
//       if (!post) return res.status(404).json({ error: "Post not found" });

//       // ✅ Check if student is allowed
//       const studentGroups = req.student.registeredGroupId;
//       const allowedGroups = post.groups.map((g) => g.toString());
//       const canReply = allowedGroups.includes(studentGroups);

//       if (!canReply && allowedGroups.length > 0) {
//         return res.status(403).json({
//           error: "🚫 You are not allowed to reply to this post",
//         });
//       }

//       const { file } = req.body;

//       const files = {
//         filename: file.filename,
//         path: file.path,
//         mimetype: file.mimetype,
//       };

//       console.log(files);

//       post.replies.push({
//         student: req.student._id,
//         content,
//         files,
//       });
//       await post.save();

//       res.status(201).json({ message: "✅ Reply added successfully", post });
//     } catch (err) {
//       console.error("❌ Reply Error:", err);
//       res.status(500).json({ error: "Failed to add reply" });
//     }
//   }
// );

communityRouter.post(
  "/posts/:postId/reply",
  authCommunity,
  upload.array("files"),
  async (req, res) => {
    try {
      const { content } = req.body;
      const { postId } = req.params;

      if (!content?.trim()) {
        return res.status(400).json({ error: "Reply content is required" });
      }

      const post = await CommunityPost.findById(postId).populate("groups");
      if (!post) return res.status(404).json({ error: "Post not found" });

      const files = (req.files || []).map((file) => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }));

      post.replies.push({
        teacher: req.teacher._id, // ✅ fixed
        content,
        files,
      });

      await post.save();

      res.status(201).json({ message: "✅ Reply added successfully", post });
    } catch (err) {
      console.error("❌ Reply Error:", err);
      res.status(500).json({ error: "Failed to add reply" });
    }
  }
);

communityRouter.post(
  "/posts/:postId/studentreply",
  authenticateStudent,
  async (req, res) => {
    try {
      const { content, tempFile } = req.body;
      const { postId } = req.params;

      if (!content?.trim()) {
        return res.status(400).json({ error: "Reply content is required" });
      }

      const post = await CommunityPost.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      let fileData = null;

      if (tempFile) {
        console.log("temp file : ", tempFile);
        // tempFile is an object with details about the temporarily uploaded file
        const { tempPath, filename, mimetype } = tempFile;
        const schoolId = req.student.schoolId || "defaultSchool";

        // --- FIXED PATHS ---
        // 1. Create a full, absolute path to the temporary file
        const absoluteTempPath = path.join(process.cwd(), tempPath);

        // 2. Create a full, absolute path for the final destination directory
        const repliesDir = path.join(
          process.cwd(),
          "uploads",
          schoolId,
          "posts",
          postId,
          "replies"
        );

        // 3. Create the final absolute path for the file
        const absoluteFinalPath = path.join(repliesDir, filename);

        // Ensure the temporary file actually exists before trying to move it
        if (!fs.existsSync(absoluteTempPath)) {
          console.error("Temporary file not found at:", absoluteTempPath);
          return res.status(400).json({ error: "Temporary file is missing." });
        }

        // Ensure the destination directory exists (no change here, this was correct)
        fs.mkdirSync(repliesDir, { recursive: true });

        // Move the file from the temp location to the final destination
        fs.renameSync(absoluteTempPath, absoluteFinalPath);

        // 4. Create a clean, URL-friendly path to save in the database
        const dbPath = path
          .join("/uploads", schoolId, "posts", postId, "replies", filename)
          .replace(/\\/g, "/"); // Ensures forward slashes for URLs

        fileData = {
          filename: filename,
          path: dbPath,
          mimetype: mimetype,
        };
      }

      // Add reply to the post
      post.replies.push({
        student: req.student._id,
        content,
        files: fileData ? [fileData] : [],
      });

      await post.save();
      const newReply = post.replies[post.replies.length - 1];

      res.status(201).json(newReply); // Return just the new reply
    } catch (err) {
      console.error("❌ Reply Error:", err);
      res.status(500).json({ error: "Failed to add reply" });
    }
  }
);

/**
 * 📌 Teacher fetches all posts (for their school)
 */
communityRouter.get("/posts", authCommunity, async (req, res) => {
  try {
    const schoolId = req.teacher.schoolId;

    let posts = await CommunityPost.find({ school: schoolId })
      .populate("teacher", "full_name email")
      .populate("replies.student", "full_name email registeredGroupId")
      .populate("replies.teacher", "full_name email")
      .lean();

    // Populate groups manually
    for (let post of posts) {
      if (post.groups?.length > 0) {
        post.groups = await Group.find(
          { id: { $in: post.groups } },
          { groupName: 1 }
        ).lean();
      }
    }

    res.json(posts);
  } catch (err) {
    console.error("❌ Fetch Teacher Posts Error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/**
 * 📌 Student fetches posts
 */
// communityRouter.get("/posts/student", authenticateStudent, async (req, res) => {
//   try {
//     const schoolId = req.student.schoolId;
//     const studentGroupId = req.student.registeredGroupId;

//     let posts = await CommunityPost.find({ school: schoolId })
//       .populate("teacher", "full_name email")
//       .populate("replies.student", "full_name email")
//       .populate("replies.teacher", "full_name email")
//       .lean();

//     posts = posts.map((post) => {
//       // Ensure post.groups is an array of strings
//       const postGroupIds = (post.groups || []).map((id) => id);

//       post.canReply =
//         postGroupIds.length === 0 || // open to all if no groups
//         postGroupIds.includes(studentGroupId);

//       return post;
//     });

//     // Populate groups manually
//     for (let post of posts) {
//       if (post.groups?.length > 0) {
//         post.groups = await Group.find(
//           { id: { $in: post.groups } },
//           { groupName: 1 }
//         ).lean();
//       }
//       if (post.replies?.length > 0) {
//         for (let reply of post.replies) {
//           if (reply.files?.length > 0) {
//             reply.files = [true];
//           }
//         }
//       }
//     }

//     res.json(posts);
//   } catch (err) {
//     console.error("❌ Fetch Student Posts Error:", err);
//     res.status(500).json({ error: "Failed to fetch student posts" });
//   }
// });


communityRouter.get("/posts/student", authenticateStudent, async (req, res) => {
  try {
    const schoolId = req.student.schoolId;
    const studentGroupId = req.student.registeredGroupId;

    // ✅ Filter directly in query
    let posts = await CommunityPost.find({
      school: schoolId,
      $or: [
        { groups: { $size: 0 } }, // open to all if no groups
        { groups: studentGroupId } // student's group is included
      ]
    })
      .populate("teacher", "full_name email")
      .populate("replies.student", "full_name email")
      .populate("replies.teacher", "full_name email")
      .lean();

    // Populate groups manually
    for (let post of posts) {
      post.canReply=true;
      if (post.groups?.length > 0) {
        post.groups = await Group.find(
          { id: { $in: post.groups } },
          { groupName: 1 }
        ).lean();
      }
      if (post.replies?.length > 0) {
        for (let reply of post.replies) {
          if (reply.files?.length > 0) {
            reply.files = [true];
          }
        }
      }
    }

    res.json(posts);
  } catch (err) {
    console.error("❌ Fetch Student Posts Error:", err);
    res.status(500).json({ error: "Failed to fetch student posts" });
  }
});


/**
 * 📌 Parent fetches posts (based on children’s groups)
 */
communityRouter.get("/posts/parent", authenticateParent, async (req, res) => {
  try {
    const schoolId = req.school.schoolId;
    const parentId = req.user._id;

    // find parent’s children + groups
    const children = await Student.find({ parent: parentId, schoolId })
      .select("registeredGroups")
      .lean();

    const childGroupIds = children.flatMap((c) =>
      c.registeredGroups.map((g) => g.toString())
    );

    const posts = await CommunityPost.find({
      school: schoolId,
      $or: [
        { groups: { $exists: false } },
        { groups: { $size: 0 } },
        { groups: { $in: childGroupIds } },
      ],
    })
      .populate("teacher", "full_name email")
      .populate("groups", "groupName")
      .populate("replies.student", "full_name email");

    res.json(posts);
  } catch (err) {
    console.error("❌ Fetch Parent Posts Error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/**
 * 📌 Download file
 */
communityRouter.get(
  "/files/:schoolId/:postId/:groupId/:filename",
  async (req, res) => {
    try {
      const { schoolId, postId, groupId, filename } = req.params;
      const filePath = path.join(
        "uploads",
        schoolId,
        "posts",
        postId,
        groupId,
        filename
      );
      res.download(filePath);
    } catch (err) {
      console.error("❌ File Download Error:", err);
      res.status(404).json({ error: "File not found" });
    }
  }
);

/**
 * 📌 Update a teacher's post
 */
communityRouter.put(
  "/posts/:postId",
  authCommunity,
  upload.array("files"),
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content, groups } = req.body;

      // find post
      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      // only owner teacher can update
      if (post.teacher.toString() !== req.teacher._id.toString()) {
        return res
          .status(403)
          .json({ error: "🚫 You are not allowed to edit this post" });
      }

      // validate fields
      if (title && !title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      if (content && !content.trim()) {
        return res.status(400).json({ error: "Content cannot be empty" });
      }

      // update fields
      if (title) post.title = title;
      if (content) post.content = content;

      // update groups if provided
      if (groups) {
        let parsedGroups = groups;
        if (typeof groups === "string") {
          try {
            parsedGroups = JSON.parse(groups);
          } catch {
            parsedGroups = [groups];
          }
        }
        post.groups = parsedGroups;
      }

      // handle new files (append, don’t replace unless you want to)
      if (req.files?.length > 0) {
        const newFiles = req.files.map((file) => ({
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
        }));
        post.files.push(...newFiles);
      }

      await post.save();

      res.json({ message: "✅ Post updated successfully", post });
    } catch (err) {
      console.error("❌ Update Post Error:", err);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

/**
 * 📌 Delete a teacher's post
 */
communityRouter.delete("/posts/:postId", authCommunity, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // only owner teacher can delete
    if (post.teacher.toString() !== req.teacher._id.toString()) {
      return res
        .status(403)
        .json({ error: "🚫 You are not allowed to delete this post" });
    }

    await CommunityPost.findByIdAndDelete(postId);

    res.json({ message: "🗑️ Post deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Post Error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

/**
 * 📌 Update student's reply
 */
communityRouter.put(
  "/posts/:postId/replies/:replyId",
  authenticateStudent,
  upload.array("files"),
  async (req, res) => {
    try {
      const { postId, replyId } = req.params;
      const { content } = req.body;

      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const reply = post.replies.id(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      // only owner student can update
      if (reply.student.toString() !== req.student._id.toString()) {
        return res
          .status(403)
          .json({ error: "🚫 You are not allowed to edit this reply" });
      }

      if (content && content.trim()) reply.content = content;

      if (req.files?.length > 0) {
        const newFiles = req.files.map((file) => ({
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
        }));
        reply.files.push(...newFiles);
      }

      await post.save();
      res.json({ message: "✅ Reply updated successfully", post });
    } catch (err) {
      console.error("❌ Update Reply Error:", err);
      res.status(500).json({ error: "Failed to update reply" });
    }
  }
);

/**
 * 📌 Delete student's reply
 */
communityRouter.delete(
  "/posts/:postId/replies/:replyId",
  authenticateStudent,
  async (req, res) => {
    try {
      const { postId, replyId } = req.params;

      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const reply = post.replies.id(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      // only owner student can delete
      if (reply.student.toString() !== req.student._id.toString()) {
        return res
          .status(403)
          .json({ error: "🚫 You are not allowed to delete this reply" });
      }

      reply.deleteOne();
      await post.save();

      res.json({ message: "🗑️ Reply deleted successfully" });
    } catch (err) {
      console.error("❌ Delete Reply Error:", err);
      res.status(500).json({ error: "Failed to delete reply" });
    }
  }
);

communityRouter.post("/files/public-download", async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath)
      return res.status(400).json({ error: "File path is required" });

    // Normalize Windows-style slashes to POSIX
    const normalizedPath = filePath.replace(/\\/g, path.sep);

    // Resolve absolute path
    const absolutePath = path.resolve(normalizedPath);

    // Ensure the file is inside uploads folder
    if (!absolutePath.startsWith(path.resolve("uploads"))) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(absolutePath);
  } catch (err) {
    console.error("❌ Public Download Error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
});

export default communityRouter;
