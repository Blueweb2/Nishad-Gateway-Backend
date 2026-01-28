import { FastifyInstance } from "fastify";
import { CityController } from "../controllers/city.controller";
import {
  createCitySchema,
  updateCitySchema,
} from "../schemas/city.schema";

export default async function cityRoutes(app: FastifyInstance) {

  /* ---------- PUBLIC ---------- */

  app.get("/cities", CityController.getAll);

  // Slug-based (public)
  app.get("/cities/slug/:citySlug", CityController.getBySlug);

  /* ---------- ADMIN ---------- */

  app.post(
    "/cities",
    { schema: createCitySchema },
    CityController.create
  );

  app.get(
    "/cities/id/:id",
    CityController.getById
  );

  app.put(
    "/cities/id/:id",
    { schema: updateCitySchema },
    CityController.update
  );

  app.delete(
    "/cities/id/:id",
    CityController.remove
  );
}