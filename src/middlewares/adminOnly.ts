import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "../utils/response";

export const adminOnly = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = req.user as any;

    if (!user) {
      return sendResponse(reply, 401, false, "Unauthorized", null);
    }

    if (user.role !== "admin") {
      return sendResponse(reply, 403, false, "Access denied. Admin only.", null);
    }
  } catch (err) {
    return sendResponse(reply, 403, false, "Access denied", null);
  }
};
