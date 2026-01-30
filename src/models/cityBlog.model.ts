import mongoose, { Schema, Document } from "mongoose";

export interface ICitySection {
  type:
    | "HERO"
    | "CATEGORIES"
    | "INTRO_TEXT"
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

/* ---------- Section Schema ---------- */
const CitySectionSchema = new Schema<ICitySection>(
  {
    type: {
      type: String,
      required: true,
      enum: [
  "HERO",
  "CATEGORIES",
  "INTRO_TEXT",
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
  },
  { _id: false }
);

/* ---------- City Blog Schema ---------- */
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

export const CityBlogModel =
  mongoose.models.CityBlog ||
  mongoose.model<ICityBlog>("CityBlog", CityBlogSchema);