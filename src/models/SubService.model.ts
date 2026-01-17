import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubService extends Document {
  serviceId: Types.ObjectId;
  title: string;
  slug: string;
  shortDesc: string;
  thumbnail: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubServiceSchema = new Schema<ISubService>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    shortDesc: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },

    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubServiceSchema.index({ serviceId: 1, slug: 1 }, { unique: true });

export const SubServiceModel = mongoose.model<ISubService>(
  "SubService",
  SubServiceSchema
);
