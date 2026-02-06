import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import { getSignedCloudinaryUploadParamsService } from "../services/cloudinarySigned.service";

// ===================================
//  SIGNED UPLOAD PARAMS (secure flow)
// ===================================
export const getSignedUpload = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { folder } = req.query as { folder?: string };

    if (!folder || folder.trim() === "") {
      return sendResponse(reply, 400, false, "Folder is required", null);
    }

    const cleanFolder = folder.trim();

    // ✅ Allowed folders (security)
    const allowedFolders = [
      "nishad-gateway/subservices",
      "nishad-gateway/blogs",
      "nishad-gateway/cities",
      "nishad-gateway/cities/hero",
      "nishad-gateway/subservices/icons",
      "nishad-gateway/cities/vision",
    ];

    if (!allowedFolders.includes(cleanFolder)) {
      return sendResponse(reply, 403, false, "Invalid folder", null);
    }

    const signed = await getSignedCloudinaryUploadParamsService(cleanFolder);

    return sendResponse(reply, 200, true, "Signed upload generated", signed);
  } catch (err: any) {
    req.log.error(err);

    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Signed upload failed",
      null
    );
  }
};
