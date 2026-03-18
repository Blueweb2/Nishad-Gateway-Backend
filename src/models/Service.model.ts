import mongoose, {
  Schema,
  Document,
  HydratedDocument,
} from "mongoose";
import slugify from "../utils/slugify";

/* ================= TYPES ================= */

export interface IService extends Document {
  orderKey: string; // 🔥 renamed (safer than "index")
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ServiceDoc = HydratedDocument<IService>;

/* ================= SCHEMA ================= */

const ServiceSchema = new Schema<IService>(
  {
    orderKey: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 main query
ServiceSchema.index({ isActive: 1, orderKey: 1 });

// 🔥 optional
ServiceSchema.index({ createdAt: -1 });

/* ================= SLUG ================= */

ServiceSchema.pre("save", async function (this: ServiceDoc) {
  if (!this.isModified("title")) return;

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  const Model = mongoose.models.Service;

  while (await Model.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const ServiceModel =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);