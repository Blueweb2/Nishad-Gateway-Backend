import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model";

export const CityBlogService = {
  /* ======================================================
     ADMIN – GET BLOG BY CITY ID
  ====================================================== */
  async getByCityId(cityId: string) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return null;
    }

    return CityBlogModel.findOne({
      cityId: new mongoose.Types.ObjectId(cityId),
    }).lean();
  },

  /* ======================================================
     ADMIN – CREATE / UPDATE BLOG (UPSERT)
  ====================================================== */
  async upsert(
    cityId: string,
    sections: any[],
    status: "DRAFT" | "PUBLISHED" = "DRAFT"
  ) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      throw new Error("Invalid cityId");
    }

    const objectCityId = new mongoose.Types.ObjectId(cityId);

    return CityBlogModel.findOneAndUpdate(
      { cityId: objectCityId },
      {
        $set: {
          sections,
          status,
        },
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
     Only returns:
     - Active city
     - Published blog
     - Active sections
     - Sorted by order
  ====================================================== */
  async getByCitySlug(citySlug: string) {
    if (!citySlug || citySlug.trim().length === 0) {
      return null;
    }

    // 1️⃣ Find active city
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    // 2️⃣ Find published blog
    const blog = await CityBlogModel.findOne({
      cityId: city._id,
      status: "PUBLISHED",
    }).lean();

    if (!blog) return null;

    // 3️⃣ Filter only active sections and sort by order
    const filteredSections = (blog.sections || [])
      .filter((section: any) => section.isActive)
      .sort((a: any, b: any) => a.order - b.order);

    return {
      city,
      sections: filteredSections,
    };
  },
};