const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const SALT_ROUNDS = 12;

function normalizeMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function formatUserResponse(user) {
  if (typeof user.toSafeObject === "function") {
    return user.toSafeObject();
  }

  return {
    id: user._id,
    mobile: user.mobile,
    username: user.username,
    referralCode: user.referralCode,
    createdAt: user.createdAt,
  };
}

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

async function signupHandler(req, res) {
  try {
    const { mobile, username, password, referralCode } = req.body;

    if (!mobile || !username || !password) {
      return res.status(400).json({ error: "Mobile, username, and password are required" });
    }

    const normalizedMobile = normalizeMobile(mobile);
    const normalizedUsername = normalizeUsername(username);

    if (!/^\d{10,15}$/.test(normalizedMobile)) {
      return res.status(400).json({ error: "Mobile must contain 10 to 15 digits" });
    }

    if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
      return res.status(400).json({
        error: "Username must be 3 to 30 chars and contain only lowercase letters, numbers, and underscore",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ mobile: normalizedMobile }, { username: normalizedUsername }],
    });

    if (existingUser) {
      const field = existingUser.mobile === normalizedMobile ? "mobile" : "username";
      return res.status(409).json({ error: `${field} already in use` });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      mobile: normalizedMobile,
      username: normalizedUsername,
      password: hashedPassword,
      referralCode: referralCode ? String(referralCode).trim().toUpperCase() : null,
    });

    const token = createUserToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("User registration error:", error);

    if (error && error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(409).json({ error: `${duplicateField} already in use` });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

async function signinHandler(req, res) {
  try {
    const { accessId, username, mobile, password } = req.body;
    const incomingAccessId = accessId || username || mobile;

    if (!incomingAccessId || !password) {
      return res.status(400).json({ error: "Access ID (or username/mobile) and password are required" });
    }

    const cleanedAccessId = String(incomingAccessId).trim();
    const normalizedAccessMobile = normalizeMobile(cleanedAccessId);
    const normalizedAccessUsername = normalizeUsername(cleanedAccessId);

    const user = await User.findOne({
      $or: [
        { mobile: cleanedAccessId },
        { mobile: normalizedAccessMobile },
        { username: cleanedAccessId.toLowerCase() },
        { username: normalizedAccessUsername },
      ],
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
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

router.post("/register", signupHandler);
router.post("/signup", signupHandler);

router.post("/login", signinHandler);
router.post("/signin", signinHandler);

router.get("/verify", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({ valid: false, error: "User not found" });
    }

    return res.json({ valid: true, user: formatUserResponse(user) });
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

    return res.json({ success: true, user: formatUserResponse(user) });
  } catch (error) {
    console.error("User profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
