import { FastifyInstance } from "fastify";
import {
  loginAdminController,
  logoutAdminController,
  refreshAdminTokenController,
  adminMeController,
} from "../controllers/admin.controller";

export default async function adminRoutes(app: FastifyInstance) {
  app.post("/admin/login", loginAdminController);
  app.post("/admin/logout", logoutAdminController);
  app.post("/admin/refresh", refreshAdminTokenController);
  app.get("/admin/me", adminMeController);
}
