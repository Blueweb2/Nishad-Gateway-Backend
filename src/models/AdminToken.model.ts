import mongoose from "mongoose";

const AdminTokenSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

AdminTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AdminToken", AdminTokenSchema);