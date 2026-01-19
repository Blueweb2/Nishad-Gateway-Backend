import { FastifyReply, FastifyRequest } from "fastify";
import { SubServiceContentModel } from "../models/SubServiceContent.model";
import { sendResponse } from "../utils/response";
import { SubServiceModel } from "../models/SubService.model";

export const getSubServiceContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { subId } = req.params as any;

  const content = await SubServiceContentModel.findOne({ subServiceId: subId });

  return sendResponse(reply, 200, true, "Content fetched", content);
};

// NEW: Fetch content using subservice slug
export const getSubServiceContentBySlug = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { slug } = req.params as any;

  // 1) find subservice by slug
  const sub = await SubServiceModel.findOne({ slug });

  if (!sub) {
    return sendResponse(reply, 404, false, "Subservice not found", null);
  }

  // 2) find content by subServiceId
  const content = await SubServiceContentModel.findOne({
    subServiceId: sub._id,
  });

  return sendResponse(reply, 200, true, "Content fetched", content);
};

export const upsertSubServiceContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { subId } = req.params as any;
  const body = req.body as any;

  const updated = await SubServiceContentModel.findOneAndUpdate(
    { subServiceId: subId },
    { ...body, subServiceId: subId },
    { new: true, upsert: true }
  );

  return sendResponse(reply, 200, true, "Content saved", updated);
};
