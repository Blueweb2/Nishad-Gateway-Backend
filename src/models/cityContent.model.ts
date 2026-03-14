import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  cityId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;

  title: string;
  slug: string;

  description?: string;
  content?: string;
  image?: string;

  type: "overview" | "listing";

  address?: string;
  phone?: string;
  website?: string;

  isFeatured?: boolean;

  order: number;

  status: "draft" | "published" | "archived";

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

  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  description: String,
  content: String,

  image: String,

  type: {
    type: String,
    enum: ["overview", "listing"],
    default: "listing",
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

  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
},
{ timestamps: true }
);

ContentSchema.index({ cityId: 1, categoryId: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ cityId: 1, categoryId: 1, slug: 1 }, { unique: true });

export const CityContentModel =
  mongoose.models.CityContent ||
  mongoose.model<IContent>("CityContent", ContentSchema);