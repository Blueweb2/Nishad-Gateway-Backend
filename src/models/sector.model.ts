// sector.model.ts

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

  /* SEO */
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;

  createdAt: Date;
  updatedAt: Date;
}

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
      unique: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    blocks: [
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
    ],

    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
      publicId: { type: String },
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    /* SEO */
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    ogImage: { type: String },
  },
  { timestamps: true }
);

export const SectorModel = mongoose.model<ISector>(
  "Sector",
  SectorSchema
);