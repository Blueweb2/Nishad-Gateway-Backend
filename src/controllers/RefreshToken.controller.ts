import RefreshToken from "../models/RefreshToken";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { FastifyRequest, FastifyReply } from "fastify";

export const refreshTokenController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {  const oldToken = req.cookies.refresh_token;

  if (!oldToken) {
    return reply.status(401).send({ message: "No refresh token" });
  }

  const existing = await RefreshToken.findOne({ token: oldToken });

  if (!existing) {
    return reply.status(403).send({ message: "Invalid refresh token" });
  }

  // 🔥 DELETE OLD TOKEN (rotation)
  await RefreshToken.deleteOne({ token: oldToken });

  // 🔥 CREATE NEW TOKENS
  const accessToken = jwt.sign(
    { id: existing.userId },
    env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { id: existing.userId },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 🔥 STORE NEW REFRESH TOKEN
  await RefreshToken.create({
    userId: existing.userId,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // 🍪 SET COOKIE
  reply.setCookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return reply.send({ accessToken });
};