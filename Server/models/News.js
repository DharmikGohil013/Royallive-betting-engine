const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: "general", enum: ["general", "update", "maintenance", "promotion", "alert"] },
    isActive: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

newsSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model("News", newsSchema);
