import mongoose from "mongoose";

const AdminTokenSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true, // ⚡ fast lookup
    },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    isRevoked: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// ✅ TTL index (auto delete expired tokens)
AdminTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AdminToken", AdminTokenSchema);