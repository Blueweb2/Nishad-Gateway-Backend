import { FastifyInstance } from "fastify";
import { CityController } from "../controllers/city.controller";

export default async function cityRoutes(app: FastifyInstance) {
  // Public
  app.get("/cities", CityController.getAll);
  app.get("/cities/:citySlug", CityController.getBySlug);

  // Admin (later protect with admin middleware)
  app.post("/cities", CityController.create);
  app.put("/cities/:id", CityController.update);
  app.delete("/cities/:id", CityController.remove);
}