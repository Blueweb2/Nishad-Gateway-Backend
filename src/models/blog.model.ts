// models/blog.model.ts

import mongoose, { Schema, Document } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;

  coverImage: {
    url: string;
    alt: string;
  };

  gallery?: {
    url: string;
    alt?: string;
    caption?: string;
  }[];

  tags: string[];
  status: BlogStatus;

  // SEO
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

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    content: { type: String, required: true },

    excerpt: { type: String, required: true },

    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },

    gallery: [
      {
        url: { type: String },
        alt: { type: String },
        caption: { type: String },
      },
    ],

    tags: [{ type: String, index: true }],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String,
    canonicalUrl: String,

    readingTime: { type: Number, default: 1 },

    publishedAt: { type: Date, index: true },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

/* Compound index for faster blog listing */
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

export const BlogModel =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);