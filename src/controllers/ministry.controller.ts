import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import {
  createMinistryService,
  getMinistriesService,
  getMinistryBySlugService,
  updateMinistryService,
  deleteMinistryService,
  getMinistryByIdService,
} from "../services/ministry.service";

export const createMinistry = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const ministry = await createMinistryService(req.body);

    return sendResponse(reply, 201, true, "Ministry created", ministry);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message
    );
  }
};

export const getMinistries = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const ministries = await getMinistriesService();

  return sendResponse(reply, 200, true, "Ministries fetched", ministries);
};

export const getMinistryBySlug = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { slug } = req.params as any;

  const ministry = await getMinistryBySlugService(slug);

  return sendResponse(reply, 200, true, "Ministry fetched", ministry);
};

export const updateMinistry = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as any;

  const ministry = await updateMinistryService(id, req.body);

  return sendResponse(reply, 200, true, "Ministry updated", ministry);
};

export const getMinistryById = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as any;

  const ministry = await getMinistryByIdService(id);

  return sendResponse(reply, 200, true, "Ministry fetched", ministry);
};

export const deleteMinistry = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as any;

  await deleteMinistryService(id);

  return sendResponse(reply, 200, true, "Ministry deleted");
};