import { FastifyInstance } from "fastify";
import { CityBlogController } from "../controllers/cityBlog.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

import {
  updateCityBlogSchema,
  citySlugParamSchema,
} from "../schemas/cityBlog.schema";

import { idParamSchema } from "../schemas/common.params";

import {
  IdRoute,
  CitySlugRoute,
  CityBlogUpsertRoute,
} from "../types/routes.types";

export default async function cityBlogRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get<CitySlugRoute>(
    "/cities/slug/:citySlug/blog",
    {
      schema: { params: citySlugParamSchema },
    },
    CityBlogController.getByCitySlug
  );

  /* ================= ADMIN ================= */

  app.get<IdRoute>(
    "/admin/cities/:id/blog",
    {
      preHandler: adminAccess,
      schema: { params: idParamSchema },
    },
    CityBlogController.getByCityId
  );

  app.put<CityBlogUpsertRoute>(
    "/admin/cities/:id/blog",
    {
      preHandler: adminAccess,
      schema: updateCityBlogSchema,
    },
    CityBlogController.upsert
  );

}