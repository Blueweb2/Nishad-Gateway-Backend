import { Types } from "mongoose";
import { CityContentModel } from "../models/cityContent.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";

/* ======================================================
   CREATE CONTENT
====================================================== */

export const createCityContentService = async (data: any) => {
  return await CityContentModel.create(data);
};

/* ======================================================
   GET CONTENTS BY CATEGORY ID (ADMIN)
====================================================== */

export const getContentsByCategoryIdService = async (categoryId: string) => {
  return await CityContentModel.find({
    categoryId: new Types.ObjectId(categoryId),
    isActive: true,
  })
    .sort({ order: 1 })
    .lean();
};

/* ======================================================
   GET CONTENTS BY CITY + CATEGORY (PUBLIC)
====================================================== */

export const getCityContentsService = async (
  citySlug: string,
  categorySlug: string
) => {
  const city = await CityModel.findOne({
    citySlug,
    isActive: true,
  }).lean();

  if (!city) throw new Error("City not found");

  const category = await CityCategoryModel.findOne({
    cityId: city._id,
    slug: categorySlug,
    isActive: true,
  }).lean();

  if (!category) throw new Error("Category not found");

  const result = await CityContentModel.aggregate([
    {
      $match: {
        cityId: city._id,
        categoryId: category._id,
        isActive: true,
      },
    },
    {
      $sort: { order: 1, createdAt: -1 },
    },
    {
      $facet: {
        overview: [{ $match: { type: "overview" } }, { $limit: 1 }],
        places: [{ $match: { type: "place" } }],
        listings: [{ $match: { type: "listing" } }],
        articles: [{ $match: { type: "article" } }],
      },
    },
  ]);

  const data = result[0];

  return {
    city,
    category,
    overview: data.overview[0] || null,
    places: data.places,
    listings: data.listings,
    articles: data.articles,
  };
};

/* ======================================================
   GET SINGLE CONTENT BY SLUG
====================================================== */

export const getContentBySlugService = async (slug: string) => {
  return await CityContentModel.findOne({
    slug,
    isActive: true,
  })
    .populate("cityId", "cityName citySlug")
    .populate("categoryId", "name slug")
    .lean();
};

/* ======================================================
   UPDATE CONTENT
====================================================== */

export const updateCityContentService = async (
  contentId: string,
  data: any
) => {
  return await CityContentModel.findByIdAndUpdate(contentId, data, {
    new: true,
  }).lean();
};

/* ======================================================
   DELETE CONTENT
====================================================== */

export const deleteCityContentService = async (contentId: string) => {
  return await CityContentModel.findByIdAndDelete(contentId);
};