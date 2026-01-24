import { SubServiceContentModel } from "../models/SubServiceContent.model";
import { SubServiceModel } from "../models/SubService.model";
import { createError } from "../utils/errors";

export const getSubServiceContentService = async (subId: string) => {
  const content = await SubServiceContentModel.findOne({ subServiceId: subId });
  return content;
};

export const getSubServiceContentBySlugService = async (slug: string) => {
  const sub = await SubServiceModel.findOne({ slug });

  if (!sub) {
    throw createError(404, "Subservice not found");
  }

  const content = await SubServiceContentModel.findOne({
    subServiceId: sub._id,
  });

  return content;
};

export const upsertSubServiceContentService = async (subId: string, body: any) => {
  const updated = await SubServiceContentModel.findOneAndUpdate(
    { subServiceId: subId },
    { ...body, subServiceId: subId },
    { new: true, upsert: true }
  );

  return updated;
};
