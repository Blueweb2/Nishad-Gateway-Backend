import mongoose, {
  Schema,
  Document,
  Types,
  HydratedDocument,
} from "mongoose";
import slugify from "../utils/slugify";

/* ================= TYPES ================= */

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

type SubServiceDoc = HydratedDocument<ISubService>;

/* ================= SCHEMA ================= */

const SubServiceSchema = new Schema<ISubService>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
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
    },

    shortDesc: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 unique slug per service
SubServiceSchema.index(
  { serviceId: 1, slug: 1 },
  { unique: true }
);

// 🔥 MAIN QUERY (important)
SubServiceSchema.index({
  serviceId: 1,
  isActive: 1,
  order: 1,
});

// 🔥 optional
SubServiceSchema.index({ createdAt: -1 });

/* ================= SLUG ================= */

SubServiceSchema.pre("save", async function (this: SubServiceDoc) {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  const Model = mongoose.models.SubService;

  while (
    await Model.findOne({
      serviceId: this.serviceId,
      slug,
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const SubServiceModel =
  mongoose.models.SubService ||
  mongoose.model<ISubService>("SubService", SubServiceSchema);