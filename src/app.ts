import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index";

import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";

import fastifyStatic from "@fastify/static";
import path from "path";
import { env } from "./config/env";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  //  1) cookie first
  await app.register(fastifyCookie);

  //  2) cors after cookie
  await app.register(cors, {
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
  });
  console.log("CLIENT_URL:", env.CLIENT_URL);


  //  3) jwt
await app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "admin_access_token",
    signed: false,
  },
});

  //  4) multipart
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  //  5) static uploads
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  //  6) routes
  await app.register(routes, { prefix: "/api" });

  return app;
};