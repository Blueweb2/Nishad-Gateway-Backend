import { FastifyReply, FastifyRequest } from "fastify";

export const adminAuth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify();
    const user = req.user as any;

    if (user.role !== "admin") {
      return reply.code(403).send({ message: "Forbidden (Admin only)" });
    }
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
};