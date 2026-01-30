import mongoose, { Schema, Document } from "mongoose";

export interface ICityCategory extends Document {
  cityId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ======================================================
   CITY CATEGORY SCHEMA
====================================================== */

const CityCategorySchema = new Schema<ICityCategory>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/, // recommended validation
    },

    description: {
      type: String,
      default: "",
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

// Prevent duplicate slug inside same city
CityCategorySchema.index(
  { cityId: 1, slug: 1 },
  { unique: true }
);

// Optimize category listing by order
CityCategorySchema.index({ cityId: 1, order: 1 });

// Optimize filtering active categories
CityCategorySchema.index({ cityId: 1, isActive: 1 });

/* ======================================================
   MODEL EXPORT
====================================================== */

export const CityCategoryModel =
  mongoose.models.CityCategory ||
  mongoose.model<ICityCategory>(
    "CityCategory",
    CityCategorySchema
  );