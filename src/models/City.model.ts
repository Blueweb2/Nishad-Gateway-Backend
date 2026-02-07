import mongoose, { Schema, Document } from "mongoose";

/* ======================================================
   TYPES
====================================================== */

export interface ICity extends Document {
  cityName: string;
  citySlug: string;
  cityImage: string;

  heading: string;
  description: string;

  tag: "ARTICLE" | "FEATURED" | "TRENDING";
  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ======================================================
   SCHEMA
====================================================== */

const CitySchema = new Schema<ICity>(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },

    citySlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    cityImage: {
      type: String,
      default: "",
    },

    // NEW FIELD
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    // NEW FIELD
    description: {
      type: String,
      default: "",
    },

    tag: {
      type: String,
      enum: ["ARTICLE", "FEATURED", "TRENDING"],
      default: "ARTICLE",
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
  { timestamps: true }
);

/* ======================================================
   INDEXES
====================================================== */

CitySchema.index({ order: 1 });
CitySchema.index({ isActive: 1 });
CitySchema.index({ isActive: 1, order: 1 });

/* ======================================================
   MODEL EXPORT
====================================================== */

export const CityModel =
  mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
