import { FastifyInstance } from "fastify";
import {
  getSubServiceContent,
  upsertSubServiceContent,
  getSubServiceContentBySlug,
} from "../controllers/content.controller";

import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

export default async function contentRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= PUBLIC ================= */

  app.get("/subservices/:subId/content", getSubServiceContent);

  app.get("/subservices/slug/:slug/content", getSubServiceContentBySlug);

  /* ================= ADMIN ================= */

  app.put(
    "/subservices/:subId/content",
    {
      preHandler: adminAccess,
    },
    upsertSubServiceContent
  );
}