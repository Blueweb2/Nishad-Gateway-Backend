// import Fastify from "fastify";
// import cors from "@fastify/cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db";
// import routes from "./routes/index"; // ✅ ADD THIS

// dotenv.config();

// const app = Fastify({ logger: true });

// async function start() {
//   // ✅ connect mongodb
//   await connectDB();

//   // ✅ enable cors for frontend
//   await app.register(cors, {
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   });

//   // ✅ Register all routes here
//   await app.register(routes, { prefix: "/api" }); //

//   // ✅ test route
//   app.get("/", async () => {
//     return { success: true, message: "Nishad Gateway API is running 🚀" };
//   });

//   const PORT = Number(process.env.PORT) || 5000;

//   try {
//     await app.listen({ port: PORT, host: "0.0.0.0" });
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// }

// start();


import dotenv from "dotenv";
dotenv.config();

import { buildApp } from "./app";
import { connectDB } from "./config/db";

async function start() {
  try {
    // connect mongodb
    await connectDB();

    const app = buildApp();

    const PORT = Number(process.env.PORT) || 5000;

    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(` Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

