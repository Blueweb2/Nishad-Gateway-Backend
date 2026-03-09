import mongoose, { Schema, Document } from "mongoose";

export interface IPlace extends Document {
  cityId: mongoose.Types.ObjectId;

  name: string;
  slug: string;

  description?: string;
  image?: string;

  type: "district" | "attraction" | "industrial" | "landmark";

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
{
  cityId: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
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
    enum: ["district", "attraction", "industrial", "landmark"],
    default: "district"
  },

  order: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true }

},
{ timestamps: true }
);

PlaceSchema.index({ cityId: 1, slug: 1 }, { unique: true });

export const PlaceModel =
mongoose.models.Place ||
mongoose.model<IPlace>("Place", PlaceSchema);