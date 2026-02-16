import cloudinary from "../config/cloudinary";
import { createError } from "../utils/errors";

export const deleteCloudinaryImageService = async (publicId: string) => {
  try {
    if (!publicId || publicId.trim() === "") {
      throw createError(400, "publicId is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (err: any) {
    throw createError(
      err?.statusCode || 500,
      err?.message || "Cloudinary delete failed"
    );
  }
};
