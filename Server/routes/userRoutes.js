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
const BlockReport = require("../models/BlockReport");
const HelpRequest = require("../models/HelpRequest");
const Promotion = require("../models/Promotion");
const Referral = require("../models/Referral");
const Marquee = require("../models/Marquee");
const HallOfGlory = require("../models/HallOfGlory");
const ChatMessage = require("../models/ChatMessage");
const Banner = require("../models/Banner");
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
    currency: user.currency || "BDT",
    referralCode: user.referralCode,
    myReferralCode: user.myReferralCode,
    status: user.status,
    lastLogin: user.lastLogin,
    loginCount: user.loginCount || 0,
    totalDeposits: user.totalDeposits || 0,
    totalWithdrawals: user.totalWithdrawals || 0,
    totalBets: user.totalBets || 0,
    totalWinnings: user.totalWinnings || 0,
    totalWins: user.totalWins || 0,
    totalLosses: user.totalLosses || 0,
    totalReferrals: user.totalReferrals || 0,
    referralEarnings: user.referralEarnings || 0,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    city: user.city,
    country: user.country,
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

    // Generate unique referral code for this user
    const myRefCode = normalizedUsername.toUpperCase().slice(0, 4) + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Check if referralCode belongs to an existing user
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ myReferralCode: referralCode.toUpperCase() });
    }

    const user = await User.create({
      mobile: normalizedMobile,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      referralCode: referralCode ? String(referralCode).trim().toUpperCase() : null,
      myReferralCode: myRefCode,
      referredBy: referredByUser ? referredByUser._id : null,
    });

    // Process referral reward
    if (referredByUser) {
      const rewardAmount = 50; // BDT reward
      await Referral.create({
        referrer: referredByUser._id,
        referred: user._id,
        referralCode: referralCode.toUpperCase(),
        rewardAmount,
      });
      // Award bonus to referrer
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { balance: rewardAmount, totalReferrals: 1, referralEarnings: rewardAmount },
      });
    }

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
    const { email, dateOfBirth, address, city, country } = req.body;
    const updates = {};
    if (email !== undefined) {
      const normalized = email ? String(email).trim().toLowerCase() : null;
      if (normalized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return res.status(400).json({ error: "Invalid email" });
      }
      updates.email = normalized;
    }
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (address !== undefined) updates.address = String(address || "").trim().substring(0, 200);
    if (city !== undefined) updates.city = String(city || "").trim().substring(0, 50);
    if (country !== undefined) updates.country = String(country || "").trim().substring(0, 50);
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
    const user = await User.findById(req.user.sub).select("balance totalDeposits totalWithdrawals totalBets totalWinnings totalWins totalLosses currency").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const recentTxns = await Transaction.find({ user: req.user.sub })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const pendingCount = await Transaction.countDocuments({ user: req.user.sub, status: "pending" });

    return res.json({
      success: true,
      balance: user.balance,
      currency: user.currency || "BDT",
      totalDeposits: user.totalDeposits || 0,
      totalWithdrawals: user.totalWithdrawals || 0,
      totalBets: user.totalBets || 0,
      totalWinnings: user.totalWinnings || 0,
      totalWins: user.totalWins || 0,
      totalLosses: user.totalLosses || 0,
      pendingCount,
      transactions: recentTxns,
    });
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

// ==================== MARQUEE WINNERS (public) ====================
router.get("/marquee", async (_req, res) => {
  try {
    const items = await Marquee.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.json({ success: true, items });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BLOCK/REPORT USER ====================
router.post("/block", authToken, activeUser, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (userId === req.user.sub) return res.status(400).json({ error: "Cannot block yourself" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // Check if already blocked
    const existing = await BlockReport.findOne({ reporter: req.user.sub, reported: userId, type: "block" });
    if (existing) return res.status(409).json({ error: "User already blocked" });

    await BlockReport.create({ reporter: req.user.sub, reported: userId, type: "block", reason, status: "resolved" });
    await User.findByIdAndUpdate(req.user.sub, { $addToSet: { blockedUsers: userId } });

    return res.json({ success: true, message: "User blocked" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/unblock", authToken, activeUser, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    await BlockReport.deleteMany({ reporter: req.user.sub, reported: userId, type: "block" });
    await User.findByIdAndUpdate(req.user.sub, { $pull: { blockedUsers: userId } });

    return res.json({ success: true, message: "User unblocked" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/report", authToken, activeUser, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason) return res.status(400).json({ error: "User ID and reason are required" });
    if (userId === req.user.sub) return res.status(400).json({ error: "Cannot report yourself" });

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    await BlockReport.create({ reporter: req.user.sub, reported: userId, type: "report", reason });
    await User.findByIdAndUpdate(userId, { $inc: { reportCount: 1 } });

    return res.json({ success: true, message: "User reported successfully" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blocked-users", authToken, activeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).populate("blockedUsers", "username mobile").lean();
    return res.json({ success: true, blockedUsers: user?.blockedUsers || [] });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== HELP CENTER ====================
router.post("/help", authToken, activeUser, async (req, res) => {
  try {
    const { subject, message, category } = req.body;
    if (!subject || !message) return res.status(400).json({ error: "Subject and message are required" });

    const helpReq = await HelpRequest.create({
      user: req.user.sub,
      subject,
      message,
      category: category || "other",
    });
    return res.status(201).json({ success: true, request: helpReq });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/help", authToken, activeUser, async (req, res) => {
  try {
    const requests = await HelpRequest.find({ user: req.user.sub }).sort({ createdAt: -1 }).limit(20).lean();
    return res.json({ success: true, requests });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== LIVE SUPPORT FAQ ====================
router.get("/support/faq", async (_req, res) => {
  const faqs = [
    { id: 1, question: "How do I deposit money?", answer: "Go to Wallet > Deposit, select payment method, enter amount and follow instructions." },
    { id: 2, question: "How do I withdraw my winnings?", answer: "Go to Wallet > Withdraw, enter amount and payment details. Withdrawals are processed within 24 hours." },
    { id: 3, question: "What is the minimum deposit?", answer: "The minimum deposit is ৳100." },
    { id: 4, question: "How do I change my password?", answer: "Go to Account > Settings > Change Password." },
    { id: 5, question: "How does the referral program work?", answer: "Share your referral code with friends. When they sign up using your code, both of you get ৳50 bonus!" },
    { id: 6, question: "My bet was not settled correctly", answer: "Please contact our support team through Help Center with your bet ID and we will investigate." },
    { id: 7, question: "How do I verify my account?", answer: "Go to Account > Verification and upload your ID documents." },
    { id: 8, question: "What payment methods are available?", answer: "We support bKash, Nagad, Rocket, and bank transfer." },
    { id: 9, question: "I forgot my password", answer: "Use the 'Forgot Password' option on the login page or contact support." },
    { id: 10, question: "How do I block another user?", answer: "Go to the user's profile and tap the block button, or go to Account > Blocked Users." },
  ];
  return res.json({ success: true, faqs });
});

// ==================== PROMOTIONS (public) ====================
router.get("/promotions", async (_req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      $or: [
        { endDate: { $gte: now } },
        { endDate: null },
      ],
    }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.json({ success: true, promotions });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Promotion request from brand
router.post("/promotions/request", async (req, res) => {
  try {
    const { brandName, title, description, contactEmail, link } = req.body;
    if (!brandName || !title || !contactEmail) {
      return res.status(400).json({ error: "Brand name, title, and contact email are required" });
    }
    const promo = await Promotion.create({
      title,
      description: description || "",
      brandName,
      link: link || "",
      isActive: false, // needs admin approval
      type: "promotion",
    });
    return res.status(201).json({ success: true, promotion: promo, message: "Promotion request submitted for review" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== REFERRAL ====================
router.get("/referral", authToken, activeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("myReferralCode totalReferrals referralEarnings").lean();
    const referrals = await Referral.find({ referrer: req.user.sub })
      .populate("referred", "username createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      success: true,
      referralCode: user?.myReferralCode || "",
      totalReferrals: user?.totalReferrals || 0,
      referralEarnings: user?.referralEarnings || 0,
      referrals,
    });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== HALL OF GLORY (public) ====================
router.get("/hall-of-glory", async (_req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    let entries = await HallOfGlory.find({ date: today }).sort({ rank: 1 }).limit(3).lean();

    // Fallback to latest available date
    if (entries.length === 0) {
      const latest = await HallOfGlory.findOne().sort({ date: -1 }).lean();
      if (latest) {
        entries = await HallOfGlory.find({ date: latest.date }).sort({ rank: 1 }).limit(3).lean();
      }
    }

    // If still no entries, get from user data
    if (entries.length === 0) {
      const topUsers = await User.find({ role: "user", totalWinnings: { $gt: 0 } })
        .select("username totalWinnings")
        .sort({ totalWinnings: -1 })
        .limit(3)
        .lean();
      entries = topUsers.map((u, i) => ({
        username: u.username,
        totalPayout: u.totalWinnings,
        rank: i + 1,
        date: today,
      }));
    }

    return res.json({ success: true, entries });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PUBLIC POLICIES ====================
router.get("/policies", async (_req, res) => {
  try {
    const Setting = require("../models/Setting");
    const settings = await Setting.find({ category: "policy" }).lean();
    const policies = {};
    for (const s of settings) {
      policies[s.key] = { content: s.value, updatedAt: s.updatedAt, description: s.description };
    }
    return res.json({ success: true, policies });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PUBLIC ABOUT ====================
router.get("/about", async (_req, res) => {
  try {
    const Setting = require("../models/Setting");
    const settings = await Setting.find({ category: "about" }).lean();
    const about = {};
    for (const s of settings) {
      about[s.key] = { content: s.value, updatedAt: s.updatedAt, description: s.description };
    }
    return res.json({ success: true, about });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PUBLIC NEWS ====================
router.get("/news", async (_req, res) => {
  try {
    const News = require("../models/News");
    const news = await News.find({ isActive: true }).sort({ isPinned: -1, createdAt: -1 }).limit(50).lean();
    return res.json({ success: true, news });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== LIVE CHAT ====================

// Get my chat messages
router.get("/chat", authToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    // Mark admin messages as read
    await ChatMessage.updateMany(
      { userId, sender: "admin", read: false },
      { $set: { read: true } }
    );

    return res.json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// User sends a message
router.post("/chat", authToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: "Message too long" });
    }

    const msg = await ChatMessage.create({
      userId,
      sender: "user",
      message: message.trim(),
      read: false,
    });

    return res.json({ success: true, message: msg });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get unread count for user
router.get("/chat/unread", authToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const count = await ChatMessage.countDocuments({ userId, sender: "admin", read: false });
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BANNERS (PUBLIC) ====================
router.get("/banners", async (_req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, banners });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== SPONSORS (PUBLIC) ====================
router.get("/sponsors", async (_req, res) => {
  try {
    const Sponsor = require("../models/Sponsor");
    const sponsors = await Sponsor.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, sponsors });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BRAND AMBASSADORS (PUBLIC) ====================
router.get("/ambassadors", async (_req, res) => {
  try {
    const Ambassador = require("../models/Ambassador");
    const ambassadors = await Ambassador.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, ambassadors });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { router, signupHandler };
