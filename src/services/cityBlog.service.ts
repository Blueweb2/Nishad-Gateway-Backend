import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";
import { CityBlogPostModel } from "../models/cityBlogPost.model";

export const CityBlogService = {

  /* ======================================================
     ADMIN – GET BLOG (CMS SECTIONS)
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
     ADMIN – UPSERT CMS BLOG
  ====================================================== */

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

  /* ======================================================
     PUBLIC – GET CITY PAGE (SECTIONS + CATEGORIES)
  ====================================================== */

  async getByCitySlug(citySlug: string) {
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    const blog = await CityBlogModel.findOne({
      cityId: city._id,
      status: "PUBLISHED",
    }).lean();

    if (!blog) return null;

    const categories = await CityCategoryModel.find({
      cityId: city._id,
      isActive: true,
    })
      .sort({ order: 1 })
      .select("name slug")
      .lean();

    return {
      city: {
        _id: city._id,
        cityName: city.cityName,
        citySlug: city.citySlug,
      },
      sections: blog.sections,
      categories,
      status: blog.status,
    };
  },

  /* ======================================================
     PUBLIC – GET BLOG DETAIL
     /cities/:citySlug/:categorySlug/:blogSlug
  ====================================================== */

  async getPublicBlogDetail(
    citySlug: string,
    categorySlug: string,
    blogSlug: string
  ) {
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    const category = await CityCategoryModel.findOne({
      cityId: city._id,
      slug: categorySlug,
      isActive: true,
    }).lean();

    if (!category) return null;

    const blog = await CityBlogPostModel.findOne({
      cityId: city._id,
      categoryId: category._id,
      slug: blogSlug,
      isPublished: true,
    }).lean();

    if (!blog) return null;

    return {
      city: {
        cityName: city.cityName,
        citySlug: city.citySlug,
      },
      category: {
        name: category.name,
        slug: category.slug,
      },
      blog,
    };
  },

};
