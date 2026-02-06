import { FastifyReply, FastifyRequest } from "fastify";

export const requireSuperAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as any;

  if (!user || user.role !== "superadmin") {
    return reply.status(403).send({
      success: false,
      message: "Superadmin access only",
    });
  }
};
