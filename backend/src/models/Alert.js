import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },
    type: {
      type: String,
      default: "other",
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    author: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: {
        type: String,
        default: "Authority",
      },
      profilePic: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ lat: 1, lng: 1 });

const Alert = mongoose.models.Alert || mongoose.model("Alert", alertSchema);
export default Alert;
