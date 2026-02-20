import mongoose from "mongoose";
import { CityBlogPostModel } from "../models/cityBlogPost.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";

export const CityBlogPostService = {
  /* ======================================================
     PUBLIC – CATEGORY BLOGS
  ====================================================== */
  async getPublicCategoryBlogs(citySlug: string, categorySlug: string) {
    const city = await CityModel.findOne({
      slug: citySlug,
      isActive: true,
    }).lean();
    if (!city) return null;

    const category = await CityCategoryModel.findOne({
      cityId: city._id,
      slug: categorySlug,
      isActive: true,
    }).lean();
    if (!category) return null;

    const featured = await CityBlogPostModel.findOne({
      cityId: city._id,
      categoryId: category._id,
      isPublished: true,
      isFeatured: true,
    }).lean();

    const blogs = await CityBlogPostModel.find({
      cityId: city._id,
      categoryId: category._id,
      isPublished: true,
      ...(featured && { _id: { $ne: featured._id } }),
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      city: { cityName: city.cityName, slug: city.slug },
      category: { name: category.name, slug: category.slug },
      featured,
      blogs,
    };
  },

  /* ======================================================
     PUBLIC – BLOG DETAIL
  ====================================================== */
  async getPublicBlogDetail(
    citySlug: string,
    categorySlug: string,
    blogSlug: string
  ) {
    const city = await CityModel.findOne({
      slug: citySlug,
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

    const related = await CityBlogPostModel.find({
      cityId: city._id,
      categoryId: category._id,
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const recommended = await CityBlogPostModel.find({
      cityId: city._id,
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return {
      city: { cityName: city.cityName, slug: city.slug },
      category: { name: category.name, slug: category.slug },
      blog,
      related,
      recommended,
    };
  },

  /* ======================================================
     ADMIN – CREATE
  ====================================================== */
  async create(cityId: string, categoryId: string, payload: any) {
    if (
      !mongoose.Types.ObjectId.isValid(cityId) ||
      !mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      throw new Error("Invalid city or category ID");
    }

    const category = await CityCategoryModel.findOne({
      _id: categoryId,
      cityId,
    });

    if (!category) {
      throw new Error("Category does not belong to city");
    }

    return CityBlogPostModel.create({
      ...payload,
      cityId,
      categoryId,
    });
  },

  /* ======================================================
     ADMIN – UPDATE (SECURE)
  ====================================================== */
  async update(
    cityId: string,
    categoryId: string,
    blogId: string,
    payload: any
  ) {
    return CityBlogPostModel.findOneAndUpdate(
      { _id: blogId, cityId, categoryId },
      payload,
      { new: true, runValidators: true }
    ).lean();
  },

  /* ======================================================
     ADMIN – DELETE (SECURE)
  ====================================================== */
  async remove(
    cityId: string,
    categoryId: string,
    blogId: string
  ) {
    return CityBlogPostModel.findOneAndDelete({
      _id: blogId,
      cityId,
      categoryId,
    });
  },

  /* ======================================================
     ADMIN – GET BY CATEGORY
  ====================================================== */
  async getByCategoryAdmin(cityId: string, categoryId: string) {
    return CityBlogPostModel.find({ cityId, categoryId })
      .sort({ createdAt: -1 })
      .lean();
  },

  /* ======================================================
     ADMIN – GET SINGLE
  ====================================================== */
  async getById(cityId: string, categoryId: string, blogId: string) {
    return CityBlogPostModel.findOne({
      _id: blogId,
      cityId,
      categoryId,
    }).lean();
  },
};
