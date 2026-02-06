import { FastifyRequest, FastifyReply } from "fastify";
import { sendResponse } from "../utils/response";

export const auth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies?.admin_access_token;
    console.log("Incoming cookies:", req.cookies);


    if (!token) {
      return sendResponse(reply, 401, false, "Unauthorized", null);
    }

    // ✅ verify using fastify decorator
    await req.jwtVerify();

  } catch (err) {
    return sendResponse(reply, 401, false, "Invalid token", null);
  }
};
