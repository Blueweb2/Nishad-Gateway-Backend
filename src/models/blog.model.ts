import mongoose, { Schema, Document } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;

  blocks: {
    type: string;
    data: any;
  }[];

  coverImage: {
    url: string;
    alt: string;
  };

  tags: string[];
  status: BlogStatus;

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

    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String,
    canonicalUrl: String,

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

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

export const BlogModel =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);