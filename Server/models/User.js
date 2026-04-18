const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, "Mobile must contain 10 to 15 digits"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      default: null,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      match: [/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscore"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    referralCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },
    myReferralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    balance: {
      type: Number,
      default: 1000,
      min: 0,
    },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    totalBets: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    totalReferrals: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    dateOfBirth: { type: Date },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "Bangladesh" },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ mobile: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    mobile: this.mobile,
    email: this.email,
    username: this.username,
    role: this.role,
    referralCode: this.referralCode,
    myReferralCode: this.myReferralCode,
    referredBy: this.referredBy,
    balance: this.balance,
    currency: this.currency,
    status: this.status,
    totalDeposits: this.totalDeposits,
    totalWithdrawals: this.totalWithdrawals,
    totalBets: this.totalBets,
    totalWinnings: this.totalWinnings,
    totalWins: this.totalWins,
    totalLosses: this.totalLosses,
    totalReferrals: this.totalReferrals,
    referralEarnings: this.referralEarnings,
    profileImage: this.profileImage,
    dateOfBirth: this.dateOfBirth,
    address: this.address,
    city: this.city,
    country: this.country,
    reportCount: this.reportCount,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
  };
};

module.exports = mongoose.model("User", userSchema);
