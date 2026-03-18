import { FastifyInstance } from "fastify";

import {
  createMinistry,
  getMinistries,
  getMinistryBySlug,
  updateMinistry,
  deleteMinistry,
  getMinistryById
} from "../controllers/ministry.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

import {
  createMinistrySchema,
  updateMinistrySchema
} from "../schemas/ministry.schema";

export default async function ministryRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get("/ministries", getMinistries);

  app.get("/ministries/:slug", getMinistryBySlug);

  /* ================= ADMIN ================= */

  // ⭐ Needed for admin editor
  app.get(
    "/ministries/by-id/:id",
    {
      preHandler: adminAccess,
    },
    getMinistryById
  );

  app.post(
    "/ministries",
    {
      preHandler: adminAccess,
      schema: createMinistrySchema,
    },
    createMinistry
  );

  app.put(
    "/ministries/:id",
    {
      preHandler: adminAccess,
      schema: updateMinistrySchema,
    },
    updateMinistry
  );

  app.delete(
    "/ministries/:id",
    {
      preHandler: adminAccess,
    },
    deleteMinistry
  );
}