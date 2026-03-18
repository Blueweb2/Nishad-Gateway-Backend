import mongoose, { Schema, Document } from "mongoose";
import { SectorStatus } from "../types/sector.types";

export interface ISector extends Document {
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
    publicId?: string;
  };

  order: number;
  status: SectorStatus;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;

  createdAt: Date;
  updatedAt: Date;
}

const SectorBlockSchema = new Schema(
  {
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const SectorSchema = new Schema<ISector>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true, //  keep ONLY this
      lowercase: true, // normalize
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    blocks: {
      type: [SectorBlockSchema],
      default: [],
    },

    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
      publicId: { type: String },
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true, // ⚡ filter fast
    },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: {
      type: [String],
      default: [],
    },
    ogImage: { type: String },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

//  slug (already indexed via unique)

// sorting + filtering
SectorSchema.index({ status: 1, order: 1 });

//  latest sectors
SectorSchema.index({ createdAt: -1 });

export const SectorModel =
  mongoose.models.Sector ||
  mongoose.model<ISector>("Sector", SectorSchema);