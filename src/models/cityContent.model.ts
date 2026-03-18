import mongoose, { Schema, Document } from "mongoose";

/* ======================================================
   TYPES
====================================================== */

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

coordinates: {
  lat: number,
  lng: number
}

  isFeatured?: boolean;

  order: number;

  status: "draft" | "published" | "archived";

  createdAt: Date;
  updatedAt: Date;
}

/* ======================================================
   SCHEMA
====================================================== */

const CityContentSchema = new Schema<ICityContent>(
  {
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "CityCategory",
      required: true,
      index: true,
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

    description: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

 

    coverImage: {
  type: String,
  default: "",
},

coverImagePublicId: {
  type: String,
  default: "",
},

coverImageAlt: {
  type: String,
  default: "",
},

    type: {
      type: String,
      enum: ["overview", "listing"],
      default: "listing",
      index: true,
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
    openingHours: {
  type: String,
  default: "",
},

orderInfo: {
  type: String,
  default: "",
},

locationLabel: {
  type: String,
  default: "",
},

email: {
  type: String,
  default: "",
},

priceRange: {
  type: String,
  default: "",
},

rating: {
  type: Number,
  min: 0,
  max: 5,
  default: null,
},
coordinates: {
  lat: { type: Number },
  lng: { type: Number },
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
      index: true,
    },
  },
  { timestamps: true }
);

/* ======================================================
   INDEXES
====================================================== */

/* Fast lookup for category listings */
CityContentSchema.index({ cityId: 1, categoryId: 1, type: 1 });

/* Ensure only ONE overview per category */
CityContentSchema.index(
  { categoryId: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "overview" },
  }
);

/* Optional unique slug for listings */
CityContentSchema.index(
  { cityId: 1, categoryId: 1, slug: 1 },
  {
    unique: true,
    sparse: true,
  }
);

/* Featured listings query optimization */
CityContentSchema.index({ categoryId: 1, isFeatured: 1 });

/* Sorting listings */
CityContentSchema.index({ categoryId: 1, order: 1 });

/* ======================================================
   MODEL EXPORT
====================================================== */

export const CityContentModel =
  mongoose.models.CityContent ||
  mongoose.model<ICityContent>("CityContent", CityContentSchema);