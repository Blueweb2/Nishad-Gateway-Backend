import { ServiceModel } from "../models/Service.model";
import { SubServiceModel } from "../models/SubService.model";
import { createError } from "../utils/errors";

export const createServiceService = async (body: any) => {
  const service = await ServiceModel.create(body);
  return service;
};

export const getServicesService = async () => {
  const services = await ServiceModel.find().sort({ index: 1 });
  return services;
};

export const updateServiceService = async (id: string, body: any) => {
  const updated = await ServiceModel.findByIdAndUpdate(id, body, { new: true });

  if (!updated) {
    throw createError(404, "Service not found");
  }

  return updated;
};

export const deleteServiceService = async (id: string) => {
  const deleted = await ServiceModel.findByIdAndDelete(id);

  if (!deleted) {
    throw createError(404, "Service not found");
  }

  return deleted;
};

// PUBLIC: for popup menu
export const getServicesWithSubServicesService = async () => {
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

  return finalData;
};

export const getServiceBySlugService = async (slug: string) => {
  const service = await ServiceModel.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  });

  if (!service) {
    throw createError(404, "Service not found");
  }

  return service;
};
