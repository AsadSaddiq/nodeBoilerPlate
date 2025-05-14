import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpResponse } from "../utils/index.js";
import { User } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return httpResponse.UNAUTHORIZED(res, {}, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);

    // Check if user exists
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return httpResponse.UNAUTHORIZED(res, {}, "User not found");
    }

    // Add user to request object
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return httpResponse.UNAUTHORIZED(res, {}, "Token expired");
    }

    if (error.name === "JsonWebTokenError") {
      return httpResponse.UNAUTHORIZED(res, {}, "Invalid token");
    }

    return httpResponse.INTERNAL_SERVER_ERROR(res, {}, error.message);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return httpResponse.UNAUTHORIZED(res, {}, "User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      return httpResponse.FORBIDDEN(
        res,
        {},
        "Not authorized to access this resource"
      );
    }

    next();
  };
};
