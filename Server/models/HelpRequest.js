const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: ["account", "payment", "betting", "technical", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    adminReply: { type: String, default: "" },
    repliedBy: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

helpRequestSchema.index({ user: 1, createdAt: -1 });
helpRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
