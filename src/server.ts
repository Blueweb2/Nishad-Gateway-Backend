import { buildApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start() {
  try {
    await connectDB();

    const app = await buildApp();



    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    // await app.listen({ port: env.PORT, host: "127.0.0.1" });

   console.log(` Server running on port ${env.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();