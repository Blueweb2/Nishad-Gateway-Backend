import { FastifyInstance } from "fastify";
import { CityController } from "../controllers/city.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { IdRoute, CitySlugRoute } from "../types/fastify";



import {
  createCitySchema,
  updateCitySchema,
  getCityByIdSchema,
} from "../schemas/city.schema";

export default async function cityRoutes(app: FastifyInstance) {

  /* ================= PUBLIC ================= */

  app.get("/cities", CityController.getAll);

  app.get(
    "/cities/slug/:citySlug",
    CityController.getBySlug
  );

  /* ================= ADMIN ================= */

  app.post(
    "/cities",
    {
      preHandler: [auth, adminOnly],
      schema: createCitySchema,
    },
    CityController.create
  );

app.get<CitySlugRoute>(
  "/cities/slug/:citySlug",
  CityController.getBySlug
);

app.get<IdRoute>(
  "/cities/id/:id",
  {
    preHandler: [auth, adminOnly],
    schema: getCityByIdSchema,
  },
  CityController.getById
);

app.put<IdRoute>(
  "/cities/id/:id",
  {
    preHandler: [auth, adminOnly],
    schema: updateCitySchema,
  },
  CityController.update
);

app.delete<IdRoute>(
  "/cities/id/:id",
  {
    preHandler: [auth, adminOnly],
    schema: getCityByIdSchema,
  },
  CityController.remove
);
}