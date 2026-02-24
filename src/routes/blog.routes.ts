import { FastifyInstance } from "fastify";
import { BlogController } from "../controllers/blog.controller";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { CreateBlogDTO, UpdateBlogDTO } from "../types/blog.types";

export default async function blogRoutes(app: FastifyInstance) {

  /* ================= PUBLIC ================= */

app.get<{
  Querystring: { page?: string; limit?: string; tag?: string };
}>("/", BlogController.getAll);

  app.get<{
    Params: { slug: string };
  }>("/:slug", BlogController.getSingle);


  /* ================= ADMIN ================= */

  app.get("/admin/all", {
    preHandler: [auth, adminOnly],
  }, BlogController.getAdmin);

  app.post<{
    Body: CreateBlogDTO;
  }>("/admin", {
    preHandler: [auth, adminOnly],
  }, BlogController.create);

  app.put<{
    Params: { id: string };
    Body: UpdateBlogDTO;
  }>("/admin/:id", {
    preHandler: [auth, adminOnly],
  }, BlogController.update);

  app.delete<{
    Params: { id: string };
  }>("/admin/:id", {
    preHandler: [auth, adminOnly],
  }, BlogController.delete);
}