const mongoose = require("mongoose");

const marqueeSchema = new mongoose.Schema(
  {
    label: { type: String, default: "WINNER:", trim: true },
    username: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    highlighted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

marqueeSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model("Marquee", marqueeSchema);
