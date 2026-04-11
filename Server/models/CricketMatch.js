const mongoose = require("mongoose");

const cricketMatchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    league: { type: String, default: "" },
    matchType: {
      type: String,
      enum: ["T20", "ODI", "Test", "T10", ""],
      default: "",
    },
    matchDate: { type: Date, required: true },
    venue: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled"],
      default: "upcoming",
    },
    score1: { type: String, default: "" },
    score2: { type: String, default: "" },
    overs: { type: String, default: "" },
    result: { type: String, default: "" },
    odds: {
      team1Win: { type: Number, default: 0 },
      team2Win: { type: Number, default: 0 },
      draw: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

cricketMatchSchema.index({ status: 1, matchDate: -1 });

module.exports = mongoose.model("CricketMatch", cricketMatchSchema);
