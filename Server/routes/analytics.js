const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Bet = require("../models/Bet");
const Game = require("../models/Game");
const ActivityLog = require("../models/ActivityLog");
const { authToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Helper: get start of day N days ago
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper: get start of month N months ago
function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ==================== 1. OVERVIEW ANALYTICS ====================
router.get("/overview", authToken, adminOnly, async (_req, res) => {
  try {
    const today = daysAgo(0);
    const weekAgo = daysAgo(7);
    const monthAgo = daysAgo(30);

    const [
      totalUsers,
      weekNewUsers,
      monthNewUsers,
      totalDeposits,
      totalWithdrawals,
      weekDeposits,
      weekWithdrawals,
      totalBetsCount,
      weekBetsCount,
      activeBets,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", createdAt: { $gte: weekAgo } }),
      User.countDocuments({ role: "user", createdAt: { $gte: monthAgo } }),
      Transaction.aggregate([{ $match: { type: "deposit", status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Transaction.aggregate([{ $match: { type: "withdraw", status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Transaction.aggregate([{ $match: { type: "deposit", status: "success", createdAt: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Transaction.aggregate([{ $match: { type: "withdraw", status: "success", createdAt: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Bet.countDocuments(),
      Bet.countDocuments({ createdAt: { $gte: weekAgo } }),
      Bet.countDocuments({ result: "pending" }),
    ]);

    const allDep = totalDeposits[0]?.total || 0;
    const allWith = totalWithdrawals[0]?.total || 0;

    return res.json({
      success: true,
      overview: {
        totalUsers,
        weekNewUsers,
        monthNewUsers,
        totalRevenue: allDep,
        totalPayouts: allWith,
        netProfit: allDep - allWith,
        weekDeposits: weekDeposits[0]?.total || 0,
        weekWithdrawals: weekWithdrawals[0]?.total || 0,
        weekProfit: (weekDeposits[0]?.total || 0) - (weekWithdrawals[0]?.total || 0),
        totalBets: totalBetsCount,
        weekBets: weekBetsCount,
        activeBets,
      },
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 2. USER REGISTRATION TREND (30 days) ====================
router.get("/user-growth", authToken, adminOnly, async (_req, res) => {
  try {
    const thirtyDaysAgo = daysAgo(30);

    const growth = await User.aggregate([
      { $match: { role: "user", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({ success: true, growth });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 3. WEEKLY DEPOSITS vs WITHDRAWALS (7 days) ====================
router.get("/weekly-transactions", authToken, adminOnly, async (_req, res) => {
  try {
    const sevenDaysAgo = daysAgo(7);

    const [deposits, withdrawals] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: "deposit", status: "success", createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        { $match: { type: "withdraw", status: "success", createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.json({ success: true, deposits, withdrawals });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 4. MONTHLY PROFIT/LOSS (12 months) ====================
router.get("/monthly-profit", authToken, adminOnly, async (_req, res) => {
  try {
    const twelveMonthsAgo = monthsAgo(12);

    const [monthlyDeposits, monthlyWithdrawals] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: "deposit", status: "success", createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        { $match: { type: "withdraw", status: "success", createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Merge into profit per month
    const depMap = Object.fromEntries(monthlyDeposits.map((d) => [d._id, d.total]));
    const withMap = Object.fromEntries(monthlyWithdrawals.map((w) => [w._id, w.total]));
    const allMonths = [...new Set([...Object.keys(depMap), ...Object.keys(withMap)])].sort();

    const monthly = allMonths.map((month) => ({
      month,
      deposits: depMap[month] || 0,
      withdrawals: withMap[month] || 0,
      profit: (depMap[month] || 0) - (withMap[month] || 0),
    }));

    return res.json({ success: true, monthly });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 5. REVENUE BY GAME ====================
router.get("/revenue-by-game", authToken, adminOnly, async (_req, res) => {
  try {
    const revenue = await Bet.aggregate([
      { $match: { result: { $in: ["won", "lost"] } } },
      {
        $group: {
          _id: "$game",
          totalStake: { $sum: "$stake" },
          totalPayout: { $sum: "$payout" },
          betCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "games",
          localField: "_id",
          foreignField: "_id",
          as: "gameInfo",
        },
      },
      { $unwind: { path: "$gameInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          gameName: { $ifNull: ["$gameInfo.name", "Unknown"] },
          category: "$gameInfo.category",
          totalStake: 1,
          totalPayout: 1,
          revenue: { $subtract: ["$totalStake", "$totalPayout"] },
          betCount: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    return res.json({ success: true, revenue });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 6. TOP USERS (by bets, deposits, wins) ====================
router.get("/top-users", authToken, adminOnly, async (req, res) => {
  try {
    const metric = req.query.metric || "totalBets";
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const allowedMetrics = ["totalBets", "totalDeposits", "totalWithdrawals", "totalWins", "balance"];
    if (!allowedMetrics.includes(metric)) {
      return res.status(400).json({ error: "Invalid metric" });
    }

    const users = await User.find({ role: "user" })
      .select("username mobile balance totalBets totalDeposits totalWithdrawals totalWins createdAt")
      .sort({ [metric]: -1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, users, metric });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 7. BET ANALYSIS ====================
router.get("/bet-analysis", authToken, adminOnly, async (_req, res) => {
  try {
    const [resultDist, dailyBets] = await Promise.all([
      Bet.aggregate([
        { $group: { _id: "$result", count: { $sum: 1 }, totalStake: { $sum: "$stake" }, totalPayout: { $sum: "$payout" } } },
      ]),
      Bet.aggregate([
        { $match: { createdAt: { $gte: daysAgo(30) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            totalStake: { $sum: "$stake" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.json({ success: true, resultDistribution: resultDist, dailyBets });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 8. REAL-TIME ALERTS ====================
router.get("/alerts", authToken, adminOnly, async (_req, res) => {
  try {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [
      pendingWithdrawals,
      recentRegistrations,
      recentLargeTransactions,
      suspiciousActivity,
    ] = await Promise.all([
      Transaction.find({ type: "withdraw", status: "pending" })
        .populate("user", "username mobile")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find({ role: "user", createdAt: { $gte: oneHourAgo } })
        .select("username mobile createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Transaction.find({ status: "success", amount: { $gte: 50000 }, createdAt: { $gte: oneHourAgo } })
        .populate("user", "username mobile")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      ActivityLog.find({ category: "auth", action: { $regex: /fail/i }, createdAt: { $gte: oneHourAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return res.json({
      success: true,
      alerts: {
        pendingWithdrawals,
        recentRegistrations,
        recentLargeTransactions,
        suspiciousActivity,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 9. GAME STATISTICS ====================
router.get("/game-stats", authToken, adminOnly, async (_req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .select("name slug category totalBets totalRevenue rtp houseEdge")
      .sort({ totalBets: -1 })
      .lean();

    const betsByGame = await Bet.aggregate([
      { $group: { _id: "$game", totalBets: { $sum: 1 }, totalStake: { $sum: "$stake" }, totalPayout: { $sum: "$payout" } } },
    ]);

    const betMap = Object.fromEntries(betsByGame.map((b) => [String(b._id), b]));

    const stats = games.map((game) => {
      const bets = betMap[String(game._id)] || { totalBets: 0, totalStake: 0, totalPayout: 0 };
      return {
        ...game,
        liveBetCount: bets.totalBets,
        liveStake: bets.totalStake,
        livePayout: bets.totalPayout,
        liveRevenue: bets.totalStake - bets.totalPayout,
      };
    });

    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 10. HOURLY ACTIVITY (today) ====================
router.get("/hourly-activity", authToken, adminOnly, async (_req, res) => {
  try {
    const today = daysAgo(0);

    const [hourlyBets, hourlyTransactions] = await Promise.all([
      Bet.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 }, stake: { $sum: "$stake" } } },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: { hour: { $hour: "$createdAt" }, type: "$type" }, count: { $sum: 1 }, amount: { $sum: "$amount" } } },
        { $sort: { "_id.hour": 1 } },
      ]),
    ]);

    return res.json({ success: true, hourlyBets, hourlyTransactions });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 11. USER RETENTION ====================
router.get("/user-retention", authToken, adminOnly, async (_req, res) => {
  try {
    const [statusDist, balanceDist] = await Promise.all([
      User.aggregate([
        { $match: { role: "user" } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: { role: "user" } },
        {
          $bucket: {
            groupBy: "$balance",
            boundaries: [0, 100, 1000, 5000, 10000, 50000, 100000, Infinity],
            default: "100000+",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
    ]);

    return res.json({ success: true, statusDistribution: statusDist, balanceDistribution: balanceDist });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== 12. PLATFORM SUMMARY EXPORT ====================
router.get("/summary", authToken, adminOnly, async (_req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalDeposits,
      totalWithdrawals,
      totalBets,
      settledBets,
      totalGames,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", status: "active" }),
      Transaction.aggregate([{ $match: { type: "deposit", status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
      Transaction.aggregate([{ $match: { type: "withdraw", status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
      Bet.countDocuments(),
      Bet.countDocuments({ result: { $ne: "pending" } }),
      Game.countDocuments(),
    ]);

    return res.json({
      success: true,
      summary: {
        totalUsers,
        activeUsers,
        suspendedOrBanned: totalUsers - activeUsers,
        deposits: { total: totalDeposits[0]?.total || 0, count: totalDeposits[0]?.count || 0 },
        withdrawals: { total: totalWithdrawals[0]?.total || 0, count: totalWithdrawals[0]?.count || 0 },
        netProfit: (totalDeposits[0]?.total || 0) - (totalWithdrawals[0]?.total || 0),
        totalBets,
        settledBets,
        pendingBets: totalBets - settledBets,
        totalGames,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
