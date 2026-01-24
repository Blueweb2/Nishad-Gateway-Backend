import { FastifyInstance } from "fastify";

export const createAdminTokens = (app: FastifyInstance, admin: any) => {
  const accessToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin" },
    { expiresIn: "15m" }
  );

  // ✅ include email in refresh token also
  const refreshToken = app.jwt.sign(
    { id: admin._id, email: admin.email, role: "admin", type: "refresh" },
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const getCookieOptions = (type: "access" | "refresh") => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    maxAge: type === "access" ? 60 * 15 : 60 * 60 * 24 * 7,
  };
};
