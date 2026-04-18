const mongoose = require("mongoose");

const blockReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reported: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["block", "report"], required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["pending", "reviewed", "resolved", "dismissed"], default: "pending" },
    adminNote: { type: String, default: "" },
    resolvedBy: { type: String, default: "" },
    resolvedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

blockReportSchema.index({ reporter: 1, reported: 1, type: 1 });
blockReportSchema.index({ status: 1, createdAt: -1 });
blockReportSchema.index({ reported: 1 });

module.exports = mongoose.model("BlockReport", blockReportSchema);
