import { FastifyInstance } from "fastify";
import * as CityContentController from "../controllers/cityContent.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

export default async function cityContentRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* =====================================================
     ADMIN ROUTES
  ===================================================== */

  /* ---------- CATEGORY OVERVIEW ---------- */

  app.get(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    { preHandler: adminAccess },
    CityContentController.getCategoryOverview
  );

  app.post(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    { preHandler: adminAccess },
    CityContentController.upsertCategoryOverview
  );

  app.delete(
    "/admin/cities/:cityId/categories/:categoryId/overview",
    { preHandler: adminAccess },
    CityContentController.deleteCategoryOverview
  );

  /* ---------- CATEGORY LISTINGS ---------- */

  app.get(
    "/admin/cities/:cityId/categories/:categoryId/listings",
    { preHandler: adminAccess },
    CityContentController.getCategoryListings
  );

  app.post(
    "/admin/cities/:cityId/categories/:categoryId/listings",
    { preHandler: adminAccess },
    CityContentController.createListing
  );

  app.get(
    "/admin/contents/:contentId",
    { preHandler: adminAccess },
    CityContentController.getCityContentById
  );

  app.put(
    "/admin/contents/:contentId",
    { preHandler: adminAccess },
    CityContentController.updateCityContent
  );

  app.delete(
    "/admin/contents/:contentId",
    { preHandler: adminAccess },
    CityContentController.removeCityContent
  );

  /* ---------- FEATURED LISTINGS ---------- */

  app.patch(
    "/admin/contents/:contentId/featured",
    { preHandler: adminAccess },
    CityContentController.toggleFeatured
  );

  /* =====================================================
     PUBLIC ROUTES
  ===================================================== */

  app.get(
    "/public/cities/:citySlug/categories/:categorySlug",
    CityContentController.getPublicCategoryPage
  );

  app.get(
    "/cities/:citySlug/categories/:categorySlug/listings",
    CityContentController.getPublicListings
  );

  app.get(
    "/cities/:citySlug/categories/:categorySlug/featured",
    CityContentController.getFeaturedListings
  );
}