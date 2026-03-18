import slugify from "../utils/slugify";
import mongoose, { HydratedDocument } from "mongoose";

/* ================= SUB SCHEMAS ================= */

const CardSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true, default: "" },
    iconSvg: { type: String, default: "" },
    iconPublicId: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const SlideSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const FAQItemSchema = new mongoose.Schema(
  {
    q: { type: String, trim: true, default: "" },
    a: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const BlockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },

    type: {
      type: String,
      enum: ["content", "slider", "cards", "faq"],
      required: true,
    },

    content: { type: String, default: "" },
    heading: { type: String, default: "" },
    subText: { type: String, default: "" },
    bottomText: { type: String, default: "" },

    slides: { type: [SlideSchema], default: [] },
    cards: { type: [CardSchema], default: [] },

    faqImage: { type: String, default: "" },
    faqImagePublicId: { type: String, default: "" },
    faqImageAlt: { type: String, default: "" },

    faqs: { type: [FAQItemSchema], default: [] },
  },
  { _id: false }
);

/* ================= MAIN ================= */

const MinistrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,      //  only this (no duplicate index)
      lowercase: true,
      trim: true,
    },

    shortDesc: { type: String, trim: true, default: "" },

    logo: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    logoAlt: { type: String, default: "" },

    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    coverAlt: { type: String, default: "" },

    isActive: {
      type: Boolean,
      default: true,
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 fast filtering + sorting
MinistrySchema.index({ isActive: 1, createdAt: -1 });

/* ================= SLUG LOGIC ================= */



// 👇 define document type
type MinistryDoc = HydratedDocument<any>;

MinistrySchema.pre("save", async function (this: MinistryDoc) {
  if (!this.isModified("title")) return;

  const baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;

  const Ministry = mongoose.models.Ministry;

  while (await Ministry.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ================= EXPORT ================= */

export const MinistryModel =
  mongoose.models.Ministry ||
  mongoose.model("Ministry", MinistrySchema);