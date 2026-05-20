import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { Host, PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import headmasterRouter from "./routes/headmaster.routes.js";
import studentsRouter from "./routes/students.routes.js";
import teachersRouter from "./routes/teachers.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import pedagogyRouter from "./routes/pedagogy.routes.js";
import assetsRouter from "./routes/assets.routes.js";
import attendanceRouter from "./routes/Attendance.routes.js";
import financeRouter from "./routes/finance.routes.js";
import helpRouter from "./routes/help.routes.js";
import parentRouter from "./routes/parent.routes.js";
import communityRouter from "./routes/community.routes.js";
import meetingRouter from "./routes/meeting.routes.js";
import tgbot from "./routes/tgbot.routes.js";
import adminRouter from "./routes/admin.routes.js";
import wajibetRouter from "./routes/wajibet.routes.js";
const app = express();

const whitelist = [Host, "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/head/", headmasterRouter);
app.use("/api/teacher/", teachersRouter);
app.use("/api/student/", studentsRouter);
app.use("/api/parent/", parentRouter);
app.use("/api/staff/pedagogy", pedagogyRouter);
app.use("/api/staff/assets", assetsRouter);
app.use("/api/staff/finance", financeRouter);
app.use("/api/staff/attendance", attendanceRouter);
app.use("/api/help", helpRouter);
app.use("/api/community/", communityRouter);
app.use("/api/meetings/", meetingRouter);
app.use("/api/tgbot/", tgbot);
app.use("/api/admin/", adminRouter);
app.use("/api/wajibet", wajibetRouter);

app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.json(true);
});

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await connectToDatabase();
});

export default app;
