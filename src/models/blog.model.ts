import mongoose, { Schema, Document, HydratedDocument } from "mongoose";
import slugify from "../utils/slugify";
import { BlogBlock } from "../types/blog.types";

export type BlogStatus = "draft" | "published";

/* ================= INTERFACE ================= */

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

type BlogDoc = HydratedDocument<IBlog>;

/* ================= BLOCK ================= */

const BlockSchema = new Schema(
  {
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

/* ================= SCHEMA ================= */

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      unique: true,          // ONLY this
      lowercase: true,
      trim: true,
    },

    excerpt: { type: String, required: true },

    blocks: { type: [BlockSchema], required: true },

    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
      publicId: { type: String },
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featuredPosition: {
      type: Number,
      enum: [1, 2, 3, null],
      default: null,
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

    publishedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 Main listing
blogSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });

// 🔥 Featured blogs
blogSchema.index({ featuredPosition: 1 });

// 🔥 Tag search
blogSchema.index({ tags: 1 });

// 🔥 Fast delete filter
blogSchema.index({ isDeleted: 1 });

// 🔥 Recent blogs
blogSchema.index({ createdAt: -1 });

/* ================= SLUG ================= */

blogSchema.pre("save", async function (this: BlogDoc) {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  const Blog = mongoose.models.Blog;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const BlogModel =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);