import { FastifyInstance } from "fastify";
import {
  getSubServiceContent,
  upsertSubServiceContent,
} from "../controllers/content.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function contentRoutes(app: FastifyInstance) {
  // Public
  app.get("/subservices/:subId/content", getSubServiceContent);

  // Admin Protected
  app.put(
    "/subservices/:subId/content",
    { preHandler: [auth, adminOnly] },
    upsertSubServiceContent
  );
}
