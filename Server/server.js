require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { securityMiddleware, apiLimiter, authLimiter } = require("./middleware/auth");

// Routes
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const { router: userRoutes } = require("./routes/userRoutes");

const app = express();

// --------------- Config ---------------
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gainlive";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD_HASH) {
  console.error(
    "\n❌  ADMIN_PASSWORD_HASH is not set in .env\n" +
    '   Run: npm run create-admin  to generate one.\n'
  );
  process.exit(1);
}

// --------------- Security Middleware ---------------
app.use(...securityMiddleware());
app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(s => s.trim())
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:4000"],
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));

// Prevent fingerprinting
app.disable("x-powered-by");

// --------------- Database ---------------
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅  MongoDB connected");
  } catch (error) {
    console.error("❌  MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// --------------- API Routes ---------------

// Rate limit auth routes
app.use("/api/admin/login", authLimiter);
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);
app.use("/api/user/signup", authLimiter);

// General API rate limit
app.use("/api/", apiLimiter);

// Admin routes
app.use("/api/admin", adminRoutes);

// Analytics routes (admin only)
app.use("/api/analytics", analyticsRoutes);

// User routes
app.use("/api/user", userRoutes);

// --------------- Health/Test Routes ---------------
app.get("/api/health", (_req, res) => {
  return res.json({
    success: true,
    status: "ok",
    service: "gain-live-server",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// --------------- Serve Frontends (production) ---------------
const adminDistPath = path.join(__dirname, "admin-dist");
const userDistPath = path.join(__dirname, "..", "Users", "gain-live-frontend", "dist");

if (fs.existsSync(adminDistPath)) {
  app.use("/admin", express.static(adminDistPath));
}
if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
}

// SPA fallback
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }

  if (req.path.startsWith("/admin")) {
    const adminIndex = path.join(adminDistPath, "index.html");
    if (fs.existsSync(adminIndex)) return res.sendFile(adminIndex);
    return res.status(503).json({ error: "Admin frontend build not found" });
  }

  const userIndex = path.join(userDistPath, "index.html");
  if (fs.existsSync(userIndex)) return res.sendFile(userIndex);
  return res.status(503).json({ error: "User frontend build not found" });
});

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error" });
});

// --------------- Start ---------------
async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`\n✅  GAIN LIVE Server running on port ${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health`);
    console.log(`   Admin API:   http://localhost:${PORT}/api/admin`);
    console.log(`   User API:    http://localhost:${PORT}/api/user`);
    console.log(`   Analytics:   http://localhost:${PORT}/api/analytics\n`);
  });
}

startServer();
