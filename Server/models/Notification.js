const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error", "promo"],
      default: "info",
    },
    target: {
      type: String,
      enum: ["all", "user", "admin"],
      default: "all",
    },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

notificationSchema.index({ target: 1, createdAt: -1 });
notificationSchema.index({ targetUser: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
