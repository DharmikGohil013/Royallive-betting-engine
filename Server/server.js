require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// --------------- Config ---------------
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD_HASH) {
  console.error(
    "\n❌  ADMIN_PASSWORD_HASH is not set in .env\n" +
      '   Run: npm run create-admin  to generate one.\n'
  );
  process.exit(1);
}

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Auth Routes ---------------

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password against hash
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      token,
      user: { username: ADMIN_USERNAME, role: "admin" },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/verify — check if a token is still valid
app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch {
    return res.status(401).json({ valid: false });
  }
});

// --------------- Serve Admin Frontend (production) ---------------
const adminDistPath = path.join(__dirname, "admin-dist");
app.use(express.static(adminDistPath));

// SPA fallback — serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(adminDistPath, "index.html"));
});

// --------------- Start ---------------
app.listen(PORT, () => {
  console.log(`\n✅  GAIN LIVE Admin Server running on port ${PORT}`);
  console.log(`   Admin panel: http://localhost:${PORT}`);
  console.log(`   Login API:   http://localhost:${PORT}/api/auth/login\n`);
});
