import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    countryCode: {
      type: String,
      default: "+1",
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "User",
    },
    age: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    stats: {
      totalUpvotes: {
        type: Number,
        default: 0,
      },
      totalDownvotes: {
        type: Number,
        default: 0,
      },
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    blockUntil: {
      type: Date,
      default: null,
    },
    otpRequests: {
      type: Number,
      default: 0,
    },
    lastRequestDate: {
      type: String,
      default: () => new Date().toDateString(),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
