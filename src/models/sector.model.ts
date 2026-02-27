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
  };

  status: SectorStatus;
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
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const SectorModel = mongoose.model<ISector>(
  "Sector",
  SectorSchema
);