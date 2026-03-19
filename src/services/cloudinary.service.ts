import cloudinary from "../config/cloudinary";
import { createError } from "../utils/errors";

export const deleteCloudinaryImageService = async (publicId: string) => {
  try {
    if (!publicId || publicId.trim() === "") {
      throw createError(400, "publicId is required");
    }

    return await cloudinary.uploader.destroy(publicId);
  } catch (err: any) {
    throw createError(
      err?.statusCode || 500,
      err?.message || "Cloudinary delete failed"
    );
  }
};

export const getCloudinaryMediaService = async (
  folder?: string,
  nextCursor?: string
) => {
  try {
    let query = cloudinary.search
      .sort_by("created_at", "desc")
      .max_results(50);

    if (folder) {
      query = query.expression(`folder:${folder}`);
    }

    if (nextCursor) {
      query = query.next_cursor(nextCursor);
    }

    return await query.execute();
  } catch (err: any) {
    throw createError(
      err?.statusCode || 500,
      err?.message || "Failed to fetch media"
    );
  }
};