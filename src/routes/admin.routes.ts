import { FastifyInstance } from "fastify";

import {
  loginAdminController,
  logoutAdminController,
  refreshAdminTokenController,
  adminMeController,
  listAdminsController,
  createAdminController,
  deleteAdminController,
  getAdminLogsController,
} from "../controllers/admin.controller";

import { auth } from "../middlewares/auth";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin";

import { AdminLogsRoute, IdRoute } from "../types/routes.types";

export default async function adminRoutes(app: FastifyInstance) {

  /* ===========================
     PUBLIC ROUTES
  ============================ */
  app.post("/admin/login", loginAdminController);
  app.post("/admin/refresh", refreshAdminTokenController);

  /* ===========================
     AUTHENTICATED ROUTES
  ============================ */
  app.post("/admin/logout", { preHandler: [auth] }, logoutAdminController);
  app.get("/admin/me", { preHandler: [auth] }, adminMeController);

  /* ===========================
     SUPERADMIN ONLY ROUTES
  ============================ */
  app.get(
    "/admin/list",
    { preHandler: [auth, requireSuperAdmin] },
    listAdminsController
  );

  app.post(
    "/admin/create",
    { preHandler: [auth, requireSuperAdmin] },
    createAdminController
  );

  app.delete<IdRoute>(
    "/admin/:id",
    { preHandler: [auth, requireSuperAdmin] },
    deleteAdminController
  );

  app.get<AdminLogsRoute>(
    "/admin/logs",
    { preHandler: [auth, requireSuperAdmin] },
    getAdminLogsController
  );
}
