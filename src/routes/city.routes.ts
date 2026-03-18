import { FastifyInstance } from "fastify";
import { CityController } from "../controllers/city.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

import { IdRoute, CitySlugRoute } from "../types/routes.types";

import {
  createCitySchema,
  updateCitySchema,
  getCityByIdSchema,
} from "../schemas/city.schema";

export default async function cityRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get("/cities", CityController.getPublic);

  app.get<CitySlugRoute>(
    "/cities/slug/:citySlug",
    CityController.getBySlug
  );

  /* ================= ADMIN ================= */

  app.get(
    "/admin/cities",
    { preHandler: adminAccess },
    CityController.getAllAdmin
  );

  app.post(
    "/admin/cities",
    {
      preHandler: adminAccess,
      schema: createCitySchema,
    },
    CityController.create
  );

  app.get<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: adminAccess,
      schema: getCityByIdSchema,
    },
    CityController.getById
  );

  app.put<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: adminAccess,
      schema: updateCitySchema,
    },
    CityController.update
  );

  app.delete<IdRoute>(
    "/admin/cities/:id",
    {
      preHandler: adminAccess,
      schema: getCityByIdSchema,
    },
    CityController.remove
  );

}