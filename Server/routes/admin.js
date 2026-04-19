const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Bet = require("../models/Bet");
const Game = require("../models/Game");
const Notification = require("../models/Notification");
const PaymentMethod = require("../models/PaymentMethod");
const Setting = require("../models/Setting");
const Banner = require("../models/Banner");

// --------------- Multer Upload Config ---------------
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

const ALLOWED_TYPES = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only PNG, SVG, JPEG, and WebP images are allowed"));
  },
});
const CricketMatch = require("../models/CricketMatch");
const ActivityLog = require("../models/ActivityLog");
const Marquee = require("../models/Marquee");
const BlockReport = require("../models/BlockReport");
const HelpRequest = require("../models/HelpRequest");
const Promotion = require("../models/Promotion");
const Referral = require("../models/Referral");
const HallOfGlory = require("../models/HallOfGlory");
const News = require("../models/News");
const ChatMessage = require("../models/ChatMessage");
const { authToken, adminOnly, logActivity } = require("../middleware/auth");

const ApiLog = require("../models/ApiLog");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// ==================== AUTH ====================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ username: ADMIN_USERNAME, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    await ActivityLog.create({ action: "admin_login", category: "auth", ip: req.ip });
    return res.json({ success: true, token, user: { username: ADMIN_USERNAME, role: "admin" } });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify", authToken, adminOnly, (_req, res) => {
  return res.json({ valid: true });
});

// ==================== DASHBOARD STATS ====================

router.get("/dashboard/stats", authToken, adminOnly, async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todayUsers,
      todayDeposits,
      todayWithdrawals,
      totalDepositsAll,
      totalWithdrawalsAll,
      pendingWithdrawals,
      activeBets,
      totalGames,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", createdAt: { $gte: today } }),
      Transaction.aggregate([
        { $match: { type: "deposit", status: "success", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "withdraw", status: "success", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "deposit", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "withdraw", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.countDocuments({ type: "withdraw", status: "pending" }),
      Bet.countDocuments({ result: "pending" }),
      Game.countDocuments({ isActive: true }),
    ]);

    const todayDepositTotal = todayDeposits[0]?.total || 0;
    const todayWithdrawTotal = todayWithdrawals[0]?.total || 0;
    const allDeposits = totalDepositsAll[0]?.total || 0;
    const allWithdrawals = totalWithdrawalsAll[0]?.total || 0;

    return res.json({
      success: true,
      stats: {
        totalUsers,
        todayNewUsers: todayUsers,
        todayDeposits: todayDepositTotal,
        todayWithdrawals: todayWithdrawTotal,
        totalDeposits: allDeposits,
        totalWithdrawals: allWithdrawals,
        totalProfit: allDeposits - allWithdrawals,
        pendingWithdrawals,
        activeBets,
        activeGames: totalGames,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== USERS MANAGEMENT ====================

router.get("/users", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const search = (req.query.search || "").trim();
    const status = req.query.status || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = { role: "user" };
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:id", authToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const [bets, transactions] = await Promise.all([
      Bet.find({ user: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
      Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    return res.json({ success: true, user, recentBets: bets, recentTransactions: transactions });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/status", authToken, adminOnly, logActivity("update_user_status", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended", "banned"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Update user status error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/balance", authToken, adminOnly, logActivity("update_user_balance", "admin"), async (req, res) => {
  try {
    const { amount, type, note } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return res.status(400).json({ error: "Valid amount required" });
    if (!["add", "subtract"].includes(type)) return res.status(400).json({ error: "Type must be add or subtract" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === "subtract" && user.balance < numAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.balance = type === "add" ? user.balance + numAmount : user.balance - numAmount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: type === "add" ? "deposit" : "withdraw",
      amount: numAmount,
      status: "success",
      note: note || `Admin ${type} balance`,
      processedBy: null,
      processedAt: new Date(),
    });

    return res.json({ success: true, balance: user.balance });
  } catch (err) {
    console.error("Update balance error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Edit user profile
router.put("/users/:id", authToken, adminOnly, logActivity("edit_user", "admin"), async (req, res) => {
  try {
    const allowed = ["email", "username", "status", "profileImage", "dateOfBirth", "address", "city", "country"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Edit user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
router.delete("/users/:id", authToken, adminOnly, logActivity("delete_user", "admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create user by admin
router.post("/users", authToken, adminOnly, logActivity("create_user", "admin"), async (req, res) => {
  try {
    const { mobile, email, username, password } = req.body;
    if (!mobile || !username || !password) return res.status(400).json({ error: "Mobile, username, password required" });
    const bcryptLib = require("bcryptjs");
    const hashed = await bcryptLib.hash(password, 12);
    const code = username.toUpperCase().slice(0, 4) + Math.random().toString(36).substring(2, 6).toUpperCase();
    const user = await User.create({
      mobile: mobile.replace(/\D/g, ""),
      email: email || null,
      username: username.toLowerCase(),
      password: hashed,
      myReferralCode: code,
    });
    return res.status(201).json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    if (err.code === 11000) {
      const dup = Object.keys(err.keyPattern || {})[0];
      return res.status(409).json({ error: `${dup} already in use` });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get user transaction history
router.get("/users/:id/transactions", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const [transactions, total] = await Promise.all([
      Transaction.find({ user: req.params.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Transaction.countDocuments({ user: req.params.id }),
    ]);
    return res.json({ success: true, transactions, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Edit user profile
router.put("/users/:id", authToken, adminOnly, logActivity("edit_user", "admin"), async (req, res) => {
  try {
    const allowed = ["email", "username", "status", "profileImage", "dateOfBirth", "address", "city", "country"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Edit user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
router.delete("/users/:id", authToken, adminOnly, logActivity("delete_user", "admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create user by admin
router.post("/users", authToken, adminOnly, logActivity("create_user", "admin"), async (req, res) => {
  try {
    const { mobile, email, username, password } = req.body;
    if (!mobile || !username || !password) return res.status(400).json({ error: "Mobile, username, password required" });
    const bcryptLib = require("bcryptjs");
    const hashed = await bcryptLib.hash(password, 12);
    const code = username.toUpperCase().slice(0, 4) + Math.random().toString(36).substring(2, 6).toUpperCase();
    const user = await User.create({
      mobile: mobile.replace(/\D/g, ""),
      email: email || null,
      username: username.toLowerCase(),
      password: hashed,
      myReferralCode: code,
    });
    return res.status(201).json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    if (err.code === 11000) {
      const dup = Object.keys(err.keyPattern || {})[0];
      return res.status(409).json({ error: `${dup} already in use` });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get user transaction history
router.get("/users/:id/transactions", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const [transactions, total] = await Promise.all([
      Transaction.find({ user: req.params.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Transaction.countDocuments({ user: req.params.id }),
    ]);
    return res.json({ success: true, transactions, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== TRANSACTIONS ====================

router.get("/transactions", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const type = req.query.type || "";
    const status = req.query.status || "";

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("user", "username mobile")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    return res.json({ success: true, transactions, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/transactions/:id/status", authToken, adminOnly, logActivity("update_transaction", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["success", "failed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ error: "Transaction not found" });
    if (txn.status !== "pending") return res.status(400).json({ error: "Only pending transactions can be updated" });

    txn.status = status;
    txn.processedAt = new Date();
    await txn.save();

    // If withdraw approved, deduct balance
    if (txn.type === "withdraw" && status === "success") {
      await User.findByIdAndUpdate(txn.user, { $inc: { balance: -txn.amount, totalWithdrawals: txn.amount } });
    }
    // If deposit approved, add balance
    if (txn.type === "deposit" && status === "success") {
      await User.findByIdAndUpdate(txn.user, { $inc: { balance: txn.amount, totalDeposits: txn.amount } });
    }

    return res.json({ success: true, transaction: txn });
  } catch (err) {
    console.error("Update transaction error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== GAMES MANAGEMENT ====================

router.get("/games", authToken, adminOnly, async (req, res) => {
  try {
    const games = await Game.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.json({ success: true, games });
  } catch (err) {
    console.error("Get games error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/games", authToken, adminOnly, logActivity("create_game", "game"), async (req, res) => {
  try {
    const { name, category, description, image, badge, badgeColor, minBet, maxBet, houseEdge, volatility, rtp, isFeatured } = req.body;
    if (!name || !category) return res.status(400).json({ error: "Name and category are required" });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = await Game.findOne({ slug });
    if (existing) return res.status(409).json({ error: "Game with similar name already exists" });

    const game = await Game.create({
      name, slug, category, description, image, badge, badgeColor,
      minBet, maxBet, houseEdge, volatility, rtp, isFeatured,
    });

    return res.status(201).json({ success: true, game });
  } catch (err) {
    console.error("Create game error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/games/:id", authToken, adminOnly, logActivity("update_game", "game"), async (req, res) => {
  try {
    const allowed = ["name", "category", "description", "image", "badge", "badgeColor",
      "isActive", "isFeatured", "minBet", "maxBet", "houseEdge", "winProbability", "autoPayout", "volatility", "rtp", "sortOrder"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const game = await Game.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!game) return res.status(404).json({ error: "Game not found" });
    return res.json({ success: true, game });
  } catch (err) {
    console.error("Update game error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/games/:id", authToken, adminOnly, logActivity("delete_game", "game"), async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    return res.json({ success: true, message: "Game deleted" });
  } catch (err) {
    console.error("Delete game error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== NOTIFICATIONS ====================

router.get("/notifications", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const filter = { target: { $in: ["all", "admin"] } };

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);

    return res.json({ success: true, notifications, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get notifications error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications", authToken, adminOnly, logActivity("create_notification", "admin"), async (req, res) => {
  try {
    const { title, message, type, target, targetUser } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

    const notification = await Notification.create({ title, message, type, target, targetUser });
    return res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error("Create notification error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notifications/:id", authToken, adminOnly, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PAYMENT METHODS ====================

router.get("/payment-methods", authToken, adminOnly, async (_req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ sortOrder: 1 }).lean();
    return res.json({ success: true, methods });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/payment-methods", authToken, adminOnly, logActivity("create_payment_method", "admin"), async (req, res) => {
  try {
    const { name, type, icon, minAmount, maxAmount, processingTime, fee, instructions } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Name and type are required" });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const method = await PaymentMethod.create({ name, slug, type, icon, minAmount, maxAmount, processingTime, fee, instructions });
    return res.status(201).json({ success: true, method });
  } catch (err) {
    console.error("Create payment method error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/payment-methods/:id", authToken, adminOnly, async (req, res) => {
  try {
    const allowed = ["name", "type", "icon", "isActive", "minAmount", "maxAmount", "processingTime", "fee", "instructions", "sortOrder"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const method = await PaymentMethod.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!method) return res.status(404).json({ error: "Payment method not found" });
    return res.json({ success: true, method });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/payment-methods/:id", authToken, adminOnly, async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Payment method deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== FILE UPLOAD ====================

router.post("/upload", authToken, adminOnly, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File too large (max 5 MB)" : err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { field } = req.body; // "about_logo" or "about_banner"
    if (!field) {
      return res.status(400).json({ error: "field name is required" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    try {
      // Remove old file if setting exists
      const existing = await Setting.findOne({ key: field });
      if (existing && existing.value) {
        const oldPath = path.join(__dirname, "..", existing.value);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Save URL to settings
      await Setting.findOneAndUpdate(
        { key: field },
        { value: fileUrl, category: "about", description: field.replace("about_", "").replace(/_/g, " ") },
        { upsert: true, new: true }
      );

      return res.json({ success: true, url: fileUrl });
    } catch (error) {
      console.error("Upload setting save error:", error);
      return res.status(500).json({ error: "Failed to save upload" });
    }
  });
});

// ==================== SETTINGS ====================

router.get("/settings", authToken, adminOnly, async (req, res) => {
  try {
    const category = req.query.category || "";
    const filter = category ? { category } : {};
    const settings = await Setting.find(filter).sort({ category: 1, key: 1 }).lean();
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", authToken, adminOnly, logActivity("update_settings", "admin"), async (req, res) => {
  try {
    const { key, value, category, description } = req.body;
    if (!key) return res.status(400).json({ error: "Key is required" });

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, category: category || "general", description: description || "" },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ success: true, setting });
  } catch (err) {
    console.error("PUT /settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings/bulk", authToken, adminOnly, logActivity("update_settings_bulk", "admin"), async (req, res) => {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({ error: "Settings array is required" });
    }
    const ops = settings.map((s) => ({
      updateOne: {
        filter: { key: s.key },
        update: { $set: { value: s.value, category: s.category || "general", description: s.description || "" } },
        upsert: true,
      },
    }));
    await Setting.bulkWrite(ops);
    const keys = settings.map((s) => s.key);
    const updated = await Setting.find({ key: { $in: keys } }).lean();
    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error("PUT /settings/bulk error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== CRICKET MATCHES ====================

router.get("/cricket", authToken, adminOnly, async (req, res) => {
  try {
    const status = req.query.status || "";
    const filter = status ? { status } : {};
    const matches = await CricketMatch.find(filter).sort({ matchDate: -1 }).lean();
    return res.json({ success: true, matches });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cricket", authToken, adminOnly, logActivity("create_match", "game"), async (req, res) => {
  try {
    const { title, team1, team2, league, matchDate, venue, odds } = req.body;
    if (!title || !team1 || !team2 || !matchDate) {
      return res.status(400).json({ error: "Title, teams, and match date are required" });
    }
    const match = await CricketMatch.create({ title, team1, team2, league, matchDate, venue, odds });
    return res.status(201).json({ success: true, match });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cricket/:id", authToken, adminOnly, async (req, res) => {
  try {
    const allowed = ["title", "team1", "team2", "league", "matchType", "matchDate", "venue", "status",
      "score1", "score2", "overs", "result", "odds", "isActive"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const match = await CricketMatch.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!match) return res.status(404).json({ error: "Match not found" });
    return res.json({ success: true, match });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cricket/:id", authToken, adminOnly, async (req, res) => {
  try {
    await CricketMatch.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Match deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== ACTIVITY LOGS ====================

router.get("/activity-logs", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
    const category = req.query.category || "";
    const filter = category ? { category } : {};

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ActivityLog.countDocuments(filter),
    ]);

    return res.json({ success: true, logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BETS MANAGEMENT ====================

router.get("/bets", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const result = req.query.result || "";
    const filter = result ? { result } : {};

    const [bets, total] = await Promise.all([
      Bet.find(filter)
        .populate("user", "username mobile")
        .populate("game", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Bet.countDocuments(filter),
    ]);

    return res.json({ success: true, bets, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/bets/:id/settle", authToken, adminOnly, logActivity("settle_bet", "game"), async (req, res) => {
  try {
    const { result } = req.body;
    if (!["won", "lost", "void"].includes(result)) {
      return res.status(400).json({ error: "Result must be won, lost, or void" });
    }

    const bet = await Bet.findById(req.params.id);
    if (!bet) return res.status(404).json({ error: "Bet not found" });
    if (bet.result !== "pending") return res.status(400).json({ error: "Bet already settled" });

    bet.result = result;
    bet.settledAt = new Date();

    if (result === "won") {
      bet.payout = bet.potentialWin;
      await User.findByIdAndUpdate(bet.user, { $inc: { balance: bet.payout, totalWins: 1 } });
    } else if (result === "void") {
      bet.payout = bet.stake;
      await User.findByIdAndUpdate(bet.user, { $inc: { balance: bet.stake } });
    }

    await bet.save();
    return res.json({ success: true, bet });
  } catch (err) {
    console.error("Settle bet error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== API LOGS ====================

router.get("/api-logs", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));
    const method = req.query.method || "";
    const status = req.query.status || "";
    const search = (req.query.search || "").trim();

    const filter = {};
    if (method) filter.method = method;
    if (status === "success") filter.statusCode = { $lt: 400 };
    if (status === "error") filter.statusCode = { $gte: 400 };
    if (search) filter.path = { $regex: search, $options: "i" };

    const [logs, total] = await Promise.all([
      ApiLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ApiLog.countDocuments(filter),
    ]);

    return res.json({ success: true, logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get API logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api-logs/export", authToken, adminOnly, async (req, res) => {
  try {
    const method = req.query.method || "";
    const status = req.query.status || "";
    const search = (req.query.search || "").trim();
    const days = Math.min(90, Math.max(1, parseInt(req.query.days) || 7));

    const filter = { createdAt: { $gte: new Date(Date.now() - days * 86400000) } };
    if (method) filter.method = method;
    if (status === "success") filter.statusCode = { $lt: 400 };
    if (status === "error") filter.statusCode = { $gte: 400 };
    if (search) filter.path = { $regex: search, $options: "i" };

    const logs = await ApiLog.find(filter).sort({ createdAt: -1 }).limit(5000).lean();

    // Build CSV (Excel-compatible)
    const header = "Timestamp,Method,Path,Status Code,Response Time (ms),IP,User,Error\n";
    const rows = logs.map(l => {
      const ts = new Date(l.createdAt).toISOString();
      const escapedPath = `"${(l.path || "").replace(/"/g, '""')}"`;
      const escapedError = `"${(l.error || "").replace(/"/g, '""')}"`;
      const escapedUser = `"${(l.user || "").replace(/"/g, '""')}"`;
      return `${ts},${l.method},${escapedPath},${l.statusCode},${l.responseTime},${l.ip || ""},${escapedUser},${escapedError}`;
    }).join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="api-logs-${new Date().toISOString().slice(0,10)}.csv"`);
    return res.send("\uFEFF" + header + rows);
  } catch (err) {
    console.error("Export API logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/api-logs", authToken, adminOnly, logActivity("clear_api_logs", "admin"), async (req, res) => {
  try {
    const days = Math.max(1, parseInt(req.query.olderThanDays) || 30);
    const result = await ApiLog.deleteMany({ createdAt: { $lt: new Date(Date.now() - days * 86400000) } });
    return res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== MARQUEE WINNERS ====================

router.get("/marquee", authToken, adminOnly, async (_req, res) => {
  try {
    const items = await Marquee.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/marquee", authToken, adminOnly, logActivity("create_marquee", "admin"), async (req, res) => {
  try {
    const { label, username, amount, highlighted } = req.body;
    if (!username || !amount) return res.status(400).json({ error: "Username and amount are required" });
    const item = await Marquee.create({ label: label || "WINNER:", username, amount, highlighted });
    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/marquee/:id", authToken, adminOnly, logActivity("update_marquee", "admin"), async (req, res) => {
  try {
    const allowed = ["label", "username", "amount", "highlighted", "isActive", "sortOrder"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const item = await Marquee.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ error: "Marquee item not found" });
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/marquee/:id", authToken, adminOnly, logActivity("delete_marquee", "admin"), async (req, res) => {
  try {
    await Marquee.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Marquee item deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BLOCK/REPORT MANAGEMENT ====================

router.get("/reports", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const status = req.query.status || "";
    const type = req.query.type || "";
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [reports, total] = await Promise.all([
      BlockReport.find(filter)
        .populate("reporter", "username mobile")
        .populate("reported", "username mobile status reportCount")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlockReport.countDocuments(filter),
    ]);
    return res.json({ success: true, reports, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/reports/:id", authToken, adminOnly, logActivity("update_report", "admin"), async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!["reviewed", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const report = await BlockReport.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || "", resolvedBy: "admin", resolvedAt: new Date() },
      { new: true }
    ).populate("reporter", "username").populate("reported", "username");
    if (!report) return res.status(404).json({ error: "Report not found" });
    return res.json({ success: true, report });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== HELP REQUESTS ====================

router.get("/help-requests", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const status = req.query.status || "";
    const filter = {};
    if (status) filter.status = status;

    const [requests, total] = await Promise.all([
      HelpRequest.find(filter)
        .populate("user", "username mobile email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      HelpRequest.countDocuments(filter),
    ]);
    return res.json({ success: true, requests, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/help-requests/:id", authToken, adminOnly, logActivity("reply_help_request", "admin"), async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminReply) {
      updates.adminReply = adminReply;
      updates.repliedBy = "admin";
      updates.repliedAt = new Date();
    }
    const request = await HelpRequest.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("user", "username mobile email");
    if (!request) return res.status(404).json({ error: "Help request not found" });
    return res.json({ success: true, request });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/help-requests/:id", authToken, adminOnly, async (req, res) => {
  try {
    await HelpRequest.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Help request deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== PROMOTIONS ====================

router.post("/promotions/upload-image", authToken, adminOnly, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File too large (max 5 MB)" : err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    return res.json({ success: true, url: `/uploads/${req.file.filename}` });
  });
});

router.get("/promotions", authToken, adminOnly, async (_req, res) => {
  try {
    const promotions = await Promotion.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return res.json({ success: true, promotions });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/promotions", authToken, adminOnly, logActivity("create_promotion", "admin"), async (req, res) => {
  try {
    const { title, description, image, brandName, link, type, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const promo = await Promotion.create({ title, description, image, brandName, link, type, startDate, endDate });
    return res.status(201).json({ success: true, promotion: promo });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/promotions/:id", authToken, adminOnly, logActivity("update_promotion", "admin"), async (req, res) => {
  try {
    const allowed = ["title", "description", "image", "brandName", "link", "type", "startDate", "endDate", "isActive", "sortOrder"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const promo = await Promotion.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!promo) return res.status(404).json({ error: "Promotion not found" });
    return res.json({ success: true, promotion: promo });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/promotions/:id", authToken, adminOnly, logActivity("delete_promotion", "admin"), async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Promotion deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== HALL OF GLORY ====================

router.get("/hall-of-glory", authToken, adminOnly, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const entries = await HallOfGlory.find({ date }).populate("user", "username").sort({ rank: 1 }).lean();
    return res.json({ success: true, entries });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/hall-of-glory/generate", authToken, adminOnly, logActivity("generate_hall_of_glory", "admin"), async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    // Delete existing entries for today
    await HallOfGlory.deleteMany({ date: today, isManual: false });

    // Get top 3 users by profit (totalWinnings - totalDeposits or totalWinnings)
    const topUsers = await User.find({ role: "user", totalWinnings: { $gt: 0 } })
      .select("username totalWinnings")
      .sort({ totalWinnings: -1 })
      .limit(3)
      .lean();

    const entries = topUsers.map((u, i) => ({
      user: u._id,
      username: u.username,
      totalPayout: u.totalWinnings,
      rank: i + 1,
      date: today,
      isManual: false,
    }));

    if (entries.length > 0) {
      await HallOfGlory.insertMany(entries);
    }

    const saved = await HallOfGlory.find({ date: today }).sort({ rank: 1 }).lean();
    return res.json({ success: true, entries: saved });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/hall-of-glory/:id", authToken, adminOnly, logActivity("update_hall_of_glory", "admin"), async (req, res) => {
  try {
    const { username, totalPayout, rank } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (totalPayout !== undefined) updates.totalPayout = totalPayout;
    if (rank !== undefined) updates.rank = rank;
    updates.isManual = true;

    const entry = await HallOfGlory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    return res.json({ success: true, entry });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/hall-of-glory", authToken, adminOnly, logActivity("create_hall_of_glory", "admin"), async (req, res) => {
  try {
    const { username, totalPayout, rank, date } = req.body;
    if (!username || !totalPayout || !rank) return res.status(400).json({ error: "Username, totalPayout, rank required" });
    const entry = await HallOfGlory.create({
      username, totalPayout, rank,
      date: date || new Date().toISOString().slice(0, 10),
      isManual: true,
    });
    return res.status(201).json({ success: true, entry });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== REFERRAL MANAGEMENT ====================

router.get("/referrals", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const [referrals, total] = await Promise.all([
      Referral.find()
        .populate("referrer", "username mobile myReferralCode")
        .populate("referred", "username mobile")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Referral.countDocuments(),
    ]);
    return res.json({ success: true, referrals, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== NEWS MANAGEMENT ====================

router.get("/news", authToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
    const [news, total] = await Promise.all([
      News.find(filter).sort({ isPinned: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      News.countDocuments(filter),
    ]);
    return res.json({ success: true, news, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/news", authToken, adminOnly, logActivity("create_news", "admin"), async (req, res) => {
  try {
    const { title, content, category, isActive, isPinned } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });
    const item = await News.create({ title, content, category, isActive, isPinned });
    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/news/:id", authToken, adminOnly, logActivity("update_news", "admin"), async (req, res) => {
  try {
    const { title, content, category, isActive, isPinned } = req.body;
    const item = await News.findByIdAndUpdate(req.params.id, { title, content, category, isActive, isPinned }, { new: true });
    if (!item) return res.status(404).json({ error: "News item not found" });
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/news/:id", authToken, adminOnly, logActivity("delete_news", "admin"), async (req, res) => {
  try {
    const item = await News.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "News item not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== LIVE CHAT ====================

// Get all conversations (list of users who have chatted)
router.get("/chat/conversations", authToken, adminOnly, async (req, res) => {
  try {
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          lastMessage: { $first: "$message" },
          lastSender: { $first: "$sender" },
          lastTime: { $first: "$createdAt" },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ["$sender", "user"] }, { $eq: ["$read", false] }] }, 1, 0] },
          },
          totalMessages: { $sum: 1 },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    const userIds = conversations.map((c) => c._id);
    const User = require("../models/User");
    const users = await User.find({ _id: { $in: userIds } }).select("username mobile email status").lean();
    const userMap = {};
    users.forEach((u) => { userMap[u._id.toString()] = u; });

    const result = conversations.map((c) => ({
      userId: c._id,
      user: userMap[c._id.toString()] || { username: "Deleted User" },
      lastMessage: c.lastMessage,
      lastSender: c.lastSender,
      lastTime: c.lastTime,
      unreadCount: c.unreadCount,
      totalMessages: c.totalMessages,
    }));

    return res.json({ success: true, conversations: result });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get chat messages for a specific user
router.get("/chat/:userId", authToken, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Mark user messages as read
    await ChatMessage.updateMany(
      { userId, sender: "user", read: false },
      { $set: { read: true } }
    );

    const User = require("../models/User");
    const user = await User.findById(userId).select("username mobile email status").lean();

    const total = await ChatMessage.countDocuments({ userId });

    return res.json({ success: true, messages, user, total, page, limit });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin sends a message to a user
router.post("/chat/:userId", authToken, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const msg = await ChatMessage.create({
      userId,
      sender: "admin",
      message: message.trim(),
      read: false,
    });

    return res.json({ success: true, message: msg });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get total unread chat count
router.get("/chat-unread-count", authToken, adminOnly, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({ sender: "user", read: false });
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== BANNERS ====================
router.get("/banners", authToken, adminOnly, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, banners });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/banners", authToken, adminOnly, async (req, res) => {
  try {
    const { title, imageUrl, link, isActive, order } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ error: "Title and image URL are required" });
    const banner = await Banner.create({ title, imageUrl, link, isActive, order });
    return res.json({ success: true, banner });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/banners/:id", authToken, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    return res.json({ success: true, banner });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/banners/:id", authToken, adminOnly, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
