import mongoose, { Schema, Document } from "mongoose";
import { randomUUID } from "crypto";

/* ================= TYPES ================= */

export interface ICitySection {
  id: string;

  type:
    | "HERO"
    | "CATEGORIES"
    | "VISION"
    | "BUSINESS_SETUP_OPTIONS"
    | "INVESTMENT_HIGHLIGHTS"
    | "INFRASTRUCTURE"
    | "LANDMARKS"
    | "FOOD_GUIDE"
    | "TRANSPORTATION_GUIDE"
    | "EXPANDABLE_SNAPSHOT"
    | "FUTURE_OUTLOOK";

  title?: string;
  content: any;
  order: number;
  isActive: boolean;
}

export interface ICityBlog extends Document {
  cityId: mongoose.Types.ObjectId;
  sections: ICitySection[];
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  updatedAt: Date;
}

/* ================= SECTION ================= */

const CitySectionSchema = new Schema<ICitySection>(
  {
    id: {
      type: String,
      required: true,
      default: () => randomUUID(),
    },

    type: {
      type: String,
      required: true,
      enum: [
        "HERO",
        "CATEGORIES",
        "VISION",
        "BUSINESS_SETUP_OPTIONS",
        "INVESTMENT_HIGHLIGHTS",
        "INFRASTRUCTURE",
        "LANDMARKS",
        "FOOD_GUIDE",
        "TRANSPORTATION_GUIDE",
        "EXPANDABLE_SNAPSHOT",
        "FUTURE_OUTLOOK",
      ],
    },

    title: { type: String, default: "" },

    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false } // 🔥 IMPORTANT
);

/* ================= MAIN ================= */

const CityBlogSchema = new Schema<ICityBlog>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      unique: true,
    },

    sections: {
      type: [CitySectionSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
  },
  { timestamps: true }
);

/* ================= INDEX ================= */

// ✅ ONLY ONE INDEX (correct)
CityBlogSchema.index({ cityId: 1, status: 1 });

/* ================= AUTO SORT ================= */

CityBlogSchema.pre("save", function () {
  if (this.sections?.length) {
    this.sections.sort((a, b) => a.order - b.order);
  }
});

/* ================= EXPORT ================= */

export const CityBlogModel =
  mongoose.models.CityBlog ||
  mongoose.model<ICityBlog>("CityBlog", CityBlogSchema);