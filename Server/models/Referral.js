const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referralCode: { type: String, required: true, trim: true },
    rewardAmount: { type: Number, default: 50 },
    rewardClaimed: { type: Boolean, default: false },
    claimedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

referralSchema.index({ referrer: 1 });
referralSchema.index({ referred: 1 }, { unique: true });
referralSchema.index({ referralCode: 1 });

module.exports = mongoose.model("Referral", referralSchema);
