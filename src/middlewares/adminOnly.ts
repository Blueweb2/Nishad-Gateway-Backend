// admin guard middleware
import { FastifyRequest, FastifyReply } from "fastify";

export const adminOnly = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = req.user as any;

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ check role from JWT payload
    if (user.role !== "admin") {
      return reply.code(403).send({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
  } catch (err) {
    return reply.code(403).send({
      success: false,
      message: "Access denied",
    });
  }
};

