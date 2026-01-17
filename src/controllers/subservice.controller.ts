import { FastifyReply, FastifyRequest } from "fastify";
import { SubServiceModel } from "../models/SubService.model";
import { sendResponse } from "../utils/response";

import sharp from "sharp";
import path from "path";
import fs from "fs";

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const saveWebpImage = async (buffer: Buffer) => {
  const uploadDir = path.join(process.cwd(), "uploads", "subservices");
  ensureDir(uploadDir);

  const fileName = `subservice-${Date.now()}.webp`;
  const outputPath = path.join(uploadDir, fileName);

  await sharp(buffer).webp({ quality: 80 }).toFile(outputPath);

  return `/uploads/subservices/${fileName}`;
};

export const createSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
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
      // TEXT fields
      if (part.type === "field") {
        if (part.fieldname === "title") title = String(part.value);
        if (part.fieldname === "slug") slug = String(part.value);
        if (part.fieldname === "shortDesc") shortDesc = String(part.value);
        if (part.fieldname === "order") order = Number(part.value || 1);
        if (part.fieldname === "isActive")
          isActive = String(part.value) === "true";
      }

      // FILE field
      if (part.type === "file" && part.fieldname === "thumbnail") {
        const buffer = await part.toBuffer();

        try {
          thumbnailUrl = await saveWebpImage(buffer);
        } catch (err) {
          return sendResponse(reply, 400, false, "Invalid image file");
        }
      }
    }

    if (!title.trim()) {
      return sendResponse(reply, 400, false, "Title is required");
    }

    if (!slug.trim()) {
      return sendResponse(reply, 400, false, "Slug is required");
    }

    if (!thumbnailUrl) {
      return sendResponse(reply, 400, false, "Thumbnail image is required");
    }

    // ✅ prevent duplicate slug in same service
    const exists = await SubServiceModel.findOne({ serviceId, slug });
    if (exists) {
      return sendResponse(reply, 409, false, "Slug already exists");
    }

    const created = await SubServiceModel.create({
      serviceId,
      title: title.trim(),
      slug: slug.trim(),
      shortDesc: shortDesc.trim(),
      order,
      isActive,
      thumbnail: thumbnailUrl, // ✅ WEBP url stored in DB
    });

    return sendResponse(reply, 201, true, "Subservice created", created);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err?.message || "Server error");
  }
};

export const getSubServicesByService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { serviceId } = req.params as any;

    const subservices = await SubServiceModel.find({ serviceId }).sort({
      order: 1,
    });

    return sendResponse(reply, 200, true, "Subservices fetched", subservices);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err?.message || "Server error");
  }
};

export const updateSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;

    const parts = req.parts();
    const updateData: any = {};

    for await (const part of parts) {
      // TEXT fields
      if (part.type === "field") {
        if (part.fieldname === "title") updateData.title = String(part.value);
        if (part.fieldname === "slug") updateData.slug = String(part.value);
        if (part.fieldname === "shortDesc")
          updateData.shortDesc = String(part.value);
        if (part.fieldname === "order")
          updateData.order = Number(part.value || 1);
        if (part.fieldname === "isActive")
          updateData.isActive = String(part.value) === "true";
      }

      // FILE field (optional)
      if (part.type === "file" && part.fieldname === "thumbnail") {
        const buffer = await part.toBuffer();

        try {
          updateData.thumbnail = await saveWebpImage(buffer);
        } catch (err) {
          return sendResponse(reply, 400, false, "Invalid image file");
        }
      }
    }

    const updated = await SubServiceModel.findByIdAndUpdate(subId, updateData, {
      new: true,
    });

    if (!updated) {
      return sendResponse(reply, 404, false, "Subservice not found");
    }

    return sendResponse(reply, 200, true, "Subservice updated", updated);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err?.message || "Server error");
  }
};

export const deleteSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;

    const deleted = await SubServiceModel.findByIdAndDelete(subId);

    if (!deleted) {
      return sendResponse(reply, 404, false, "Subservice not found");
    }

    return sendResponse(reply, 200, true, "Subservice deleted", deleted);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err?.message || "Server error");
  }
};
