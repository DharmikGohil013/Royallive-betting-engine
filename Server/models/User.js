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
    referralCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.index({ mobile: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    mobile: this.mobile,
    username: this.username,
    referralCode: this.referralCode,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
