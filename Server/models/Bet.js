const mongoose = require("mongoose");

const betSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    gameSlug: { type: String, default: "" },
    matchId: { type: String, default: "" },
    betType: { type: String, default: "single" },
    selection: { type: String, default: "" },
    odds: { type: Number, required: true },
    stake: { type: Number, required: true, min: 0 },
    potentialWin: { type: Number, default: 0 },
    result: {
      type: String,
      enum: ["pending", "won", "lost", "void", "cashout"],
      default: "pending",
    },
    payout: { type: Number, default: 0 },
    settledAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

betSchema.index({ user: 1, createdAt: -1 });
betSchema.index({ game: 1 });
betSchema.index({ result: 1 });
betSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Bet", betSchema);
