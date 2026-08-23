import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Event from "../models/Event.js";
import { isMongoConnected, memoryStore } from "../config/db.js";
import { sendSmsOtp } from "../utils/smsService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "geopulse_super_secret_jwt_key_2026", {
    expiresIn: "30d",
  });
};

const tempSecurityStore = new Map();

const checkSecurityLimits = (phone) => {
  const today = new Date().toDateString();
  const current = tempSecurityStore.get(phone) || {
    failedAttempts: 0,
    blockUntil: null,
    otpRequests: 0,
    lastRequestDate: today,
    tempOtp: null,
    tempOtpExpiry: null,
  };

  if (current.blockUntil && current.blockUntil > Date.now()) {
    const hoursLeft = Math.ceil((current.blockUntil - Date.now()) / (1000 * 60 * 60));
    return {
      allowed: false,
      message: `Phone number blocked for ${hoursLeft} more hours due to multiple failed attempts.`,
    };
  }

  if (current.lastRequestDate !== today) {
    current.otpRequests = 0;
    current.lastRequestDate = today;
  }

  if (current.otpRequests >= 5) {
    return {
      allowed: false,
      message: "Daily limit of 5 OTP requests reached. Please try again tomorrow.",
    };
  }

  return { allowed: true, data: current };
};

// Helper: Find User by phone
const findUserByPhone = async (phone) => {
  if (isMongoConnected) {
    try {
      return await User.findOne({ phone });
    } catch (e) {
      return null;
    }
  }
  return memoryStore.users.find((u) => u.phone === phone) || null;
};

// Helper: Find User by ID
const findUserById = async (id) => {
  if (isMongoConnected) {
    try {
      return await User.findById(id);
    } catch (e) {
      return null;
    }
  }
  return memoryStore.users.find((u) => (u._id || u.id)?.toString() === id?.toString()) || null;
};

// @desc    Request OTP for Registration
// @route   POST /api/auth/register-otp
// @access  Public
export const requestRegisterOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Valid 10-digit phone number is required" });
    }

    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already registered. Please login instead.",
      });
    }

    const security = checkSecurityLimits(phone);
    if (!security.allowed) {
      return res.status(429).json({ success: false, message: security.message });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const current = security.data;
    current.otpRequests += 1;
    current.tempOtp = otp;
    current.tempOtpExpiry = Date.now() + 10 * 60 * 1000;
    tempSecurityStore.set(phone, current);

    // Send real SMS to user's phone number
    const smsResult = await sendSmsOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: smsResult.success ? "OTP sent to your mobile phone" : "OTP sent successfully",
      otp, // Kept in payload for instant testing and on-screen toast fallback
    });
  } catch (error) {
    console.error("Register OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP and Complete Registration
// @route   POST /api/auth/register
// @access  Public
export const verifyAndRegister = async (req, res) => {
  try {
    const { phone, otp, name, countryCode = "+1", age = "", gender = "", country = "" } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const security = checkSecurityLimits(phone);
    if (!security.allowed) {
      return res.status(429).json({ success: false, message: security.message });
    }

    const current = security.data;
    if (!current.tempOtp || current.tempOtp !== otp.toString() || current.tempOtpExpiry < Date.now()) {
      current.failedAttempts += 1;
      if (current.failedAttempts >= 5) {
        current.blockUntil = Date.now() + 24 * 60 * 60 * 1000;
        tempSecurityStore.set(phone, current);
        return res.status(403).json({
          success: false,
          message: "Too many failed attempts. Phone number blocked for 24 hours.",
        });
      }
      tempSecurityStore.set(phone, current);
      return res.status(400).json({
        success: false,
        message: `Invalid or expired OTP. ${5 - current.failedAttempts} attempts remaining.`,
      });
    }

    current.failedAttempts = 0;
    current.tempOtp = null;
    tempSecurityStore.set(phone, current);

    let user;
    if (isMongoConnected) {
      user = await User.create({
        phone,
        countryCode,
        name: name || "User",
        age,
        gender,
        country,
        stats: { totalUpvotes: 0, totalDownvotes: 0 },
      });
    } else {
      user = {
        _id: `user_${Date.now()}`,
        id: `user_${Date.now()}`,
        phone,
        countryCode,
        name: name || "User",
        age,
        gender,
        country,
        profilePic: null,
        bio: "",
        stats: { totalUpvotes: 0, totalDownvotes: 0 },
        failedAttempts: 0,
        blockUntil: null,
        otpRequests: 0,
        lastRequestDate: new Date().toDateString(),
      };
      memoryStore.users.push(user);
    }

    const token = generateToken(user._id || user.id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id || user.id,
        phone: user.phone,
        countryCode: user.countryCode,
        name: user.name,
        age: user.age,
        gender: user.gender,
        country: user.country,
        profilePic: user.profilePic,
        bio: user.bio,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request OTP for Login
// @route   POST /api/auth/login-otp
// @access  Public
export const requestLoginOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Valid 10-digit phone number is required" });
    }

    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Phone number not registered. Please register first.",
      });
    }

    if (user.blockUntil && user.blockUntil > Date.now()) {
      const hoursLeft = Math.ceil((new Date(user.blockUntil).getTime() - Date.now()) / (1000 * 60 * 60));
      return res.status(429).json({
        success: false,
        message: `Phone number blocked for ${hoursLeft} more hours due to multiple failed attempts.`,
      });
    }

    const today = new Date().toDateString();
    if (user.lastRequestDate !== today) {
      user.otpRequests = 0;
      user.lastRequestDate = today;
    }

    if (user.otpRequests >= 5) {
      return res.status(429).json({
        success: false,
        message: "Daily limit of 5 OTP requests reached. Please try again tomorrow.",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpRequests = (user.otpRequests || 0) + 1;

    if (isMongoConnected) {
      await user.save();
    }

    // Send real SMS to user's phone number
    const smsResult = await sendSmsOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: smsResult.success ? "OTP sent to your mobile phone" : "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("Login OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/login
// @access  Public
export const verifyAndLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.blockUntil && new Date(user.blockUntil).getTime() > Date.now()) {
      return res.status(429).json({
        success: false,
        message: "Phone number is blocked. Please try again later.",
      });
    }

    if (!user.otp || user.otp !== otp.toString() || !user.otpExpiry || new Date(user.otpExpiry).getTime() < Date.now()) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= 5) {
        user.blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        if (isMongoConnected) await user.save();
        return res.status(403).json({
          success: false,
          message: "Too many failed attempts. Number blocked for 24 hours.",
        });
      }
      if (isMongoConnected) await user.save();
      return res.status(400).json({
        success: false,
        message: `Invalid or expired OTP. ${5 - user.failedAttempts} attempts left.`,
      });
    }

    user.failedAttempts = 0;
    user.otp = null;
    user.otpExpiry = null;
    if (isMongoConnected) await user.save();

    const token = generateToken(user._id || user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id || user.id,
        phone: user.phone,
        countryCode: user.countryCode,
        name: user.name,
        age: user.age,
        gender: user.gender,
        country: user.country,
        profilePic: user.profilePic,
        bio: user.bio,
        stats: user.stats || { totalUpvotes: 0, totalDownvotes: 0 },
      },
    });
  } catch (error) {
    console.error("Login verify error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile & stats
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let totalUpvotes = 0;
    let totalDownvotes = 0;

    if (isMongoConnected) {
      const myReports = await Report.find({ "author.user": user._id });
      totalUpvotes = myReports.reduce((sum, r) => sum + (r.upvotes || 0), 0);
      totalDownvotes = myReports.reduce((sum, r) => sum + (r.downvotes || 0), 0);
      user.stats = { totalUpvotes, totalDownvotes };
      await user.save();
    } else {
      const myReports = memoryStore.reports.filter(
        (r) => r.author?.user?.toString() === userId.toString() || r.author?.phone === user.phone
      );
      totalUpvotes = myReports.reduce((sum, r) => sum + (r.upvotes || 0), 0);
      totalDownvotes = myReports.reduce((sum, r) => sum + (r.downvotes || 0), 0);
      user.stats = { totalUpvotes, totalDownvotes };
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        phone: user.phone,
        countryCode: user.countryCode,
        name: user.name,
        age: user.age,
        gender: user.gender,
        country: user.country,
        profilePic: user.profilePic,
        bio: user.bio,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, bio, profilePic, age, gender, country } = req.body;

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (country !== undefined) user.country = country;

    if (isMongoConnected) {
      await user.save();
      if (name !== undefined || profilePic !== undefined) {
        await Report.updateMany(
          { "author.user": user._id },
          { $set: { "author.name": user.name, "author.profilePic": user.profilePic } }
        );
        await Event.updateMany(
          { "author.user": user._id },
          { $set: { "author.name": user.name, "author.profilePic": user.profilePic } }
        );
      }
    } else {
      memoryStore.reports.forEach((r) => {
        if (r.author?.user?.toString() === userId.toString() || r.author?.phone === user.phone) {
          if (name !== undefined) r.author.name = name;
          if (profilePic !== undefined) r.author.profilePic = profilePic;
        }
      });
      memoryStore.events.forEach((e) => {
        if (e.author?.user?.toString() === userId.toString() || e.author?.phone === user.phone) {
          if (name !== undefined) e.author.name = name;
          if (profilePic !== undefined) e.author.profilePic = profilePic;
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id || user.id,
        phone: user.phone,
        countryCode: user.countryCode,
        name: user.name,
        age: user.age,
        gender: user.gender,
        country: user.country,
        profilePic: user.profilePic,
        bio: user.bio,
        stats: user.stats,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public profile of another user
// @route   GET /api/auth/user/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let reportsCount = 0;
    let eventsCount = 0;

    if (isMongoConnected) {
      reportsCount = await Report.countDocuments({ "author.user": user._id });
      eventsCount = await Event.countDocuments({ "author.user": user._id });
    } else {
      reportsCount = memoryStore.reports.filter((r) => r.author?.user?.toString() === user._id?.toString() || r.author?.name === user.name).length;
      eventsCount = memoryStore.events.filter((e) => e.author?.user?.toString() === user._id?.toString() || e.author?.name === user.name).length;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        profilePic: user.profilePic,
        bio: user.bio,
        country: user.country,
        stats: user.stats,
        reportsCount,
        eventsCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
