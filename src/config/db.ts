import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    console.log("✅ MongoDB Connected:", conn.connection.host);
    console.log("📌 DB Name:", conn.connection.name); // ⭐ this is the key
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
