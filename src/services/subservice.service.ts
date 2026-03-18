import { SubServiceModel } from "../models/SubService.model";

// Create Subservice
export const createSubServiceService = async (data: any) => {
  const exists = await SubServiceModel.findOne({
    serviceId: data.serviceId,
    slug: data.slug,
  });

  if (exists) {
    throw { statusCode: 409, message: "Slug already exists" };
  }

  const created = await SubServiceModel.create(data);
  return created;
};

// Get Subservices by ServiceId
export const getSubServicesByServiceService = async (serviceId: string) => {
  const subservices = await SubServiceModel.find({ serviceId }).sort({
    order: 1,
  });

  return subservices;
};

//  Update Subservice
export const updateSubServiceService = async (subId: string, updateData: any) => {
  const existing = await SubServiceModel.findById(subId);

  if (!existing) {
    throw { statusCode: 404, message: "Subservice not found" };
  }

  // if slug updated → check duplicate
  if (updateData.slug) {
    const exists = await SubServiceModel.findOne({
      _id: { $ne: subId },
      serviceId: existing.serviceId,
      slug: updateData.slug,
    });

    if (exists) {
      throw { statusCode: 409, message: "Slug already exists" };
    }
  }

  const updated = await SubServiceModel.findByIdAndUpdate(subId, updateData, {
    new: true,
  });

  return updated;
};

// Delete Subservice
export const deleteSubServiceService = async (subId: string) => {
  const deleted = await SubServiceModel.findByIdAndDelete(subId);

  if (!deleted) {
    throw { statusCode: 404, message: "Subservice not found" };
  }

  return deleted;
};
