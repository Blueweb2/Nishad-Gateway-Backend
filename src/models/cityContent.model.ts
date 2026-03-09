import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  cityId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;

  placeId?: mongoose.Types.ObjectId;

  title: string;
  slug: string;

  description?: string;
  image?: string;

  type: "overview" | "article" | "listing" | "place";

  address?: string;
  phone?: string;
  website?: string;

  isFeatured?: boolean;

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "CityCategory",
      required: true,
    },

    placeId: {
      type: Schema.Types.ObjectId,
      ref: "CityContent",
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    description: String,
    image: String,

    type: {
      type: String,
      enum: ["overview", "article", "listing", "place"],
      default: "article",
    },

    address: String,
    phone: String,
    website: String,

    isFeatured: {
      type: Boolean,
      default: false,
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

ContentSchema.index({ cityId: 1, categoryId: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ slug: 1 });

export const CityContentModel =
  mongoose.models.CityContent ||
  mongoose.model<IContent>("CityContent", ContentSchema);