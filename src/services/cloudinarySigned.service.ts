import cloudinary from "../config/cloudinary";
import { env } from "../config/env";
import { createError } from "../utils/errors";

export const getSignedCloudinaryUploadParamsService = async (
  folder: string
) => {
  try {
    /* ================= VALIDATION ================= */

    if (!folder || folder.trim() === "") {
      throw createError(400, "Folder is required");
    }

    if (!env.CLOUDINARY_API_SECRET) {
      throw createError(500, "Cloudinary API secret missing");
    }

    /* ================= TIMESTAMP ================= */
    // Cloudinary requires seconds
    const timestamp = Math.floor(Date.now() / 1000);

    /* ================= SIGNATURE ================= */

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      env.CLOUDINARY_API_SECRET
    );

    return {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    };

  } catch (err: any) {
    throw createError(
      err?.statusCode || 500,
      err?.message || "Signed upload failed"
    );
  }
};