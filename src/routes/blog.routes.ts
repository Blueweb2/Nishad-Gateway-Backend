import { FastifyInstance } from "fastify";
import { BlogController } from "../controllers/blog.controller";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { CreateBlogDTO, UpdateBlogDTO } from "../types/blog.types";

export default async function blogRoutes(app: FastifyInstance) {

  /* ================= ADMIN ================= */

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  app.get("/admin/all", {
    preHandler: adminAccess,
  }, BlogController.getAdmin);

  app.get<{ Params: { id: string } }>("/admin/:id", {
    preHandler: adminAccess,
  }, BlogController.getById);

  app.post<{ Body: CreateBlogDTO }>("/admin", {
    preHandler: adminAccess,
  }, BlogController.create);

  app.put<{ Params: { id: string }; Body: UpdateBlogDTO }>("/admin/:id", {
    preHandler: adminAccess,
  }, BlogController.update);

  app.delete<{ Params: { id: string } }>("/admin/:id", {
    preHandler: adminAccess,
  }, BlogController.delete);

  /* ================= PUBLIC ================= */

  app.get("/featured", BlogController.getFeatured);

  app.get<{ Params: { slug: string } }>("/:slug/related", BlogController.getRelated);

  app.get<{ Querystring: { page?: string; limit?: string; tag?: string } }>("/", BlogController.getAll);

  app.get<{ Params: { slug: string } }>("/:slug", BlogController.getSingle);
}