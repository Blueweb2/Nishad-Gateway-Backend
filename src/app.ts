import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index";

import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import { env } from "./config/env";
import errorHandler from "./plugins/errorHandler";

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      redact: ["req.headers.authorization"],
    },
    trustProxy: true,
  });

  /* ===========================
     SECURITY FIRST
  ============================ */

  await app.register(helmet);

  // await app.register(rateLimit, {
  //   max: 100,
  //   timeWindow: "1 minute",
  // });

await app.register(rateLimit, {
  global: true,

  keyGenerator: (req) => {
    const ip = req.ip;

    // reliable check
    if (req.url.includes("/admin/login")) {
      const email = (req.body as any)?.email || "unknown";
      return `${ip}-${email}`;
    }

    return ip;
  },

  errorResponseBuilder: (req, context) => {
    return {
      success: false,
      message: `Too many login attempts. Try again in ${context.after}`,
    };
  },
});



  /* ===========================
     CORE PLUGINS
  ============================ */

  // 🍪 Cookies
  await app.register(fastifyCookie);

  // 🌐 CORS
await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    // allow localhost dev + production
    const allowedOrigins = [
      env.CLIENT_URL,
     
    ];

    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    app.log.warn(`Blocked CORS origin: ${origin}`);
    return cb(new Error("Not allowed by CORS"), false);
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // 🔥 FIX
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

  // 🔐 JWT
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "admin_access_token",
      signed: false,
    },
    sign: {
      expiresIn: "15m", //  FIXED (removed issuer)
    },
  });

  // 📁 Multipart
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  /* ===========================
     ROUTES
  ============================ */
  await app.register(routes, { prefix: "/api" });

  /* ===========================
     ERROR HANDLER
  ============================ */
  await app.register(errorHandler);

  return app;
};