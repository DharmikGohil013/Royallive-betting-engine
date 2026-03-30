const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

function getBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

function createUserToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      mobile: user.mobile,
      username: user.username,
      role: "user",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function authUser(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/register", async (req, res) => {
  try {
    const { mobile, username, password, referralCode } = req.body;

    if (!mobile || !username || !password) {
      return res.status(400).json({ error: "Mobile, username, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const normalizedMobile = String(mobile).trim();
    const normalizedUsername = String(username).trim();

    const existingUser = await User.findOne({
      $or: [{ mobile: normalizedMobile }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists with mobile or username" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      mobile: normalizedMobile,
      username: normalizedUsername,
      password: hashedPassword,
      referralCode: referralCode ? String(referralCode).trim() : null,
    });

    const token = createUserToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        username: user.username,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accessId, password } = req.body;

    if (!accessId || !password) {
      return res.status(400).json({ error: "Access ID and password are required" });
    }

    const user = await User.findOne({
      $or: [{ mobile: String(accessId).trim() }, { username: String(accessId).trim() }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createUserToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        username: user.username,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({ valid: false, error: "User not found" });
    }

    return res.json({ valid: true, user });
  } catch (error) {
    console.error("User verify error:", error);
    return res.status(500).json({ valid: false, error: "Internal server error" });
  }
});

router.get("/profile", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("User profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
