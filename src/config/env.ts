import "dotenv/config";

const required = (key: string) => {
  const value = process.env[key];
   console.log("NODE_ENV:", process.env.NODE_ENV);

  if (!value || value.trim() === "") {
    throw new Error(`Missing required env variable: ${key}`);
  }

  return value;
};

export const env = {
NODE_ENV:
  process.env.NODE_ENV === "production"
    ? "production"
    : "development",

   


  PORT: Number(process.env.PORT) || 5000,
  

  // Mongo (required)
  MONGO_URI: required("MONGO_URI"),

  // JWT (required)
  JWT_SECRET: required("JWT_SECRET"),

  // Frontend (CORS) (required)
  CLIENT_URL: required("CLIENT_URL"),

  // Uploads
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",

  // ✅ Cloudinary (required)
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
};
