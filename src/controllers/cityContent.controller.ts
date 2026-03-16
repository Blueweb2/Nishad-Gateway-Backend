import { FastifyReply, FastifyRequest } from "fastify";
import * as CityContentService from "../services/cityContent.service";

/* ======================================================
   CATEGORY OVERVIEW
====================================================== */

export const getCategoryOverview = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { cityId, categoryId } = req.params as any;

    const overview = await CityContentService.getCategoryOverviewService(
      cityId,
      categoryId
    );

    return reply.send({ overview });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const upsertCategoryOverview = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { cityId, categoryId } = req.params as any;
    const payload = req.body;

    const overview = await CityContentService.upsertCategoryOverviewService(
      cityId,
      categoryId,
      payload
    );

    return reply.send({
      message: "Overview saved successfully",
      overview,
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const deleteCategoryOverview = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { cityId, categoryId } = req.params as any;

    await CityContentService.deleteCategoryOverviewService(
      cityId,
      categoryId
    );

    return reply.send({
      message: "Overview deleted",
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

/* ======================================================
   ADMIN LISTINGS
====================================================== */

export const getCategoryListings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { cityId, categoryId } = req.params as any;

    const listings = await CityContentService.getCategoryListingsService(
      cityId,
      categoryId
    );

    return reply.send({ listings });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const createListing = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { cityId, categoryId } = req.params as any;
    const payload = req.body;

    const listing = await CityContentService.createListingService(
      cityId,
      categoryId,
      payload
    );

    return reply.code(201).send({
      message: "Listing created successfully",
      listing,
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const getCityContentById = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as any;

    const content =
      await CityContentService.getCityContentByIdService(contentId);

    if (!content) {
      return reply.code(404).send({
        message: "Content not found",
      });
    }

    return reply.send({ content });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const updateCityContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as any;
    const payload = req.body;

    const content = await CityContentService.updateCityContentService(
      contentId,
      payload
    );

    return reply.send({
      message: "Content updated successfully",
      content,
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const removeCityContent = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as any;

    await CityContentService.deleteCityContentService(contentId);

    return reply.send({
      message: "Content deleted successfully",
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const toggleFeatured = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as any;

    const listing =
      await CityContentService.toggleFeaturedService(contentId);

    return reply.send({
      message: "Featured status updated",
      listing,
    });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

/* ======================================================
   PUBLIC CATEGORY PAGE
====================================================== */

export const getPublicCategoryPage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { citySlug, categorySlug } = req.params as any;

    const data =
      await CityContentService.getPublicCategoryPageService(
        citySlug,
        categorySlug
      );

    return reply.send(data);
  } catch (error: any) {
    return reply.code(404).send({ message: error.message });
  }
};

/* ======================================================
   PUBLIC LISTINGS
====================================================== */

export const getPublicListings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { citySlug, categorySlug } = req.params as any;

    const { page = 1, limit = 12 } = req.query as any;

    const data =
      await CityContentService.getPublicListingsService(
        citySlug,
        categorySlug,
        Number(page),
        Number(limit)
      );

    return reply.send(data);
  } catch (error: any) {
    return reply.code(404).send({ message: error.message });
  }
};

/* ======================================================
   FEATURED LISTINGS
====================================================== */

export const getFeaturedListings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { citySlug, categorySlug } = req.params as any;

    const listings =
      await CityContentService.getFeaturedListingsService(
        citySlug,
        categorySlug
      );

    return reply.send({ listings });
  } catch (error: any) {
    return reply.code(404).send({ message: error.message });
  }
};