import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT || 5000),

  // Mongo
  MONGO_URI: process.env.MONGO_URI || "",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",

  // Frontend (CORS)
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  // Uploads
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};
