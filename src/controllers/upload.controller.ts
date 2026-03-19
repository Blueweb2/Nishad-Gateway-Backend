import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import { getSignedCloudinaryUploadParamsService } from "../services/cloudinarySigned.service";
import { deleteCloudinaryImageService } from "../services/cloudinary.service";
import { CLOUDINARY_FOLDERS } from "../constants/cloudinaryFolders";

/* ================= SIGNED UPLOAD ================= */

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

    /* ✅ VALIDATION USING CONSTANT */
    if (!CLOUDINARY_FOLDERS.includes(cleanFolder)) {
      return sendResponse(reply, 403, false, "Invalid folder", null);
    }

    const signed = await getSignedCloudinaryUploadParamsService(cleanFolder);

    return sendResponse(
      reply,
      200,
      true,
      "Signed upload generated",
      signed
    );
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

/* ================= DELETE IMAGE ================= */

export const deleteImage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { publicId } = req.body as { publicId?: string };

    if (!publicId || publicId.trim() === "") {
      return sendResponse(reply, 400, false, "publicId is required", null);
    }

    const result = await deleteCloudinaryImageService(publicId);

    return sendResponse(reply, 200, true, "Image deleted", result);
  } catch (err: any) {
    req.log.error(err);

    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Delete failed",
      null
    );
  }
};