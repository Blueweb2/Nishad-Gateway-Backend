import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model";

export const CityService = {
  async createCity(data: any) {
    // 1️⃣ Create city
    const city = await CityModel.create(data);

    // 2️⃣ Auto-create empty blog
    await CityBlogModel.create({
      cityId: city._id,
      sections: [],
      status: "DRAFT",
    });

    return city;
  },
};

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
  async upsert(
    cityId: string,
    sections: any[],
    status: "DRAFT" | "PUBLISHED" = "DRAFT"
  ) {
    return CityBlogModel.findOneAndUpdate(
      { cityId: new mongoose.Types.ObjectId(cityId) },
      {
        cityId: new mongoose.Types.ObjectId(cityId),
        sections,
        status,
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

    // 2️⃣ Find ONLY PUBLISHED blog
    const blog = await CityBlogModel.findOne({
      cityId: city._id,
      status: "PUBLISHED",
    }).lean();

    if (!blog) return null;

    // 3️⃣ Return combined response
    return {
      city,
      sections: blog.sections || [],
    };
  },
};