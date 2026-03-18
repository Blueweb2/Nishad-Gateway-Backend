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
import { authorize } from "../middlewares/authorize";

import { AdminLogsRoute, IdRoute } from "../types/routes.types";

export default async function adminRoutes(app: FastifyInstance) {

  /* ===========================
     ROUTE PREFIX GROUPING
  ============================ */
  app.register(async function (admin) {

    /* ---------- PUBLIC ---------- */
    admin.post("/login", loginAdminController);
    admin.post("/refresh", refreshAdminTokenController);

    /* ---------- AUTH ---------- */
    admin.post("/logout", { preHandler: [auth] }, logoutAdminController);
    admin.get("/me", { preHandler: [auth] }, adminMeController);

    /* ---------- SUPERADMIN ---------- */
    admin.get(
      "/list",
      { preHandler: [auth, authorize(["superadmin"])] },
      listAdminsController
    );

    admin.post(
      "/create",
      { preHandler: [auth, authorize(["superadmin"])] },
      createAdminController
    );

    admin.delete<IdRoute>(
      "/:id",
      { preHandler: [auth, authorize(["superadmin"])] },
      deleteAdminController
    );

    admin.get<AdminLogsRoute>(
      "/logs",
      { preHandler: [auth, authorize(["superadmin"])] },
      getAdminLogsController
    );

  }, { prefix: "/admin" }); // 🔥 THIS IS THE KEY
}