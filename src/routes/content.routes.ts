import { FastifyInstance } from "fastify";
import {
  getSubServiceContent,
  upsertSubServiceContent,
    getSubServiceContentBySlug,
} from "../controllers/content.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function contentRoutes(app: FastifyInstance) {
  // Public
  app.get("/subservices/:subId/content", getSubServiceContent);

  // Public (by slug)
    app.get("/subservices/slug/:slug/content", getSubServiceContentBySlug);

  // Admin Protected
  app.put(
    "/subservices/:subId/content",
    { preHandler: [auth, adminOnly] },
    upsertSubServiceContent
  );
}
