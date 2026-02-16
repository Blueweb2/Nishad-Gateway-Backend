import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { CityBlogPostController } from "../controllers/cityBlogPost.controller";

import {
  createCityBlogPostSchema,
  updateCityBlogPostSchema,
  publicCityBlogPostParamsSchema,
} from "../schemas/cityBlogPost.schema";

import { idParamSchema } from "../schemas/common.params";

export default async function cityBlogPostRoutes(app: FastifyInstance) {

  /* ================= PUBLIC ================= */

  // app.get(
  //   "/cities/:citySlug/:categorySlug/:blogSlug",
  //   {
  //     schema: {
  //       params: publicCityBlogPostParamsSchema,
  //     },
  //   },
  //   CityBlogPostController.getPublicBlogDetail
  // );

  /* ================= ADMIN ================= */

  app.post(
    "/admin/cities/:cityId/categories/:categoryId/blogs",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: {
          type: "object",
          required: ["cityId", "categoryId"],
          properties: {
            cityId: idParamSchema.properties.id,
            categoryId: idParamSchema.properties.id,
          },
        },
        body: createCityBlogPostSchema,
      },
    },
    CityBlogPostController.create
  );

  app.put(
    "/admin/blogs/:blogId",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: {
          type: "object",
          required: ["blogId"],
          properties: {
            blogId: idParamSchema.properties.id,
          },
        },
        body: updateCityBlogPostSchema,
      },
    },
    CityBlogPostController.update
  );

  app.delete(
    "/admin/blogs/:blogId",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: {
          type: "object",
          required: ["blogId"],
          properties: {
            blogId: idParamSchema.properties.id,
          },
        },
      },
    },
    CityBlogPostController.remove
  );
}
