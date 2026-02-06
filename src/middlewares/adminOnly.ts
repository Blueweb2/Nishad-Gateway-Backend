import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "../utils/response";

import { JwtPayload } from "../types/jwt.types";

export const adminOnly = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user as JwtPayload;

  if (!user) {
    return sendResponse(reply, 401, false, "Unauthorized", null);
  }

  if (!["admin", "superadmin"].includes(user.role)) {
    return sendResponse(reply, 403, false, "Access denied", null);
  }
};
