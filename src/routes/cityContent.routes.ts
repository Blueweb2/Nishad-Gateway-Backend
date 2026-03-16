import { FastifyInstance } from "fastify";
import * as CityContentController from "../controllers/cityContent.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function cityContentRoutes(app: FastifyInstance) {

  /* =====================================================
     ADMIN ROUTES
     Base: /admin
  ===================================================== */

  /* ---------- CATEGORY OVERVIEW ---------- */

  // Get category overview
  app.get(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.getCategoryOverview
  );

  // Create or Update overview
  app.post(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.upsertCategoryOverview
  );

  // Delete overview (optional)
  app.delete(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.deleteCategoryOverview
  );



  /* ---------- CATEGORY LISTINGS ---------- */

  // Get all listings for category
  app.get(
    "/admin/cities/:cityId/categories/:categoryId/listings",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.getCategoryListings
  );

  // Create new listing
  app.post(
    "/admin/cities/:cityId/categories/:categoryId/listings",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.createListing
  );

  // Get single listing
  app.get(
    "/admin/contents/:contentId",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.getCityContentById
  );

  // Update listing
  app.put(
    "/admin/contents/:contentId",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.updateCityContent
  );

  // Delete listing
  app.delete(
    "/admin/contents/:contentId",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.removeCityContent
  );



  /* ---------- FEATURED LISTINGS ---------- */

  // Toggle featured listing
  app.patch(
    "/admin/contents/:contentId/featured",
    {
      preHandler: [auth, adminOnly],
    },
    CityContentController.toggleFeatured
  );



  /* =====================================================
     PUBLIC ROUTES
     Base: /cities
  ===================================================== */

  /* ---------- CATEGORY PAGE ---------- */

  // Get category page (overview + listings)
app.get(
  "/public/cities/:citySlug/categories/:categorySlug",
  CityContentController.getPublicCategoryPage
);



  /* ---------- CATEGORY LISTINGS ---------- */

  // Get listings only (supports pagination)
  app.get(
    "/cities/:citySlug/categories/:categorySlug/listings",
    CityContentController.getPublicListings
  );



  /* ---------- FEATURED LISTINGS ---------- */

  // Get featured listings
  app.get(
    "/cities/:citySlug/categories/:categorySlug/featured",
    CityContentController.getFeaturedListings
  );

}