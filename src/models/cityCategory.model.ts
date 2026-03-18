import mongoose, {
  Schema,
  Document,
  HydratedDocument,
} from "mongoose";
import slugify from "../utils/slugify";

/* ================= TYPES ================= */

export interface ICityCategory extends Document {
  cityId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type CityCategoryDoc = HydratedDocument<ICityCategory>;

/* ================= SCHEMA ================= */

const CityCategorySchema = new Schema<ICityCategory>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },

    description: {
      type: String,
      default: "",
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

/* ================= INDEXES ================= */

// 🔥 unique per city
CityCategorySchema.index(
  { cityId: 1, slug: 1 },
  { unique: true }
);

// 🔥 MOST IMPORTANT QUERY
CityCategorySchema.index({ cityId: 1, isActive: 1, order: 1 });

// 🔥 optional sorting
CityCategorySchema.index({ createdAt: -1 });

/* ================= SLUG ================= */

CityCategorySchema.pre("save", async function (this: CityCategoryDoc) {
  if (!this.isModified("name")) return;

  let baseSlug = slugify(this.name);
  let slug = baseSlug;
  let count = 1;

  const Model = mongoose.models.CityCategory;

  while (
    await Model.findOne({
      cityId: this.cityId,
      slug,
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const CityCategoryModel =
  mongoose.models.CityCategory ||
  mongoose.model<ICityCategory>(
    "CityCategory",
    CityCategorySchema
  );