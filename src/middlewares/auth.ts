import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "../utils/response";

export const auth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies?.admin_access_token;

    if (!token) {
      return sendResponse(reply, 401, false, "Unauthorized", null);
    }

    const decoded = req.server.jwt.verify(token);
    req.user = decoded;

  } catch (err) {
    return sendResponse(reply, 401, false, "Invalid token", null);
  }
};
