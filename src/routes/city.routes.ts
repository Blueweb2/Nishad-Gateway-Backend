import { FastifyInstance } from "fastify";
import { CityController } from "../controllers/city.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { IdRoute, CitySlugRoute } from "../types/routes.types";



import {
  createCitySchema,
  updateCitySchema,
  getCityByIdSchema,
} from "../schemas/city.schema";

export default async function cityRoutes(app: FastifyInstance) {

  /* ================= PUBLIC ================= */

  app.get("/cities", CityController.getPublic);

  app.get<CitySlugRoute>(
    "/cities/slug/:citySlug",
    CityController.getBySlug
  );




  /* ================= ADMIN ================= */

  app.get(
    "/admin/cities",
    { preHandler: [auth, adminOnly] },
    CityController.getAllAdmin
  );

  app.post(
    "/admin/cities",
    {
      preHandler: [auth, adminOnly],
      schema: createCitySchema,
    },
    CityController.create
  );

  app.get<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: [auth, adminOnly],
      schema: getCityByIdSchema,
    },
    CityController.getById
  );

  app.put<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: [auth, adminOnly],
      schema: updateCitySchema,
    },
    CityController.update
  );

  app.delete<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: [auth, adminOnly],
      schema: getCityByIdSchema,
    },
    CityController.remove
  );

}