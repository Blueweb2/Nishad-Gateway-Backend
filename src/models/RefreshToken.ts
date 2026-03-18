import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true, // ⚡ lookup
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 TTL index
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", refreshTokenSchema);