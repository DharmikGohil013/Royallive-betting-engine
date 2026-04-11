const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    user: { type: String, default: "" },
    body: { type: mongoose.Schema.Types.Mixed, default: null },
    query: { type: mongoose.Schema.Types.Mixed, default: null },
    error: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

apiLogSchema.index({ createdAt: -1 });
apiLogSchema.index({ method: 1, createdAt: -1 });
apiLogSchema.index({ statusCode: 1, createdAt: -1 });
apiLogSchema.index({ path: 1, createdAt: -1 });
// Auto-expire logs older than 90 days
apiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model("ApiLog", apiLogSchema);
