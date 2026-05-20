import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      //   console.log(req.teacher);
      const { schoolId } = req.teacher; // from auth middleware
      const { postId, groupId } = req.body;

      if (!schoolId) {
        return cb(new Error("Missing schoolId"));
      }

      // If postId not provided (new post creation), store in tmp until post is created
      const targetPostId = postId || "temp";

      const uploadPath = path.join(
        "uploads",
        String(schoolId),
        "posts",
        String(targetPostId),
        String(groupId)
      );

      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
export default upload;
