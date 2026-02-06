import { FastifyRequest } from "fastify";
import { AdminActivity } from "../models/AdminActivity.model";

export const logAdminActivity = async (
  request: FastifyRequest,
  action: string,
  targetType?: string,
  targetId?: string,
  adminIdOverride?: string
) => {
  try {
    const user = request.user as any;

    const adminId = adminIdOverride || user?.id;
    if (!adminId) return;

    await AdminActivity.create({
      adminId,
      action,
      targetType,
      targetId,
      ip: request.ip,
      userAgent: request.headers["user-agent"] || "",
    });
  } catch (err) {
    console.error("Activity log failed", err);
  }
};
