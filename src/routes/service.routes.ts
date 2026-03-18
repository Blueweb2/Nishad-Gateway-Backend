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
import { authorize } from "../middlewares/authorize";

import {
  createServiceSchema,
  updateServiceSchema,
  getServiceBySlugSchema,
  deleteServiceSchema,
} from "../schemas/service.schema";

export default async function serviceRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get("/services", getServices);

  app.get("/services/menu", getServicesWithSubServices);

  app.get(
    "/services/slug/:slug",
    { schema: getServiceBySlugSchema },
    getServiceBySlug
  );

  /* ================= ADMIN ================= */

  app.post(
    "/services",
    {
      preHandler: adminAccess,
      schema: createServiceSchema,
    },
    createService
  );

  app.put(
    "/services/:id",
    {
      preHandler: adminAccess,
      schema: updateServiceSchema,
    },
    updateService
  );

  app.delete(
    "/services/:id",
    {
      preHandler: adminAccess,
      schema: deleteServiceSchema,
    },
    deleteService
  );
}