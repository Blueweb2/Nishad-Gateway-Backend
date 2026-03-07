import { FastifyInstance } from "fastify";

import {
  createMinistry,
  getMinistries,
  getMinistryBySlug,
  updateMinistry,
  deleteMinistry,
  getMinistryById   // ⭐ add this
} from "../controllers/ministry.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  createMinistrySchema,
  updateMinistrySchema
} from "../schemas/ministry.schema";

export default async function ministryRoutes(app: FastifyInstance) {

  // Public
  app.get("/ministries", getMinistries);


  // ⭐ Needed for admin editor
  app.get(
    "/ministries/by-id/:id",
    {
      preHandler: [auth, adminOnly],
    },
    getMinistryById
  );

    app.get("/ministries/:slug", getMinistryBySlug);

  // Admin
  app.post(
    "/ministries",
    {
      preHandler: [auth, adminOnly],
      schema: createMinistrySchema,
    },
    createMinistry
  );

  app.put(
    "/ministries/:id",
    {
      preHandler: [auth, adminOnly],
      schema: updateMinistrySchema,
    },
    updateMinistry
  );

  app.delete(
    "/ministries/:id",
    {
      preHandler: [auth, adminOnly],
    },
    deleteMinistry
  );
}