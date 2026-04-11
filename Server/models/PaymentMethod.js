const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ["mobile", "bank", "crypto", "card", "other"], required: true },
    icon: { type: String, default: "account_balance_wallet" },
    isActive: { type: Boolean, default: true },
    minAmount: { type: Number, default: 100 },
    maxAmount: { type: Number, default: 500000 },
    processingTime: { type: String, default: "Instant" },
    fee: { type: Number, default: 0 },
    instructions: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

paymentMethodSchema.index({ slug: 1 }, { unique: true });
paymentMethodSchema.index({ isActive: 1, type: 1 });

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
