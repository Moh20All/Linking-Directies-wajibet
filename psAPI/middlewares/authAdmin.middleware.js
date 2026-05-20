import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authorization header missing or malformed");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Assuming admin role is consistent with controller login
    if (decoded.role !== "ADMIN") { 
      const error = new Error("Unauthorized access: Admin role required");
      error.statusCode = 403;
      return next(error);
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      err.message = "Access token expired";
      err.statusCode = 401;
    } else if (err.name === "JsonWebTokenError") {
      err.message = "Invalid access token";
      err.statusCode = 401;
    } else {
      err.message = "Failed to authenticate token";
      err.statusCode = 500;
    }

    next(err);
  }
};

export default authenticateAdmin;
