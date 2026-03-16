import { CityContentModel } from "../models/cityContent.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";

import slugify from "../utils/slugify";

/* ======================================================
   CATEGORY OVERVIEW
====================================================== */

export const getCategoryOverviewService = async (
  cityId: string,
  categoryId: string
) => {
  return await CityContentModel.findOne({
    cityId,
    categoryId,
    type: "overview",
  });
};

export const upsertCategoryOverviewService = async (
  cityId: string,
  categoryId: string,
  payload: any
) => {
  return await CityContentModel.findOneAndUpdate(
    {
      cityId,
      categoryId,
      type: "overview",
    },
    {
      ...payload,
      cityId,
      categoryId,
      type: "overview",
      status: "published"
    },
    {
      new: true,
      upsert: true,
    }
  );
};

export const deleteCategoryOverviewService = async (
  cityId: string,
  categoryId: string
) => {
  return await CityContentModel.deleteOne({
    cityId,
    categoryId,
    type: "overview",
  });
};

/* ======================================================
   ADMIN LISTINGS
====================================================== */

export const getCategoryListingsService = async (
  cityId: string,
  categoryId: string
) => {
  return await CityContentModel.find({
    cityId,
    categoryId,
    type: "listing",
  }).sort({ order: 1 });
};


/* ---------- CREATE LISTING WITH SAFE SLUG ---------- */

export const createListingService = async (
  cityId: string,
  categoryId: string,
  payload: any
) => {

  const baseSlug = slugify(payload.title);

  let slug = baseSlug;
  let counter = 1;

  // Prevent slug collision
  while (
    await CityContentModel.findOne({
      cityId,
      categoryId,
      slug
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return await CityContentModel.create({
    ...payload,
    cityId,
    categoryId,
    type: "listing",
    slug
  });
};


/* ---------- GET CONTENT BY ID ---------- */

export const getCityContentByIdService = async (contentId: string) => {
  return await CityContentModel.findById(contentId);
};


/* ---------- UPDATE CONTENT ---------- */

export const updateCityContentService = async (
  contentId: string,
  payload: any
) => {

  const content = await CityContentModel.findById(contentId);

  if (!content) {
    throw new Error("Content not found");
  }

  // If title changes → regenerate slug safely
  if (payload.title) {

    const baseSlug = slugify(payload.title);

    let slug = baseSlug;
    let counter = 1;

    while (
      await CityContentModel.findOne({
        cityId: content.cityId,
        categoryId: content.categoryId,
        slug,
        _id: { $ne: contentId }
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    payload.slug = slug;
  }

  return await CityContentModel.findByIdAndUpdate(contentId, payload, {
    new: true,
  });
};


/* ---------- DELETE CONTENT ---------- */

export const deleteCityContentService = async (contentId: string) => {
  return await CityContentModel.findByIdAndDelete(contentId);
};


/* ---------- FEATURED TOGGLE ---------- */

export const toggleFeaturedService = async (contentId: string) => {
  const listing = await CityContentModel.findById(contentId);

  if (!listing) {
    throw new Error("Listing not found");
  }

  listing.isFeatured = !listing.isFeatured;

  await listing.save();

  return listing;
};


/* ======================================================
   PUBLIC CATEGORY PAGE
====================================================== */

export const getPublicCategoryPageService = async (
  citySlug: string,
  categorySlug: string
) => {

  const city = await CityModel.findOne({ citySlug });

  if (!city) {
    throw new Error("City not found");
  }

  const category = await CityCategoryModel.findOne({
    cityId: city._id,
    slug: categorySlug,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const overview = await CityContentModel.findOne({
    cityId: city._id,
    categoryId: category._id,
    type: "overview",
    status: "published",
  });

  const listings = await CityContentModel.find({
    cityId: city._id,
    categoryId: category._id,
    type: "listing",
    status: "published",
  }).sort({ order: 1 });

  return {
    city,
    category,
    overview,
    listings,
  };
};


/* ======================================================
   PUBLIC LISTINGS
====================================================== */

export const getPublicListingsService = async (
  citySlug: string,
  categorySlug: string,
  page: number,
  limit: number
) => {

  const city = await CityModel.findOne({ citySlug });

  if (!city) {
    throw new Error("City not found");
  }

  const category = await CityCategoryModel.findOne({
    cityId: city._id,
    slug: categorySlug,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const listings = await CityContentModel.find({
    cityId: city._id,
    categoryId: category._id,
    type: "listing",
    status: "published",
  })
    .sort({ order: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await CityContentModel.countDocuments({
    cityId: city._id,
    categoryId: category._id,
    type: "listing",
    status: "published",
  });

  return {
    listings,
    total,
    page,
    limit,
  };
};


/* ======================================================
   FEATURED LISTINGS
====================================================== */

export const getFeaturedListingsService = async (
  citySlug: string,
  categorySlug: string
) => {

  const city = await CityModel.findOne({ citySlug });

  if (!city) {
    throw new Error("City not found");
  }

  const category = await CityCategoryModel.findOne({
    cityId: city._id,
    slug: categorySlug,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const listings = await CityContentModel.find({
    cityId: city._id,
    categoryId: category._id,
    type: "listing",
    status: "published",
    isFeatured: true,
  }).sort({ order: 1 });

  return listings;
};