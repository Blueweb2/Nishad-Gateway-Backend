import { FastifyInstance } from "fastify";
import {
  createSubService,
  deleteSubService,
  getSubServicesByService,
  updateSubService,
} from "../controllers/subservice.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function subserviceRoutes(app: FastifyInstance) {
  // Public
  app.get("/services/:serviceId/subservices", getSubServicesByService);

  // Admin Protected
  app.post(
    "/services/:serviceId/subservices",
    { preHandler: [auth, adminOnly] },
    createSubService
  );

  app.put(
    "/subservices/:subId",
    { preHandler: [auth, adminOnly] },
    updateSubService
  );

  app.delete(
    "/subservices/:subId",
    { preHandler: [auth, adminOnly] },
    deleteSubService
  );
}
