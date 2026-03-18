import "dotenv/config";

const required = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }

  return value;
};

const toNumber = (value: string, key: string): number => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`❌ Invalid number for ${key}`);
  }
  return num;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT
    ? toNumber(process.env.PORT, "PORT")
    : 5000,

  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  CLIENT_URL: required("CLIENT_URL"),

  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",

  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),
} as const;