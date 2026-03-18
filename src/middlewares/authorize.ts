import { FastifyRequest, FastifyReply } from "fastify";

type Role = "admin" | "superadmin";

export const authorize = (roles: Role[]) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as { role?: Role };

    if (!user) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(user.role as Role)) {
      return reply.status(403).send({
        success: false,
        message: "Access denied",
      });
    }
  };
};