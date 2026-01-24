import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import {
  createServiceService,
  deleteServiceService,
  getServicesService,
  getServicesWithSubServicesService,
  updateServiceService,
  getServiceBySlugService,
} from "../services/service.service";

export const createService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = req.body as any;

    const service = await createServiceService(body);

    return sendResponse(reply, 201, true, "Service created", service);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Service create failed",
      null
    );
  }
};

export const getServices = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const services = await getServicesService();

    return sendResponse(reply, 200, true, "Services fetched", services);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Failed to fetch services",
      null
    );
  }
};

export const updateService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as any;
    const body = req.body as any;

    const updated = await updateServiceService(id, body);

    return sendResponse(reply, 200, true, "Service updated", updated);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Service update failed",
      null
    );
  }
};

export const deleteService = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as any;

    const deleted = await deleteServiceService(id);

    return sendResponse(reply, 200, true, "Service deleted", deleted);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Service delete failed",
      null
    );
  }
};

// PUBLIC menu route
export const getServicesWithSubServices = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await getServicesWithSubServicesService();

    return sendResponse(reply, 200, true, "Services menu fetched", data);
  } catch (err: any) {
    req.log.error(err);
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err?.message || "Failed to fetch menu",
      null
    );
  }
};

export const getServiceBySlug = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { slug } = req.params as any;

    const service = await getServiceBySlugService(slug);

    return sendResponse(reply, 200, true, "Service fetched", service);
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
