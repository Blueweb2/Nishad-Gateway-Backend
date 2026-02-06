import "dotenv/config"; // ✅ ADD THIS
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { CityBlogModel } from "../src/models/CityBlog.model";

async function migrate() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const blogs = await CityBlogModel.find();

    for (const blog of blogs) {
      let updated = false;

      blog.sections = blog.sections.map((section: any) => {
        if (!section.id) {
          updated = true;
          return {
            ...section.toObject(),
            id: randomUUID(),
          };
        }
        return section;
      });

      if (updated) {
        await blog.save();
        console.log(`Updated blog: ${blog._id}`);
      }
    }

    console.log("Migration complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed ❌", err);
    process.exit(1);
  }
}

migrate();
