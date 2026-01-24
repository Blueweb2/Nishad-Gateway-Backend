import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "path";
import { FastifyInstance } from "fastify";

async function staticPlugin(app: FastifyInstance) {
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  app.log.info("✅ Static Files Plugin Registered (/uploads)");
}

export default fp(staticPlugin);