import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceModel } from "../models/Service.model";
import { sendResponse } from "../utils/response";
import { SubServiceModel } from "../models/SubService.model";

export const createService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const body = req.body as any;

  const service = await ServiceModel.create(body);

  return sendResponse(reply, 201, true, "Service created", service);
};

export const getServices = async (req: FastifyRequest, reply: FastifyReply) => {
  const services = await ServiceModel.find().sort({ index: 1 });

  return sendResponse(reply, 200, true, "Services fetched", services);
};

export const updateService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as any;
  const body = req.body as any;

  const updated = await ServiceModel.findByIdAndUpdate(id, body, { new: true });

  if (!updated) {
    return sendResponse(reply, 404, false, "Service not found");
  }

  return sendResponse(reply, 200, true, "Service updated", updated);
};

export const deleteService = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as any;

  const deleted = await ServiceModel.findByIdAndDelete(id);

  if (!deleted) {
    return sendResponse(reply, 404, false, "Service not found");
  }

  return sendResponse(reply, 200, true, "Service deleted", deleted);
};



// PUBLIC: for user popup menu
export const getServicesWithSubServices = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const services = await ServiceModel.find({ isActive: true })
    .sort({ index: 1 })
    .select("index title slug")
    .lean();

  const serviceIds = services.map((s) => s._id);

  const subServices = await SubServiceModel.find({
    isActive: true,
    serviceId: { $in: serviceIds },
  })
    .sort({ order: 1 })
    .select("serviceId title slug")
    .lean();

  const map: Record<string, any[]> = {};

  subServices.forEach((sub) => {
    const sid = sub.serviceId.toString();
    if (!map[sid]) map[sid] = [];
    map[sid].push({
      _id: sub._id,
      title: sub.title,
      slug: sub.slug,
    });
  });

  const finalData = services.map((s) => ({
    _id: s._id,
    index: s.index,
    title: s.title,
    slug: s.slug,
    subServices: map[s._id.toString()] || [],
  }));

  return sendResponse(reply, 200, true, "Services menu fetched", finalData);
};


export const getServiceBySlug = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { slug } = req.params as any;

    const service = await ServiceModel.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

    if (!service) {
      return sendResponse(reply, 404, false, "Service not found");
    }

    return sendResponse(reply, 200, true, "Service fetched", service);
  } catch (err: any) {
    return sendResponse(reply, 500, false, err?.message || "Server error");
  }
};