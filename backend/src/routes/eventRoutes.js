import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  voteEvent,
  markEventSeen,
} from "../controllers/eventController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getEvents);
router.get("/:id", optionalAuth, getEventById);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/vote", protect, voteEvent);
router.post("/:id/seen", optionalAuth, markEventSeen);

export default router;
