import express from "express";
import {
  getAlerts,
  getAlertById,
  createAlert,
  deleteAlert,
} from "../controllers/alertController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAlerts)
  .post(protect, createAlert); // Requires authentication to create an alert

router.route("/:id")
  .get(getAlertById)
  .delete(protect, deleteAlert);

export default router;
