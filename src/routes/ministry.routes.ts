import { FastifyInstance } from "fastify";

import {
  createMinistry,
  getMinistries,
  getMinistryBySlug,
  updateMinistry,
  deleteMinistry,
} from "../controllers/ministry.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function ministryRoutes(app: FastifyInstance) {
  // Public
  app.get("/ministries", getMinistries);
  app.get("/ministries/:slug", getMinistryBySlug);

  // Admin
  app.post(
    "/ministries",
    { preHandler: [auth, adminOnly] },
    createMinistry
  );

  app.put(
    "/ministries/:id",
    { preHandler: [auth, adminOnly] },
    updateMinistry
  );

  app.delete(
    "/ministries/:id",
    { preHandler: [auth, adminOnly] },
    deleteMinistry
  );
}