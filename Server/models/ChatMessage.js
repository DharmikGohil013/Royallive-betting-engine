const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  message: { type: String, required: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
}, { timestamps: true });

chatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
