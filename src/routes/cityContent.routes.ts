import { FastifyInstance } from "fastify";
import * as CityContentController from "../controllers/cityContent.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  createCityContentSchema,
  updateCityContentSchema,
} from "../schemas/cityContent.schema";

export default async function cityContentRoutes(app: FastifyInstance) {

  /* PUBLIC */

  app.get(
    "/cities/:citySlug/categories/:categorySlug/contents",
    CityContentController.getByCategorySlug
  );

  app.get(
    "/cities/:citySlug/categories/:categorySlug/contents/:slug",
    CityContentController.getBySlug
  );

  /* ADMIN */

  app.get(
    "/admin/categories/:categoryId/contents",
    { preHandler: [auth, adminOnly] },
    CityContentController.getByCategoryId
  );

  app.post(
    "/admin/categories/:categoryId/contents",
    {
      preHandler: [auth, adminOnly],
      schema: createCityContentSchema,
    },
    CityContentController.createCityContent
  );

  app.put(
    "/admin/contents/:contentId",
    {
      preHandler: [auth, adminOnly],
      schema: updateCityContentSchema,
    },
    CityContentController.updateCityContent
  );

  app.delete(
    "/admin/contents/:contentId",
    { preHandler: [auth, adminOnly] },
    CityContentController.removeCityContent
  );
}