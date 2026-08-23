import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isMongoConnected, memoryStore } from "../config/db.js";

const findUserById = async (id) => {
  if (isMongoConnected) {
    try {
      return await User.findById(id).select("-otp -otpExpiry");
    } catch (e) {
      return null;
    }
  }
  const u = memoryStore.users.find((user) => (user._id || user.id)?.toString() === id?.toString());
  return u || null;
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "geopulse_super_secret_jwt_key_2026"
      );

      req.user = await findUserById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found or session expired" });
      }

      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "geopulse_super_secret_jwt_key_2026"
      );
      req.user = await findUserById(decoded.id);
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};
