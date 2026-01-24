import dotenv from "dotenv";
dotenv.config();

import { buildApp } from "./app";
import { connectDB } from "./config/db";

async function start() {
  try {
    // ✅ Connect DB first
    await connectDB();

    const app = await buildApp();

    const PORT = Number(process.env.PORT) || 5000;

    await app.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();