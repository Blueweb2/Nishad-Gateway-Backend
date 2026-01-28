import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model"; // ✅ REQUIRED

export const CityBlogService = {
  /* ======================================================
     ADMIN – GET BLOG BY CITY ID
  ====================================================== */
  async getByCityId(cityId: string) {
    return CityBlogModel.findOne({
      cityId: new mongoose.Types.ObjectId(cityId),
    }).lean();
  },

  /* ======================================================
     ADMIN – UPSERT BLOG BY CITY ID
  ====================================================== */
  async upsert(cityId: string, sections: any[]) {
    return CityBlogModel.findOneAndUpdate(
      { cityId: new mongoose.Types.ObjectId(cityId) },
      {
        cityId: new mongoose.Types.ObjectId(cityId),
        sections,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    ).lean();
  },

  /* ======================================================
     USER – GET BLOG BY CITY SLUG (PUBLIC)
  ====================================================== */
  async getByCitySlug(citySlug: string) {
    // 1️⃣ Find city by slug
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    // 2️⃣ Find blog using cityId
    const blog = await CityBlogModel.findOne({
      cityId: city._id,
    }).lean();

    // 3️⃣ Return combined response
    return {
      city,
      sections: blog?.sections || [],
    };
  },
};