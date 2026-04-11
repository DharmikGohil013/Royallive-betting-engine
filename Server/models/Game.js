const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ["casino", "sports", "slots", "live-dealer", "esports", "instant-win"],
      required: true,
    },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "text-primary-container" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    minBet: { type: Number, default: 10 },
    maxBet: { type: Number, default: 100000 },
    houseEdge: { type: Number, default: 2.5 },
    winProbability: { type: Number, default: 48 },
    autoPayout: { type: Boolean, default: true },
    volatility: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    rtp: { type: Number, default: 95 },
    sortOrder: { type: Number, default: 0 },
    totalBets: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

gameSchema.index({ slug: 1 }, { unique: true });
gameSchema.index({ category: 1, isActive: 1 });
gameSchema.index({ isFeatured: 1 });

module.exports = mongoose.model("Game", gameSchema);
