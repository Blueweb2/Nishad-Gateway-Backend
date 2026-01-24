import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

async function jwtPlugin(app: FastifyInstance) {
  // 1) cookie first
  await app.register(fastifyCookie);

  // 2) jwt after cookie
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.log.info("✅ JWT + Cookie Plugin Registered");
}

export default fp(jwtPlugin);