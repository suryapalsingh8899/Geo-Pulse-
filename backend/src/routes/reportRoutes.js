import express from "express";
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  voteReport,
  markReportSeen,
} from "../controllers/reportController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getReports);
router.get("/:id", optionalAuth, getReportById);
router.post("/", protect, createReport);
router.put("/:id", protect, updateReport);
router.delete("/:id", protect, deleteReport);
router.post("/:id/vote", protect, voteReport);
router.post("/:id/seen", optionalAuth, markReportSeen);

export default router;
