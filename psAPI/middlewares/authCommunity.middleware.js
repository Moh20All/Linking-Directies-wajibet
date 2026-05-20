import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authenticateCommunity = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authorization header missing or malformed");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check for allowed roles
    if (decoded.role === "TEACHER") {
      req.teacher = decoded;
      return next();
    } 
    
    if (decoded.role === "HEADMASTER") {
      // Construct a teacher-like object for the headmaster to be compatible with existing logic
      req.teacher = {
        ...decoded,
        _id: decoded.schoolId, // Use schoolId as the "teacher" ID for headmaster posts
        full_name: "Headmaster", // Or fetch from profile if available, but "Headmaster" is clear
        role: "HEADMASTER"
      };
      return next();
    }

    const error = new Error("Unauthorized access. Role must be TEACHER or HEADMASTER.");
    error.statusCode = 403;
    return next(error);

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

export default authenticateCommunity;
