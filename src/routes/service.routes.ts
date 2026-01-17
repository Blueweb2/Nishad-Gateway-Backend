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

export default async function serviceRoutes(app: FastifyInstance) {
  // Public
  app.get("/services", getServices);
 
  // PUBLIC menu route
  app.get("/services/menu", getServicesWithSubServices);
  // Public (get service by slug)
app.get("/services/slug/:slug", getServiceBySlug);


  // Admin Protected
  app.post("/services", { preHandler: [auth, adminOnly] }, createService);
  app.put("/services/:id", { preHandler: [auth, adminOnly] }, updateService);
  app.delete("/services/:id", { preHandler: [auth, adminOnly] }, deleteService);
}
