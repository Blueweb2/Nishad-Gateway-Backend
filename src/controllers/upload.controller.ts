import { FastifyReply, FastifyRequest } from "fastify";
import cloudinary from "../config/cloudinary";
import { sendResponse } from "../utils/response";

export const uploadImage = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const file = await (req as any).file();

    if (!file) {
      return sendResponse(reply, 400, false, "No file uploaded", null);
    }

    const buffer = await file.toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "nishad-gateway/subservices",
          },
          (error, uploaded) => {
            if (error) reject(error);
            else resolve(uploaded);
          }
        )
        .end(buffer);
    });

    return sendResponse(reply, 200, true, "Image uploaded", {
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return sendResponse(reply, 500, false, "Upload failed", null);
  }
};
