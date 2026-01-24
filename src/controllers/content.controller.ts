import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import {
  getSubServiceContentService,
  getSubServiceContentBySlugService,
  upsertSubServiceContentService,
} from "../services/content.service";

export const getSubServiceContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;

    const content = await getSubServiceContentService(subId);

    return sendResponse(reply, 200, true, "Content fetched", content);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Server error",
      null
    );
  }
};

export const getSubServiceContentBySlug = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { slug } = req.params as any;

    const content = await getSubServiceContentBySlugService(slug);

    return sendResponse(reply, 200, true, "Content fetched", content);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Server error",
      null
    );
  }
};

export const upsertSubServiceContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { subId } = req.params as any;
    const body = req.body as any;

    const updated = await upsertSubServiceContentService(subId, body);

    return sendResponse(reply, 200, true, "Content saved", updated);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Server error",
      null
    );
  }
};
