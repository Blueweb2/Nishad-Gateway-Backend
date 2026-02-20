import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { CityBlogPostController } from "../controllers/cityBlogPost.controller";
import { CityBlogPostModel } from "../models/cityBlogPost.model";

import {
  createCityBlogPostSchema,
  updateCityBlogPostSchema,
  publicCityBlogPostParamsSchema,
} from "../schemas/cityBlogPost.schema";

import { idParamSchema } from "../schemas/common.params";
import { slugSchema } from "../schemas/common.slug";

export default async function cityBlogPostRoutes(app: FastifyInstance) {
  /* ======================================================
     PUBLIC ROUTES
  ====================================================== */

  /**
   * GET CATEGORY BLOG LIST
   * /cities/:citySlug/:categorySlug
   * (Must come BEFORE single blog route)
   */
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

  /**
   * GET SINGLE BLOG
   * /cities/:citySlug/:categorySlug/:blogSlug
   */
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

      const urls = blogs
        .map((blog) => {
          const lastMod = blog.updatedAt
            ? new Date(blog.updatedAt).toISOString()
            : new Date().toISOString();

          return `
    <url>
      <loc>${process.env.CLIENT_URL}/cities/${blog.citySlug}/${blog.categorySlug}/${blog.slug}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
        })
        .join("");

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
        message: "Failed to generate sitemap",
      });
    }
  });

  /* ======================================================
     ADMIN ROUTES
  ====================================================== */

  /**
   * CREATE BLOG
   */
  app.post(
    "/admin/cities/:cityId/categories/:categoryId/blogs",
    {
      preHandler: [auth, adminOnly],
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

  /**
   * GET BLOGS BY CATEGORY (ADMIN)
   */
  app.get(
    "/admin/cities/:cityId/categories/:categoryId/blogs",
    {
      preHandler: [auth, adminOnly],
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

  /**
   * GET SINGLE BLOG (ADMIN)
   */
  app.get(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: [auth, adminOnly],
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

  /**
   * UPDATE BLOG
   */
  app.put(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: [auth, adminOnly],
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

  /**
   * DELETE BLOG
   */
  app.delete(
    "/admin/cities/:cityId/categories/:categoryId/blogs/:blogId",
    {
      preHandler: [auth, adminOnly],
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
