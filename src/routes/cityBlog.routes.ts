import { FastifyInstance } from "fastify";
import { CityBlogController } from "../controllers/cityBlog.controller";
import { updateCityBlogSchema } from "../schemas/cityBlog.schema";

export default async function cityBlogRoutes(app: FastifyInstance) {



    // USER – get blog by city slug (public)
app.get(
"/cities/slug/:citySlug/blog",
CityBlogController.getByCitySlug
);

  // Admin – get blog for city (used by /admin/cities/blog/[id])
  app.get(
    "/cities/id/:id/blog",
    CityBlogController.getByCityId
  );

  // Admin – create/update full blog (save sections array)
  app.put(
    "/cities/id/:id/blog",
    { schema: updateCityBlogSchema },
    CityBlogController.upsert
  );
}