import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10, // connection pooling
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 DB Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// 🔥 Graceful shutdown (VERY IMPORTANT)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB disconnected (app termination)");
  process.exit(0);
});