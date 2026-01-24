import crypto from "crypto";
import { FastifyInstance } from "fastify";
import AdminToken from "../models/AdminToken.model";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createAdminTokens = async (
  app: FastifyInstance,
  admin: any,
  meta?: { userAgent?: string; ip?: string }
) => {
  const accessToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin" },
    { expiresIn: "15m" }
  );

  const refreshToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin", type: "refresh" },
    { expiresIn: "7d" }
  );

  await AdminToken.create({
    adminId: admin._id,
    tokenHash: hashToken(refreshToken),
    userAgent: meta?.userAgent,
    ip: meta?.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};