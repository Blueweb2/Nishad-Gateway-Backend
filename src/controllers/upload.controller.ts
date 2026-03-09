import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import { getSignedCloudinaryUploadParamsService } from "../services/cloudinarySigned.service";
import { deleteCloudinaryImageService } from "../services/cloudinary.service";


// ===================================
//  SIGNED UPLOAD PARAMS (secure flow)
// ===================================
export const getSignedUpload = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { folder } = req.query as { folder?: string };
    
console.log(folder,"folder");

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
      "nishad-gateway/cities/investment",
      "nishad-gateway/cities/infrastructure",
      "nishad-gateway/cities/food-guide",
      "nishad-gateway/cities/transportation",
      "nishad-gateway/cities/snapshot",
      "nishad-gateway/cities/future-outlook",
      "nishad-gateway/sectors/icons",
      "nishad-gateway/sectors/hero",
      "nishad-gateway/ministries/covers",
      "nishad-gateway/ministries/logos",
      "nishad-gateway/ministries/slides",
      "nishad-gateway/ministries/faq",
      "nishad-gateway/ministries/cards",
      "nishad-gateway/cities/content",
    ];

    console.log("---- DEBUG START ----");
console.log("Received:", JSON.stringify(cleanFolder));
console.log("Length:", cleanFolder.length);

console.log("THIS IS THE ACTIVE UPLOAD CONTROLLER");

allowedFolders.forEach((f, i) => {
  console.log(
    `Allowed[${i}]:`,
    JSON.stringify(f),
    "Length:",
    f.length,
    "Match:",
    f === cleanFolder
  );
});

console.log("---- DEBUG END ----");

    if (!allowedFolders.includes(cleanFolder)) {
      return sendResponse(reply, 403, false, "Invalid folder", null);
    }
    console.log("Allowed folders:", allowedFolders);
console.log("Received:", cleanFolder);

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


// ===================================
// DELETE IMAGE
// ===================================
export const deleteImage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { publicId } = req.body as { publicId?: string };

    if (!publicId) {
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
