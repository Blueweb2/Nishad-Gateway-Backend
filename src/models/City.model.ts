import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  cityName: string;
  citySlug: string;
  cityImage: string;

 
  bestSuitedFor: string;
  focus: string;

  tag: string; // "ARTICLE"
  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    cityName: { type: String, required: true, trim: true },

    citySlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    cityImage: { type: String, default: "" },

    bestSuitedFor: { type: String, default: "" },
    focus: { type: String, default: "" },

    tag: { type: String, default: "ARTICLE" },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CityModel =
  mongoose.models.City || mongoose.model<ICity>("City", CitySchema);