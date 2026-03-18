import mongoose from "mongoose";

const AdminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true, // ⚡ fast filtering
    },

    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"], // 🔐 controlled values
      index: true,
    },

    targetType: {
      type: String,
      default: "",
      index: true, // e.g. "service", "blog"
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      default: null,
    },

    ip: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    details: {
      type: Object, // optional extra info
      default: {},
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 Latest logs fast
AdminActivitySchema.index({ createdAt: -1 });

// 🔥 Admin-wise history
AdminActivitySchema.index({ adminId: 1, createdAt: -1 });

// 🔥 Filter by entity
AdminActivitySchema.index({ targetType: 1, targetId: 1 });

export const AdminActivity =
  mongoose.models.AdminActivity ||
  mongoose.model("AdminActivity", AdminActivitySchema, "admin_activities");