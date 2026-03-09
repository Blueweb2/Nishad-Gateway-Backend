import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  cityId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  placeId?: mongoose.Types.ObjectId;

  name: string;
  slug: string;

  description?: string;
  image?: string;

  type:
    | "restaurant"
    | "hotel"
    | "company"
    | "shop"
    | "attraction";

  address?: string;
  website?: string;
  phone?: string;

  order: number;
  isFeatured: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
{
  cityId: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true
  },

  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "CityCategory",
    required: true
  },

  placeId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    default: null
  },

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    lowercase: true
  },

  description: String,
  image: String,

  type: {
    type: String,
    enum: [
      "restaurant",
      "hotel",
      "company",
      "shop",
      "attraction"
    ]
  },

  address: String,
  website: String,
  phone: String,

  order: { type: Number, default: 0 },

  isFeatured: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true }

},
{ timestamps: true }
);

ListingSchema.index({ cityId: 1, categoryId: 1 });
ListingSchema.index({ placeId: 1 });

export const ListingModel =
mongoose.models.Listing ||
mongoose.model<IListing>("Listing", ListingSchema);