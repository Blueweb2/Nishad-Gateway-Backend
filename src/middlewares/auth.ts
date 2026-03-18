import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "../utils/response";

export const auth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let token: string | undefined;

    // Prefer cookie (secure httpOnly)
    if (req.cookies?.admin_access_token) {
      token = req.cookies.admin_access_token;
    }

    // Fallback to Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 attach token manually (important for fastify-jwt)
    req.headers.authorization = `Bearer ${token}`;

    await req.jwtVerify();

  } catch (err) {
    return reply.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};