import { FastifyInstance } from "fastify";
import { CityBlogController } from "../controllers/cityBlog.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  updateCityBlogSchema,
  citySlugParamSchema,
} from "../schemas/cityBlog.schema";

import { idParamSchema } from "../schemas/common.params";

import {
  IdRoute,
  CitySlugRoute,
  CityBlogUpsertRoute,
} from "../types/fastify";

export default async function cityBlogRoutes(app: FastifyInstance) {

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
    "/cities/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: { params: idParamSchema },
    },
    CityBlogController.getByCityId
  );

  app.put<CityBlogUpsertRoute>(
    "/cities/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: updateCityBlogSchema,
    },
    CityBlogController.upsert
  );
}
