import { FastifyInstance } from "fastify";
import { CookieSerializeOptions } from "@fastify/cookie";

export const createAdminTokens = (app: FastifyInstance, admin: any) => {
  const accessToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin" },
    { expiresIn: "15m" }
  );

  const refreshToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin", type: "refresh" },
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const getCookieOptions = (
  type: "access" | "refresh"
): CookieSerializeOptions => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    path: "/",
    httpOnly: true,
    sameSite: "none",
      // ✅ literal type (fixes TS error)
    secure: true,       // false on localhost, true on prod
    maxAge:
      type === "access"
        ? 60 * 15
        : 60 * 60 * 24 * 7,
  };
};