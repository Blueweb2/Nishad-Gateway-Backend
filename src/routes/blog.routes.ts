import { FastifyInstance } from "fastify";

export default async function blogRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return { success: true, blogs: [] };
  });
}
