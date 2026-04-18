const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ["general", "game", "payment", "notification", "security", "about", "policy", "site", "notifications", "referral", "promotion"],
      default: "general",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

settingSchema.index({ key: 1 }, { unique: true });
settingSchema.index({ category: 1 });

module.exports = mongoose.model("Setting", settingSchema);
