import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model";

export const CityBlogService = {

  /* ================= ADMIN – GET BLOG ================= */

  async getByCityId(cityId: string) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return null;
    }

    return CityBlogModel.findOne({
      cityId: new mongoose.Types.ObjectId(cityId),
    }).lean();
  },

  /* ================= ADMIN – UPSERT ================= */

  async upsert(
    cityId: string,
    sections?: any[],
    status?: "DRAFT" | "PUBLISHED"
  ) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      throw new Error("Invalid cityId");
    }

    const objectCityId = new mongoose.Types.ObjectId(cityId);

    const updateData: any = {};

    if (sections !== undefined) {
      updateData.sections = sections;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    return CityBlogModel.findOneAndUpdate(
      { cityId: objectCityId },
      { $set: updateData },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    ).lean();
  },

  /* ================= PUBLIC – GET BY SLUG ================= */

async getByCitySlug(citySlug: string) {
  console.log("Incoming slug:", citySlug);

  const city = await CityModel.findOne({
    citySlug,
    isActive: true,
  }).lean();

  console.log("City found:", city);

  if (!city) return null;

  const blog = await CityBlogModel.findOne({
    cityId: city._id,
    status: "PUBLISHED",
  }).lean();

  console.log("Blog found:", blog);

  if (!blog) return null;

  return {
    city,
    sections: blog.sections,
  };
}

};
