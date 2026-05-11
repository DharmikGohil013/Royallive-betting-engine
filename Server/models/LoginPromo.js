const mongoose = require("mongoose");

const loginPromoSchema = new mongoose.Schema(
  {
    tagline: { type: String, required: true, trim: true },        // e.g. "Top Bonus Offer"
    headline: { type: String, required: true, trim: true },       // e.g. "200% Kinetic Boost"
    ctaText: { type: String, default: "", trim: true },           // e.g. "REDEEM ON FIRST DEPOSIT"
    ctaIcon: { type: String, default: "bolt", trim: true },       // Material icon name
    image: { type: String, default: "" },                          // Promo image URL
    link: { type: String, default: "" },                           // Optional link
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

loginPromoSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model("LoginPromo", loginPromoSchema);
