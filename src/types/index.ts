import { FastifyInstance } from "fastify";
import adminRoutes from "../routes/admin.routes";
import blogRoutes from "../routes/blog.routes";
import serviceRoutes from "../routes/service.routes";

export default async function routes(app: FastifyInstance) {
  app.register(adminRoutes, { prefix: "/admin" });
  app.register(blogRoutes, { prefix: "/blogs" });
  app.register(serviceRoutes, { prefix: "/services" });

  // test route
  app.get("/health", async () => {
    return { success: true, message: "API running 🚀" };
  });
}
