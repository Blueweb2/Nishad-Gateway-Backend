// verify jwt token middleware

import { FastifyRequest, FastifyReply } from "fastify";

export const auth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    req.user = req.server.jwt.verify(token);
  } catch (err) {
    return reply.code(401).send({ success: false, message: "Invalid token" });
  }
};
