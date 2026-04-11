const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Bet = require("../models/Bet");
const Game = require("../models/Game");
const Notification = require("../models/Notification");
const PaymentMethod = require("../models/PaymentMethod");
const CricketMatch = require("../models/CricketMatch");
const Setting = require("../models/Setting");
const ActivityLog = require("../models/ActivityLog");
const { authToken, activeUser } = require("../middleware/auth");

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
  if (typeof user.toSafeObject === "function") return user.toSafeObject();
  return {
    id: user._id,
    mobile: user.mobile,
    email: user.email,
    username: user.username,
    role: user.role,
    balance: user.balance,
    referralCode: user.referralCode,
    status: user.status,
    createdAt: user.createdAt,
  };
}

function createUserToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), mobile: user.mobile, username: user.username, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ==================== REGISTER ====================
async function signupHandler(req, res) {
  try {
    const { mobile, email, username, password, referralCode } = req.body;

    if (!mobile || !username || !password) {
      return res.status(400).json({ error: "Mobile, username, and password are required" });
    }

    const normalizedMobile = normalizeMobile(mobile);
    const normalizedUsername = normalizeUsername(username);

    if (!/^\d{10,15}$/.test(normalizedMobile)) {
      return res.status(400).json({ error: "Mobile must contain 10 to 15 digits" });
    }
    if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
      return res.status(400).json({ error: "Username must be 3-30 chars: lowercase letters, numbers, underscore" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const existingUser = await User.findOne({
      $or: [{ mobile: normalizedMobile }, { username: normalizedUsername }],
    });
    if (existingUser) {
      const field = existingUser.mobile === normalizedMobile ? "mobile" : "username";
      return res.status(409).json({ error: `${field} already in use` });
    }

    if (normalizedEmail) {
      const emailExists = await User.findOne({ email: normalizedEmail });
      if (emailExists) return res.status(409).json({ error: "email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      mobile: normalizedMobile,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      referralCode: referralCode ? String(referralCode).trim().toUpperCase() : null,
    });

    const token = createUserToken(user);

    await ActivityLog.create({
      user: user._id, action: "user_register", category: "auth",
      ip: req.ip, userAgent: (req.headers["user-agent"] || "").substring(0, 200),
    });

    return res.status(201).json({ success: true, token, user: formatUserResponse(user) });
  } catch (error) {
    console.error("User registration error:", error);
    if (error && error.code === 11000) {
      const dup = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(409).json({ error: `${dup} already in use` });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== LOGIN ====================
async function signinHandler(req, res) {
  try {
    const { accessId, username, mobile, email, password } = req.body;
    const incoming = accessId || username || mobile || email;

    if (!incoming || !password) {
      return res.status(400).json({ error: "Access ID and password are required" });
    }

    const cleaned = String(incoming).trim();
    const normalizedMobile = normalizeMobile(cleaned);
    const normalizedUsername = normalizeUsername(cleaned);
    const normalizedEmail = cleaned.toLowerCase();

    const user = await User.findOne({
      $or: [
        { mobile: cleaned },
        { mobile: normalizedMobile },
        { username: normalizedUsername },
        { email: normalizedEmail },
      ],
    });

    if (!user) {
      await ActivityLog.create({ action: "login_failed_no_user", category: "auth", ip: req.ip, details: cleaned.substring(0, 30) });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await ActivityLog.create({ user: user._id, action: "login_failed_wrong_password", category: "auth", ip: req.ip });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = createUserToken(user);

    await ActivityLog.create({
      user: user._id, action: "user_login", category: "auth",
      ip: req.ip, userAgent: (req.headers["user-agent"] || "").substring(0, 200),
    });

    return res.json({ success: true, token, user: formatUserResponse(user) });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ==================== REGISTER/LOGIN ROUTES ====================
router.post("/register", signupHandler);
router.post("/signup", signupHandler);
router.post("/login", signinHandler);
router.post("/signin", signinHandler);

// ==================== VERIFY TOKEN ====================
router.get("/verify", authToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");
    if (!user) return res.status(404).json({ valid: false, error: "User not found" });
    return res.json({ valid: true, user: formatUserResponse(user) });
  } catch {
    return res.status(500).json({ valid: false, error: "Internal server error" });
  }
});

// ==================== PROFILE ====================
router.get("/profile", authToken, activeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user: formatUserResponse(user) });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", authToken, activeUser, async (req, res) => {
  try {
    const { email } = req.body;
    const updates = {};
    if (email !== undefined) {
      const normalized = email ? String(email).trim().toLowerCase() : null;
      if (normalized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return res.status(400).json({ error: "Invalid email" });
      }
      updates.email = normalized;
    }
    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user: formatUserResponse(user) });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== CHANGE PASSWORD ====================
router.put("/change-password", authToken, activeUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });

    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return res.json({ success: true, message: "Password changed successfully" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== WALLET / BALANCE ====================
router.get("/wallet", authToken, activeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("balance totalDeposits totalWithdrawals").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const recentTxns = await Transaction.find({ user: req.user.sub })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ success: true, balance: user.balance, totalDeposits: user.totalDeposits, totalWithdrawals: user.totalWithdrawals, transactions: recentTxns });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== DEPOSIT REQUEST ====================
router.post("/deposit", authToken, activeUser, async (req, res) => {
  try {
    const { amount, paymentMethod, reference } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) return res.status(400).json({ error: "Minimum deposit is 100" });
    if (numAmount > 500000) return res.status(400).json({ error: "Maximum deposit is 500,000" });

    const txn = await Transaction.create({
      user: req.user.sub,
      type: "deposit",
      amount: numAmount,
      paymentMethod: paymentMethod || "",
      reference: reference || "",
      status: "pending",
    });

    return res.status(201).json({ success: true, transaction: txn });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== WITHDRAW REQUEST ====================
router.post("/withdraw", authToken, activeUser, async (req, res) => {
  try {
    const { amount, paymentMethod, reference } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) return res.status(400).json({ error: "Minimum withdrawal is 100" });

    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.balance < numAmount) return res.status(400).json({ error: "Insufficient balance" });

    const txn = await Transaction.create({
      user: req.user.sub,
      type: "withdraw",
      amount: numAmount,
      paymentMethod: paymentMethod || "",
      reference: reference || "",
      status: "pending",
    });

    return res.status(201).json({ success: true, transaction: txn });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== TRANSACTION HISTORY ====================
router.get("/transactions", authToken, activeUser, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const type = req.query.type || "";

    const filter = { user: req.user.sub };
    if (type) filter.type = type;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Transaction.countDocuments(filter),
    ]);

    return res.json({ success: true, transactions, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PLACE BET ====================
router.post("/bets", authToken, activeUser, async (req, res) => {
  try {
    const { gameId, gameSlug, matchId, betType, selection, odds, stake } = req.body;
    const numStake = Number(stake);
    const numOdds = Number(odds);

    if (!numStake || numStake <= 0) return res.status(400).json({ error: "Valid stake required" });
    if (!numOdds || numOdds <= 0) return res.status(400).json({ error: "Valid odds required" });

    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.balance < numStake) return res.status(400).json({ error: "Insufficient balance" });

    // Deduct stake
    user.balance -= numStake;
    user.totalBets = (user.totalBets || 0) + 1;
    await user.save();

    const bet = await Bet.create({
      user: req.user.sub,
      game: gameId || null,
      gameSlug: gameSlug || "",
      matchId: matchId || "",
      betType: betType || "single",
      selection: selection || "",
      odds: numOdds,
      stake: numStake,
      potentialWin: numStake * numOdds,
    });

    return res.status(201).json({ success: true, bet, newBalance: user.balance });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BET HISTORY ====================
router.get("/bets", authToken, activeUser, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const result = req.query.result || "";

    const filter = { user: req.user.sub };
    if (result) filter.result = result;

    const [bets, total] = await Promise.all([
      Bet.find(filter).populate("game", "name slug").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Bet.countDocuments(filter),
    ]);

    return res.json({ success: true, bets, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== GAMES (public-ish for users) ====================
router.get("/games", async (req, res) => {
  try {
    const category = req.query.category || "";
    const filter = { isActive: true };
    if (category) filter.category = category;

    const games = await Game.find(filter)
      .select("name slug category description image badge badgeColor isFeatured minBet maxBet volatility")
      .sort({ isFeatured: -1, sortOrder: 1 })
      .lean();

    return res.json({ success: true, games });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== FEATURED GAMES ====================
router.get("/games/featured", async (_req, res) => {
  try {
    const games = await Game.find({ isActive: true, isFeatured: true })
      .select("name slug category image badge badgeColor")
      .sort({ sortOrder: 1 })
      .limit(6)
      .lean();
    return res.json({ success: true, games });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== LEADERBOARD ====================
router.get("/games/leaderboard", async (_req, res) => {
  try {
    const users = await User.find({ status: "active", totalBets: { $gt: 0 } })
      .select("username totalWinnings totalDeposits totalBets")
      .sort({ totalWinnings: -1 })
      .limit(10)
      .lean();
    return res.json({ success: true, users });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== LIVE CRICKET MATCHES ====================
router.get("/cricket/live", async (_req, res) => {
  try {
    const matches = await CricketMatch.find({ status: { $in: ["live", "upcoming"] }, isActive: true })
      .sort({ matchDate: 1 })
      .lean();
    return res.json({ success: true, matches });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== ACTIVE PAYMENT METHODS ====================
router.get("/payment-methods", async (_req, res) => {
  try {
    const methods = await PaymentMethod.find({ isActive: true })
      .select("name slug type icon minAmount maxAmount processingTime fee")
      .sort({ sortOrder: 1 })
      .lean();
    return res.json({ success: true, methods });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PUBLIC SETTINGS ====================
router.get("/settings/:key", async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key }).lean();
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    return res.json({ success: true, key: setting.key, value: setting.value });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== NOTIFICATIONS (for user) ====================
router.get("/notifications", authToken, activeUser, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

    const filter = {
      $or: [
        { target: "all" },
        { target: "user", targetUser: req.user.sub },
      ],
    };

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);

    return res.json({ success: true, notifications, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { router, signupHandler };
