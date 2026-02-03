import mongoose, { Schema, Document } from "mongoose";

/* ======================================================
   INTERFACE
====================================================== */

export interface ICityBlogPost extends Document {
  cityId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;

  title: string;
  slug: string;

  excerpt: string;
  content: string;

  coverImage?: string;
  gallery?: string[];

  /* ================= SEO ================= */

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;

  readingTime?: number; // in minutes

  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ======================================================
   SCHEMA
====================================================== */

const CityBlogPostSchema = new Schema<ICityBlogPost>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "CityCategory",
      required: true,
      index: true,
    },

    /* ================= BASIC INFO ================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },

    excerpt: {
      type: String,
      default: "",
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    gallery: {
      type: [String],
      default: [],
    },

    /* ================= SEO FIELDS ================= */

    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70, // Google limit
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160, // Google limit
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    canonicalUrl: {
      type: String,
      trim: true,
    },

    ogImage: {
      type: String,
      default: "",
    },

    readingTime: {
      type: Number,
      default: 0,
    },

    /* ================= STATUS ================= */

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/* ======================================================
   INDEXES
====================================================== */

// Prevent duplicate slug inside same city
CityBlogPostSchema.index(
  { cityId: 1, slug: 1 },
  { unique: true }
);

// Optimize category listing
CityBlogPostSchema.index({ categoryId: 1, isPublished: 1 });

// Optimize blog lookup
CityBlogPostSchema.index({
  cityId: 1,
  categoryId: 1,
  slug: 1,
});

// Optimize published sorting
CityBlogPostSchema.index({ isPublished: 1, createdAt: -1 });

/* ======================================================
   PRE SAVE HOOK – AUTO CALCULATE READING TIME
====================================================== */

CityBlogPostSchema.pre("findOneAndUpdate", function () {
  const update: any = this.getUpdate();

  if (update?.content) {
    const words = update.content.trim().split(/\s+/).length;
    update.readingTime = Math.max(1, Math.ceil(words / 200));
  }
});





/* ======================================================
   MODEL EXPORT
====================================================== */

export const CityBlogPostModel =
  mongoose.models.CityBlogPost ||
  mongoose.model<ICityBlogPost>(
    "CityBlogPost",
    CityBlogPostSchema
  );
