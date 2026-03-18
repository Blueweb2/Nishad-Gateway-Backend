import { buildApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import mongoose from "mongoose";

async function start() {
  try {
    // 🔗 Connect DB
    await connectDB();

    const app = await buildApp();

    // 🚀 Start server
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    app.log.info(`🚀 Server running on http://localhost:${env.PORT}`);

    /* ===========================
       GRACEFUL SHUTDOWN
    ============================ */

    const shutdown = async (signal: string) => {
      app.log.info(`⚠️ Received ${signal}. Shutting down...`);

      try {
        await app.close();
        await mongoose.connection.close();

        app.log.info("Server & DB closed successfully");
        process.exit(0);
      } catch (err: unknown) {
        if (err instanceof Error) {
          app.log.error(err.message);
        } else {
          app.log.error("Unknown shutdown error");
        }
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(" Startup Error:", err.message);
    } else {
      console.error(" Unknown Startup Error");
    }
    process.exit(1);
  }
}

/* ===========================
   GLOBAL ERROR SAFETY
=========================== */

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(" Unhandled Rejection:", reason);
  process.exit(1);
});

start();