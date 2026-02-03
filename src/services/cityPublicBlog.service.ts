import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";
import { CityBlogPostModel } from "../models/cityBlogPost.model";

export const CityPublicBlogService = {

  async getCategoryBlogs(citySlug: string, categorySlug: string) {
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

    const blogs = await CityBlogPostModel.find({
      cityId: city._id,
      categoryId: category._id,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .select("title slug excerpt coverImage createdAt")
      .lean();

    return {
      city,
      category,
      blogs,
    };
  },

  async getSingleBlog(
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
      city,
      category,
      blog,
    };
  },
};
