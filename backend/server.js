const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (with retry logic — no process.exit so server stays alive)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout per attempt
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000); // retry instead of crashing
  }
};

// Mongoose connection event listeners
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
  setTimeout(connectDB, 5000);
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err.message);
});

connectDB();

// DB health middleware — returns 503 if DB not ready
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database not connected yet. Please retry in a moment.",
    });
  }
  next();
});

// Routes
app.use("/api/invoices", invoiceRoutes);

// Health check
app.get("/", (req, res) => {
  const dbState = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    message: "GST Invoice Generator API is running",
    database: dbState[mongoose.connection.readyState] || "unknown",
  });
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
