import { FastifyInstance } from "fastify";
import { CookieSerializeOptions } from "@fastify/cookie";


export const createAdminTokens = (
  app: FastifyInstance,
  admin: any
) => {
  const accessToken = app.jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,   // USE REAL ROLE
      type: "access",
    },
    { expiresIn: "50m" }
  );

  const refreshToken = app.jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,   //  USE REAL ROLE
      type: "refresh",
    },
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
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge:
      type === "access"
        ? 60 * 50
        : 60 * 60 * 24 * 7,
  };
};
