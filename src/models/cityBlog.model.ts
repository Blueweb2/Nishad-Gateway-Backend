import mongoose, { Schema, Document } from "mongoose";
import { randomUUID } from "crypto";

/* ======================================================
   TYPES
====================================================== */

export interface ICitySection {
  id: string; // ✅ REQUIRED
  type:
    | "HERO"
    | "CATEGORIES"
    | "VISION"
    |"BUSINESS_SETUP_OPTIONS"
    | "INVESTMENT_HIGHLIGHTS"
    | "FEATURE_CARDS"
    | "STATS"
    | "IMAGE_TEXT"
    | "BUSINESS"
    | "LIFESTYLE"
    | "STEPS"
    | "INFRASTRUCTURE"
    | "PLACES_GRID"
    | "FAQ"
    | "CTA";

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

/* ======================================================
   SECTION SCHEMA
====================================================== */

const CitySectionSchema = new Schema<ICitySection>({
  id: {
    type: String,
    required: true,
    default: () => randomUUID(), // ✅ AUTO GENERATE
  },

  type: {
    type: String,
    required: true,
    enum: [
      "HERO",
      "CATEGORIES",
      "VISION",
      "INVESTMENT_HIGHLIGHTS",
      "BUSINESS_SETUP_OPTIONS", 
      "FEATURE_CARDS",
      "STATS",
      "IMAGE_TEXT",
      "BUSINESS",
      "LIFESTYLE",
      "STEPS",
      "INFRASTRUCTURE",
      "PLACES_GRID",
      "FAQ",
      "CTA",
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
});

/* ======================================================
   CITY BLOG SCHEMA
====================================================== */

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

CityBlogSchema.index({ status: 1 });
CityBlogSchema.index({ cityId: 1, status: 1 });

export const CityBlogModel =
  mongoose.models.CityBlog ||
  mongoose.model<ICityBlog>("CityBlog", CityBlogSchema);
