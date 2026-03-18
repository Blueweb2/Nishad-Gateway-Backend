import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,   // ✅ normalize
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,     // 🔐 hide by default
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
      index: true,       // ⚡ filter optimization
    },
  },
  { timestamps: true }
);

// ✅ Explicit index (better control)
AdminSchema.index({ email: 1 });

export const Admin = mongoose.model("Admin", AdminSchema, "admins");