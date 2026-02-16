import { FastifyInstance } from "fastify";
import { CityBlogController } from "../controllers/cityBlog.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  updateCityBlogSchema,
  citySlugParamSchema,
} from "../schemas/cityBlog.schema";

import { idParamSchema } from "../schemas/common.params";
import { CityPublicBlogController } from "../controllers/cityPublicBlog.controller";


import {
  IdRoute,
  CitySlugRoute,
  CityBlogUpsertRoute,
} from "../types/routes.types";

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
    "/admin/cities/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: { params: idParamSchema },
    },
    CityBlogController.getByCityId
  );

  app.put<CityBlogUpsertRoute>(
    "/admin/cities/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: updateCityBlogSchema,
    },
    CityBlogController.upsert
  );

  /* ================= PUBLIC CATEGORY ================= */

app.get(
  "/cities/:citySlug/:categorySlug",
  CityPublicBlogController.getCategoryBlogs
);

app.get(
  "/cities/:citySlug/:categorySlug/:blogSlug",
  CityPublicBlogController.getSingleBlog
);

}
