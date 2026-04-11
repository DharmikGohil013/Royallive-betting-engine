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
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
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
    balance: this.balance,
    status: this.status,
    totalDeposits: this.totalDeposits,
    totalWithdrawals: this.totalWithdrawals,
    totalBets: this.totalBets,
    totalWinnings: this.totalWinnings,
    totalWins: this.totalWins,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
