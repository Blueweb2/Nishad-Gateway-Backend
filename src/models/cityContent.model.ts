import mongoose, {
  Schema,
  Document,
  HydratedDocument,
} from "mongoose";
import slugify from "../utils/slugify";

/* ================= TYPES ================= */

export interface ICityContent extends Document {
  cityId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;

  title: string;
  slug?: string;

  description?: string;
  content?: string;

  coverImage?: string;
  coverImagePublicId?: string;
  coverImageAlt?: string;

  type: "overview" | "listing";

  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  orderInfo?: string;
  locationLabel?: string;
  email?: string;
  priceRange?: string;
  rating?: number;

  coordinates?: {
    lat: number;
    lng: number;
  };

  isFeatured?: boolean;
  order: number;

  status: "draft" | "published" | "archived";

  createdAt: Date;
  updatedAt: Date;
}

type CityContentDoc = HydratedDocument<ICityContent>;

/* ================= SCHEMA ================= */

const CityContentSchema = new Schema<ICityContent>(
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
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },

    description: { type: String, default: "" },
    content: { type: String, default: "" },

    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    coverImageAlt: { type: String, default: "" },

    type: {
      type: String,
      enum: ["overview", "listing"],
      default: "listing",
    },

    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    orderInfo: { type: String, default: "" },
    locationLabel: { type: String, default: "" },
    email: { type: String, default: "" },
    priceRange: { type: String, default: "" },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

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

/* ================= INDEXES ================= */

// 🔥 MAIN QUERY (MOST IMPORTANT)
CityContentSchema.index({
  categoryId: 1,
  status: 1,
  order: 1,
});

// 🔥 overview uniqueness
CityContentSchema.index(
  { categoryId: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "overview" },
  }
);

// 🔥 slug uniqueness per category
CityContentSchema.index(
  { categoryId: 1, slug: 1 },
  { unique: true, sparse: true }
);

// 🔥 featured queries
CityContentSchema.index({
  categoryId: 1,
  isFeatured: 1,
  status: 1,
});

// 🔥 GEO INDEX (VERY POWERFUL)
CityContentSchema.index({
  "coordinates.lat": 1,
  "coordinates.lng": 1,
});

/* ================= SLUG ================= */

CityContentSchema.pre("save", async function (this: CityContentDoc) {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  const Model = mongoose.models.CityContent;

  while (
    await Model.findOne({
      categoryId: this.categoryId,
      slug,
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const CityContentModel =
  mongoose.models.CityContent ||
  mongoose.model<ICityContent>("CityContent", CityContentSchema);