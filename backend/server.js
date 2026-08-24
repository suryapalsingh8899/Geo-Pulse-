import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.set("trust proxy", 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: "*", // Allows requests from Vite frontend or any client
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Serve uploaded static assets
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health & Root Endpoints
app.get("/", (req, res) => {
  res.json({
    name: "Geo-Pulse API",
    version: "1.0.0",
    status: "Active",
    documentation: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Geo-Pulse Backend",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Geo-Pulse Backend Server running on http://localhost:${PORT}`);
});

export default app;
