import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import School from "../models/school.model.js";
import Member from "../models/member.model.js";
import authenticate from "../middlewares/auth.middleware.js";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/env.js";
const authRouter = Router();

// Default
authRouter.get("/", (req, res) => {
  res.send({
    message: "Private Schools Auth API",
  });
});

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "3d",
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

authRouter.post("/create", async (req, res) => {
  try {
    const { information, derivationKey, auth } = req.body;

    const existing = await School.findOne({ "auth.email": auth.email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(auth.password, 10);

    const newSchool = await School.create({
      information,
      derivationKey,
      auth: {
        email: auth.email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "School account created", schoolId: newSchool._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let role = "HEADMASTER";
    let school = await School.findOne({ "auth.email": email });

    if (!school) {
      const derivationKey = email.split("@")[1];
      school = await School.findOne({ derivationKey: derivationKey });
      if (!school)
        return res.status(400).json({ error: "School not found or Inactive" });
      const user = await Member.findOne({
        fullUsername: email,
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      role = user.role;
      const payload = {
        ...user._doc,
        password: undefined,
        schoolType: school.information.type, // Include school type
      };
      const { accessToken, refreshToken } = generateTokens(payload);

      res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        accessToken,
        role,
        schoolType: school.information.type,
        subscriptionStatus: school.substatus,
      });
    }

    const isMatch = await bcrypt.compare(password, school.auth.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const payload = {
      schoolId: school._id,
      role,
      derivationKey: school.derivationKey,
      schoolType: school.information.type, // Include school type
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, role, schoolType: school.information.type, subscriptionStatus: school.substatus });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/handshake", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const decode = jwt.verify(token, JWT_REFRESH_SECRET);
    const { exp, iat, ...payload } = decode;

    const school = await School.findById(payload.schoolId).select(
      "information.type substatus"
    );
    if (!school)
      return res
        .status(404)
        .json({ error: "School associated with token not found." });

    payload.schoolType = school.information.type;

    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "3d" });

    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      role: payload.role,
      schoolType: payload.schoolType,
      subscriptionStatus: school.substatus,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Refresh token expired. Please login again." });
    }
    console.log(err);

    return res.status(403).json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/logout", (req, res) => {
  const cookies = req.cookies;

  if (!cookies || Object.keys(cookies).length === 0) {
    return res.json({ message: "No cookies to clear" });
  }
  Object.keys(cookies).forEach((cookieName) => {
    res.clearCookie(cookieName, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
  });

  res.json({ message: "All cookies cleared. Logged out." });
});

// Protected test route
authRouter.get("/me", authenticate, async (req, res) => {
  try {
    var school;
    if (req.role !== "HEADMASTER") {
      school = await School.findById(req.school.schoolId).select(
        "-auth -subscriptions -information.tabspwds"
      );
    } else {
      school = await School.findById(req.school.schoolId).select(
        "-auth.password"
      );
    }

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    let expiresIn = null;
    if (token) {
      const decoded = jwt.decode(token, { complete: true });
      if (decoded?.payload?.exp) {
        expiresIn = decoded.payload.exp * 1000 - Date.now();
      }
    }

    res.json({
      school,
      accessTokenExpiresIn: expiresIn,
      role: req.role,
      schoolType: school.information.type,
      full_name: req.role !== "HEADMASTER" ? req.full_name : undefined,
      phone_number: req.role !== "HEADMASTER" ? req.phone_number : undefined,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

import authStaff from "../middlewares/authStaff.middleware.js";
authRouter.get("/tabs/status", authStaff, async (req, res) => {
  try {
    const schoolId = req.school.schoolId;
    const school = await School.findById(schoolId).select(
      "information.tabspwds"
    );

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const tabPasswords = school.information.tabspwds;

    const status = {
      pedagogy: !!tabPasswords.pedagogy,
      finance: !!tabPasswords.finance,
      attendance: !!tabPasswords.attendance,
      assets: !!tabPasswords.assets,
    };

    res.status(200).json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tab password statuses" });
  }
});

export default authRouter;
