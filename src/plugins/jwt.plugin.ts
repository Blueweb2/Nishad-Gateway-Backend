import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

async function jwtPlugin(app: FastifyInstance) {
  // 🍪 Cookie
  await app.register(fastifyCookie);

  // 🔐 JWT
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "admin_access_token",
      signed: false,
    },
    sign: {
      expiresIn: "15m",
    },
  });

  app.log.info("🔐 JWT + Cookie configured");
}

export default fp(jwtPlugin);