import mongoose, { Schema, Document } from "mongoose";
import { BlogBlock } from "../types/blog.types";

export type BlogStatus = "draft" | "published";

/* ================= BLOG INTERFACE ================= */

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;

  blocks: BlogBlock[];

  coverImage: {
    url: string;
    alt: string;
    publicId?: string;
  };

  tags: string[];
  status: BlogStatus;

  // ✅ Featured system
  featuredPosition: 1 | 2 | 3 | null;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;

  readingTime: number;
  publishedAt?: Date;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ================= BLOCK SCHEMA ================= */

const BlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

/* ================= BLOG SCHEMA ================= */

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    blocks: {
      type: [BlockSchema],
      required: true,
    },

    coverImage: {
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: true,
      },
      publicId: { type: String },
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    /* ================= FEATURED ================= */

    featuredPosition: {
      type: Number,
      enum: [1, 2, 3, null],
      default: null,
      index: true,
    },

    /* ================= SEO ================= */

    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String,
    canonicalUrl: String,

    /* ================= META ================= */

    readingTime: {
      type: Number,
      default: 1,
    },

    publishedAt: {
      type: Date,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// For normal blog listing
blogSchema.index({ status: 1, publishedAt: -1 });

// For featured sorting
blogSchema.index({ featuredPosition: 1 });

export const BlogModel =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);