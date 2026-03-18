import { FastifyInstance } from "fastify";
import {
  createSubService,
  deleteSubService,
  getSubServicesByService,
  updateSubService,
} from "../controllers/subservice.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

import {
  getSubServicesByServiceSchema,
  createSubServiceSchema,
  updateSubServiceSchema,
  deleteSubServiceSchema,
} from "../schemas/subservice.schema";

export default async function subserviceRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get(
    "/services/:serviceId/subservices",
    { schema: getSubServicesByServiceSchema },
    getSubServicesByService
  );

  /* ================= ADMIN ================= */

  app.post(
    "/services/:serviceId/subservices",
    {
      preHandler: adminAccess,
      schema: createSubServiceSchema,
    },
    createSubService
  );

  app.put(
    "/subservices/:subId",
    {
      preHandler: adminAccess,
      schema: updateSubServiceSchema,
    },
    updateSubService
  );

  app.delete(
    "/subservices/:subId",
    {
      preHandler: adminAccess,
      schema: deleteSubServiceSchema,
    },
    deleteSubService
  );
}