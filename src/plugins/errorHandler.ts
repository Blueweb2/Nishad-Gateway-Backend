import { FastifyInstance, FastifyError } from "fastify";
import { env } from "../config/env";


export default async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode || 500;

    // 🔐 Log properly (use Fastify logger)
    request.log.error({
      err: error,
      url: request.url,
      method: request.method,
    });

    /* ===========================
       HANDLE KNOWN ERRORS
    ============================ */

    // ✅ Validation errors (Fastify schema)
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors: error.validation,
      });
    }

    // ✅ JWT errors
    if (error.name === "JsonWebTokenError") {
      return reply.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return reply.status(401).send({
        success: false,
        message: "Token expired",
      });
    }

    /* ===========================
       GENERIC ERROR RESPONSE
    ============================ */

    return reply.status(statusCode).send({
      success: false,
      message:
        
env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message || "Internal Server Error",
    });
  });
}