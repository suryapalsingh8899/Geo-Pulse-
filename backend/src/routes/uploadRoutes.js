import express from "express";
import { uploadFile, uploadMultipleFiles } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadFile);
router.post("/multiple", upload.array("files", 10), uploadMultipleFiles);

export default router;
