import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (origin === env.CLIENT_URL) {
        return cb(null, true);
      }

      app.log.warn(`Blocked CORS origin: ${origin}`);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  app.log.info(`🌐 CORS enabled for ${env.CLIENT_URL}`);
}

export default fp(corsPlugin);