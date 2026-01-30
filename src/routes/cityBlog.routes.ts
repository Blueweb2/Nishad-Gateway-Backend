import { FastifyInstance } from "fastify";
import { CityBlogController } from "../controllers/cityBlog.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  updateCityBlogSchema,
  cityIdParamSchema,
  citySlugParamSchema,
} from "../schemas/cityBlog.schema";

import {
  IdRoute,
  CitySlugRoute,
  CityBlogUpsertRoute,
} from "../types/fastify";


export default async function cityBlogRoutes(app: FastifyInstance) {



  /* =========================================
     PUBLIC – Get Published Blog by Slug
  ========================================= */
  app.get<CitySlugRoute>(
    "/cities/slug/:citySlug/blog",
    { schema: { params: citySlugParamSchema } },
    CityBlogController.getByCitySlug
  );

  /* =========================================
     ADMIN – Get Blog by City ID
  ========================================= */
  app.get<IdRoute>(
    "/cities/id/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: { params: cityIdParamSchema },
    },
    CityBlogController.getByCityId
  );

  /* =========================================
     ADMIN – Create / Update Blog
  ========================================= */
  app.put<CityBlogUpsertRoute>(
    "/cities/id/:id/blog",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: cityIdParamSchema,
        body: updateCityBlogSchema.body,
      },
    },
    CityBlogController.upsert
  );
}

