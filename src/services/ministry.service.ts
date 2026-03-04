import { MinistryModel } from "../models/Ministry.model";

export const createMinistryService = async (data: any) => {
  const exists = await MinistryModel.findOne({ slug: data.slug });

  if (exists) {
    throw { statusCode: 409, message: "Slug already exists" };
  }

  return MinistryModel.create(data);
};

export const getMinistriesService = async () => {
  return MinistryModel.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getMinistryBySlugService = async (slug: string) => {
  return MinistryModel.findOne({ slug, isActive: true });
};

export const updateMinistryService = async (
  id: string,
  data: any
) => {
  return MinistryModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMinistryService = async (id: string) => {
  return MinistryModel.findByIdAndDelete(id);
};