import express from "express";
import {
  requestRegisterOtp,
  verifyAndRegister,
  requestLoginOtp,
  verifyAndLogin,
  getMe,
  updateProfile,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-otp", requestRegisterOtp);
router.post("/register", verifyAndRegister);
router.post("/login-otp", requestLoginOtp);
router.post("/login", verifyAndLogin);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/user/:id", getUserProfile);

export default router;
