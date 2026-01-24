import { FastifyInstance } from "fastify";
import {
  createSubService,
  deleteSubService,
  getSubServicesByService,
  updateSubService,
} from "../controllers/subservice.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  getSubServicesByServiceSchema,
  createSubServiceSchema,
  updateSubServiceSchema,
  deleteSubServiceSchema,
} from "../schemas/subservice.schema";

export default async function subserviceRoutes(app: FastifyInstance) {
  // ✅ Public
  app.get(
    "/services/:serviceId/subservices",
    { schema: getSubServicesByServiceSchema },
    getSubServicesByService
  );

  // ✅ Admin Protected
  app.post(
    "/services/:serviceId/subservices",
    { preHandler: [auth, adminOnly], schema: createSubServiceSchema },
    createSubService
  );

  app.put(
    "/subservices/:subId",
    { preHandler: [auth, adminOnly], schema: updateSubServiceSchema },
    updateSubService
  );

  app.delete(
    "/subservices/:subId",
    { preHandler: [auth, adminOnly], schema: deleteSubServiceSchema },
    deleteSubService
  );
}
