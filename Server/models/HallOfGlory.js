const mongoose = require("mongoose");

const hallOfGlorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true, trim: true },
    totalPayout: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    isManual: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

hallOfGlorySchema.index({ date: -1, rank: 1 });
hallOfGlorySchema.index({ user: 1 });

module.exports = mongoose.model("HallOfGlory", hallOfGlorySchema);
