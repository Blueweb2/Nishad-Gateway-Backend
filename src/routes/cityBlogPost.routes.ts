import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { CityBlogPostController } from "../controllers/cityBlogPost.controller";
import { CityBlogPostModel } from "../models/cityBlogPost.model";

import {
  createCityBlogPostSchema,
  updateCityBlogPostSchema,
  publicCityBlogPostParamsSchema,
} from "../schemas/cityBlogPost.schema";

import { idParamSchema } from "../schemas/common.params";
import { slugSchema } from "../schemas/common.slug";
import { env } from "../config/env";

export default async function cityBlogPostRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ======================================================
     PUBLIC ROUTES
  ====================================================== */

  app.get(
    "/cities/:citySlug/:categorySlug",
    {
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["citySlug", "categorySlug"],
          properties: {
            citySlug: slugSchema,
            categorySlug: slugSchema,
          },
        },
      },
    },
    CityBlogPostController.getPublicCategoryBlogs
  );

  app.get(
    "/cities/:citySlug/:categorySlug/:blogSlug",
    {
      schema: {
        params: publicCityBlogPostParamsSchema,
      },
    },
    CityBlogPostController.getPublicBlogDetail
  );

  /* ======================================================
     SITEMAP
  ====================================================== */

  app.get("/sitemap.xml", async (req, reply) => {
    try {
      const blogs = await CityBlogPostModel.find(
        { isPublished: true },
        "citySlug categorySlug slug updatedAt"
      ).lean();

      const urls = blogs.map((blog) => {
        const lastMod = blog.updatedAt
          ? new Date(blog.updatedAt).toISOString()
          : new Date().toISOString();

        return `
<url>
  <loc>${env.CLIENT_URL}/cities/${blog.citySlug}/${blog.categorySlug}/${blog.slug}</loc>
  <lastmod>${lastMod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
      }).join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

      return reply
        .code(200)
        .header("Content-Type", "application/xml")
        .send(xml);

    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({
        success: false,
        message: "Failed to generate sitemap",
      });
    }
  });

  /* ======================================================
     ADMIN ROUTES
  ====================================================== */

  app.post(
    "/admin/cities/:cityId/categories/:categoryId/blogs",
    {
      preHandler: adminAccess,
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
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

  app.get(
    "/admin/cities/:cityId/categories/:categoryId/blogs",
    {
      preHandler: adminAccess,
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["cityId", "categoryId"],
          properties: {
            cityId: idParamSchema.properties.id,
            categoryId: idParamSchema.properties.id,
          },
        },
      },
    },
    CityBlogPostController.getByCategoryAdmin
  );

  app.get(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: adminAccess,
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["cityId", "categoryId", "blogId"],
          properties: {
            cityId: idParamSchema.properties.id,
            categoryId: idParamSchema.properties.id,
            blogId: idParamSchema.properties.id,
          },
        },
      },
    },
    CityBlogPostController.getSingleAdmin
  );

  app.put(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: adminAccess,
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["cityId", "categoryId", "blogId"],
          properties: {
            cityId: idParamSchema.properties.id,
            categoryId: idParamSchema.properties.id,
            blogId: idParamSchema.properties.id,
          },
        },
        body: updateCityBlogPostSchema,
      },
    },
    CityBlogPostController.update
  );

  app.delete(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: adminAccess,
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["cityId", "categoryId", "blogId"],
          properties: {
            cityId: idParamSchema.properties.id,
            categoryId: idParamSchema.properties.id,
            blogId: idParamSchema.properties.id,
          },
        },
      },
    },
    CityBlogPostController.remove
  );
}