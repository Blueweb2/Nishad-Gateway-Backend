import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index";

import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";

import fastifyStatic from "@fastify/static";
import path from "path";
import leadRoutes from "./routes/lead.routes";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  //  1) cookie first
  app.register(fastifyCookie);

  //  2) cors after cookie (credentials fix)
  app.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "fallback_secret",
  });

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});


  app.register(routes, { prefix: "/api" });
// app.register(leadRoutes, { prefix: "/api" });

  return app;
};
