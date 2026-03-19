import mongoose, { Schema, Document, HydratedDocument } from "mongoose";
import slugify from "../utils/slugify";

/* ================= TYPES ================= */

export interface ICity extends Document {
  cityName: string;
  citySlug: string;

  cityImage: string;
  cityImageAlt?: string;
  cityImagePublicId?: string;

  heading: string;
  description: string;

  tag: "ARTICLE" | "FEATURED" | "TRENDING";
  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

type CityDoc = HydratedDocument<ICity>;

/* ================= SCHEMA ================= */

const CitySchema = new Schema<ICity>(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },

    citySlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /* ================= IMAGE ================= */

    cityImage: {
      type: String,
      default: "",
    },

    cityImageAlt: {
      type: String,
      default: "",
      trim: true,
    },

    cityImagePublicId: {
      type: String,
      default: "",
    },

    /* ================= CONTENT ================= */

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    /* ================= META ================= */

    tag: {
      type: String,
      enum: ["ARTICLE", "FEATURED", "TRENDING"],
      default: "ARTICLE",
      index: true,
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

/* ================= INDEXES ================= */

// 🔥 main listing (MOST IMPORTANT)
CitySchema.index({ isActive: 1, order: 1 });

// 🔥 optional sorting
CitySchema.index({ createdAt: -1 });

/* ================= SLUG ================= */

CitySchema.pre("save", async function (this: CityDoc) {
  if (!this.isModified("cityName")) return;

  let baseSlug = slugify(this.cityName);
  let slug = baseSlug;
  let count = 1;

  const City = mongoose.models.City;

  while (await City.findOne({ citySlug: slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.citySlug = slug;
});

/* ================= EXPORT ================= */

export const CityModel =
  mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);