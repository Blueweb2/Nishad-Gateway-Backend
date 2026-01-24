import { FastifyInstance } from "fastify";
import {
  createService,
  deleteService,
  getServices,
  getServicesWithSubServices,
  updateService,
  getServiceBySlug,
} from "../controllers/service.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import {
  createServiceSchema,
  updateServiceSchema,
  getServiceBySlugSchema,
  deleteServiceSchema,
} from "../schemas/service.schema";

export default async function serviceRoutes(app: FastifyInstance) {
  // Public
  app.get("/services", getServices);
 
  // PUBLIC menu route
  app.get("/services/menu", getServicesWithSubServices);
  // Public (get service by slug)
app.get("/services/slug/:slug", { schema: getServiceBySlugSchema }, getServiceBySlug);


  // Admin Protected
  app.post("/services", { preHandler: [auth, adminOnly], schema: createServiceSchema }, createService);
  app.put("/services/:id", { preHandler: [auth, adminOnly], schema: updateServiceSchema }, updateService);
app.delete(
  "/services/:id",
  { preHandler: [auth, adminOnly], schema: deleteServiceSchema },
  deleteService
);
}
