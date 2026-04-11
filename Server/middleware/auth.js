const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const ActivityLog = require("../models/ActivityLog");
const ApiLog = require("../models/ApiLog");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

// --- JWT Authentication ---
function authToken(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// --- Admin-only ---
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}

// --- Active user check ---
const User = require("../models/User");
async function activeUser(req, res, next) {
  if (req.user.role === "admin") return next();
  try {
    const user = await User.findById(req.user.sub).select("status").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status !== "active") {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }
    return next();
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// --- Rate Limiters ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Activity Logger ---
function logActivity(action, category = "system") {
  return async (req, _res, next) => {
    try {
      await ActivityLog.create({
        user: req.user?.sub || req.user?._id || null,
        action,
        category,
        details: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        userAgent: (req.headers["user-agent"] || "").substring(0, 200),
      });
    } catch {
      // non-blocking
    }
    next();
  };
}

// --- Security middleware factory ---
function securityMiddleware() {
  return [
    helmet({ contentSecurityPolicy: false }),
    mongoSanitize(),
  ];
}

// --- API Request Logger Middleware ---
function apiLogger(req, res, next) {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);

    const responseTime = Date.now() - start;
    const sanitizedBody = req.body ? { ...req.body } : null;
    if (sanitizedBody) {
      delete sanitizedBody.password;
      delete sanitizedBody.token;
      delete sanitizedBody.secret;
    }

    ApiLog.create({
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip || "",
      userAgent: (req.headers["user-agent"] || "").substring(0, 300),
      user: req.user?.username || req.user?.sub || "",
      body: sanitizedBody,
      query: Object.keys(req.query || {}).length ? req.query : null,
      error: res.statusCode >= 400 ? (res.statusMessage || "") : "",
    }).catch(() => {});
  };

  next();
}

module.exports = {
  authToken,
  adminOnly,
  activeUser,
  authLimiter,
  apiLimiter,
  logActivity,
  securityMiddleware,
  apiLogger,
};
