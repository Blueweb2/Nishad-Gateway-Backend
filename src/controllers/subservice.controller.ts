import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import { saveWebpImageService } from "../services/localUpload.service";
import {
  createSubServiceService,
  deleteSubServiceService,
  getSubServicesByServiceService,
  updateSubServiceService,
} from "../services/subservice.service";

// ✅ CREATE SUBSERVICE
export const createSubService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { serviceId } = req.params as any;

    const parts = req.parts();

    let title = "";
    let slug = "";
    let shortDesc = "";
    let order = 1;
    let isActive = true;

    let thumbnailUrl = "";

    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "title") title = String(part.value);
        if (part.fieldname === "slug") slug = String(part.value);
        if (part.fieldname === "shortDesc") shortDesc = String(part.value);
        if (part.fieldname === "order") order = Number(part.value || 1);
        if (part.fieldname === "isActive") isActive = String(part.value) === "true";
      }

      if (part.type === "file" && part.fieldname === "thumbnail") {
        const buffer = await part.toBuffer();

        try {
          thumbnailUrl = await saveWebpImageService(buffer, "subservices", "subservice");
        } catch {
          return sendResponse(reply, 400, false, "Invalid image file", null);
        }
      }
    }

    if (!title.trim()) return sendResponse(reply, 400, false, "Title is required", null);
    if (!slug.trim()) return sendResponse(reply, 400, false, "Slug is required", null);
    if (!thumbnailUrl) return sendResponse(reply, 400, false, "Thumbnail image is required", null);

    const created = await createSubServiceService({
      serviceId,
      title: title.trim(),
      slug: slug.trim(),
      shortDesc: shortDesc.trim(),
      order,
      isActive,
      thumbnail: thumbnailUrl,
    });

    return sendResponse(reply, 201, true, "Subservice created", created);
  } catch (err: any) {
    return sendResponse(reply, err.statusCode || 500, false, err.message || "Server error", null);
  }
};

// ✅ GET SUBSERVICES BY SERVICE
export const getSubServicesByService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { serviceId } = req.params as any;

    const subservices = await getSubServicesByServiceService(serviceId);

    return sendResponse(reply, 200, true, "Subservices fetched", subservices);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err.message || "Server error", null);
  }
};

// ✅ UPDATE SUBSERVICE
export const updateSubService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { subId } = req.params as any;

    const parts = req.parts();
    const updateData: any = {};

    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "title") updateData.title = String(part.value);
        if (part.fieldname === "slug") updateData.slug = String(part.value);
        if (part.fieldname === "shortDesc") updateData.shortDesc = String(part.value);
        if (part.fieldname === "order") updateData.order = Number(part.value || 1);
        if (part.fieldname === "isActive") updateData.isActive = String(part.value) === "true";
      }

      if (part.type === "file" && part.fieldname === "thumbnail") {
        const buffer = await part.toBuffer();

        try {
          updateData.thumbnail = await saveWebpImageService(buffer, "subservices", "subservice");
        } catch {
          return sendResponse(reply, 400, false, "Invalid image file", null);
        }
      }
    }

    const updated = await updateSubServiceService(subId, updateData);

    return sendResponse(reply, 200, true, "Subservice updated", updated);
  } catch (err: any) {
    return sendResponse(reply, err.statusCode || 500, false, err.message || "Server error", null);
  }
};

// ✅ DELETE SUBSERVICE
export const deleteSubService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { subId } = req.params as any;

    const deleted = await deleteSubServiceService(subId);

    return sendResponse(reply, 200, true, "Subservice deleted", deleted);
  } catch (err: any) {
    return sendResponse(reply, err.statusCode || 500, false, err.message || "Server error", null);
  }
};
