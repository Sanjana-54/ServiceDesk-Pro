import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Existing routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import slaRoutes from "./routes/slaRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";

// New management routes
import technicianRoutes from "./routes/technicianRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
import assetLifecycleRoutes from "./routes/assetLifecycleRoutes.js";
import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://service-desk-pro-beta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ===============================
// Existing API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/sla", slaRoutes);

app.use("/api/assets", assetRoutes);

// ===============================
// New API Routes
// ===============================

// Technician
app.use("/api/technician", technicianRoutes);

// System Admin + IT Manager management
app.use("/api/management", managementRoutes);

// Asset lifecycle and warranty management
app.use("/api/asset-lifecycle", assetLifecycleRoutes);

// Knowledge Base
app.use("/api/knowledge", knowledgeBaseRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// Audit Logs
app.use("/api/audit", auditRoutes);

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "ServiceDesk Pro Backend is running!",
  });
});

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: `Path ${req.url} is invalid`,
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Server side error",
  });
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

startServer();