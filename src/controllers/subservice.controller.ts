import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import {
  createSubServiceService,
  deleteSubServiceService,
  getSubServicesByServiceService,
  updateSubServiceService,
} from "../services/subservice.service";


// CREATE SUBSERVICE
export const createSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { serviceId } = req.params as any;

    const {
      title,
      slug,
      shortDesc,
      order = 1,
      isActive = true,
      thumbnail,
    } = req.body as any;

    if (!title?.trim())
      return sendResponse(reply, 400, false, "Title is required", null);

    if (!slug?.trim())
      return sendResponse(reply, 400, false, "Slug is required", null);

    if (!thumbnail)
      return sendResponse(reply, 400, false, "Thumbnail URL is required", null);

    const created = await createSubServiceService({
      serviceId,
      title: title.trim(),
      slug: slug.trim(),
      shortDesc: shortDesc?.trim() || "",
      order,
      isActive,
      thumbnail,
    });

    return sendResponse(reply, 201, true, "Subservice created", created);

  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Server error",
      null
    );
  }
};


//  GET SUBSERVICES BY SERVICE
export const getSubServicesByService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { serviceId } = req.params as any;

    const subservices = await getSubServicesByServiceService(serviceId);

    return sendResponse(reply, 200, true, "Subservices fetched", subservices);

  } catch (err: any) {
    return sendResponse(reply, 500, false, err.message || "Server error", null);
  }
};


//  UPDATE SUBSERVICE
export const updateSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;

    const updateData = req.body as any;

    const updated = await updateSubServiceService(subId, updateData);

    return sendResponse(reply, 200, true, "Subservice updated", updated);

  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Server error",
      null
    );
  }
};


//  DELETE SUBSERVICE
export const deleteSubService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;

    const deleted = await deleteSubServiceService(subId);

    return sendResponse(reply, 200, true, "Subservice deleted", deleted);

  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Server error",
      null
    );
  }
};