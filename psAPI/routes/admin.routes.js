import { Router } from "express";
import {
  getAdminOverview,
  verifyAdminHealth,
  createAdmin,
  loginAdmin,
  createSchool,
  getSchools,
  getSchoolById,
  updateMaxStudents,
  updateSubscription,
} from "../controllers/admin.controller.js";
import authenticateAdmin from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router();

// Public routes
adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);

// Protected routes
adminRouter.use(authenticateAdmin);

adminRouter.get("/", getAdminOverview);
adminRouter.get("/health", verifyAdminHealth);

// School Management
adminRouter.post("/schools", createSchool);
adminRouter.get("/schools", getSchools);
adminRouter.get("/schools/:id", getSchoolById);
adminRouter.patch("/schools/:id/max-students", updateMaxStudents);
adminRouter.patch("/schools/:id/subscription", updateSubscription);

export default adminRouter;
