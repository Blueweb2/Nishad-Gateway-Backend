import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: (origin, callback) => {
      // Allow SSR, Postman, curl (no origin)
      if (!origin) return callback(null, true);

      if (origin === env.CLIENT_URL) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  app.log.info(`CORS enabled for ${env.CLIENT_URL}`);
}

export default fp(corsPlugin);
