const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    brandName: { type: String, default: "", trim: true },
    link: { type: String, default: "" },
    type: { type: String, enum: ["banner", "popup", "promotion", "offer"], default: "promotion" },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

promotionSchema.index({ isActive: 1, sortOrder: 1 });
promotionSchema.index({ type: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);
