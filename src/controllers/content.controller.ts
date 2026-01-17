import { FastifyReply, FastifyRequest } from "fastify";
import { SubServiceContentModel } from "../models/SubServiceContent.model";
import { sendResponse } from "../utils/response";

export const getSubServiceContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { subId } = req.params as any;

  const content = await SubServiceContentModel.findOne({ subServiceId: subId });

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
