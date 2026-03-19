import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";
import { getCloudinaryMediaService } from "../services/cloudinary.service";
import { CLOUDINARY_FOLDERS } from "../constants/cloudinaryFolders"; // optional

// export const getFolders = async (
//   req: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   try {
//     return sendResponse(
//       reply,
//       200,
//       true,
//       "Folders fetched",
//       CLOUDINARY_FOLDERS
//     );
//   } catch (err: any) {
//     return sendResponse(reply, 500, false, err.message, null);
//   }
// };

import cloudinary from "../config/cloudinary";


/* ================= RECURSIVE FETCH ================= */
const fetchFoldersRecursive = async (path: string): Promise<string[]> => {
  let results: string[] = [];

  const res = await cloudinary.api.sub_folders(path);

  for (const folder of res.folders) {
    results.push(folder.path);

    // 🔁 fetch subfolders
    const children = await fetchFoldersRecursive(folder.path);
    results = results.concat(children);
  }

  return results;
};

/* ================= GET ALL FOLDERS ================= */
export const getFolders = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const baseFolder = "nishad-gateway"; // 👈 your root

    const folders = await fetchFoldersRecursive(baseFolder);

    return sendResponse(
      reply,
      200,
      true,
      "Folders fetched",
      folders
    );
  } catch (err: any) {
    return sendResponse(
      reply,
      500,
      false,
      err.message || "Failed to fetch folders",
      null
    );
  }
};

export const getAllMedia = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { folder, cursor } = req.query as {
      folder?: string;
      cursor?: string;
    };

    const result = await getCloudinaryMediaService(folder, cursor);

    return sendResponse(reply, 200, true, "Media fetched", result);
  } catch (err: any) {
    return sendResponse(
      reply,
      err?.statusCode || 500,
      false,
      err?.message,
      null
    );
  }
};