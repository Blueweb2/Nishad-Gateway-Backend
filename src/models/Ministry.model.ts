import mongoose from "mongoose";

/* ================= CARD ================= */

const CardSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      default: "",
    },

    iconSvg: {
      type: String,
      default: "",
    },

    iconPublicId: {
      type: String,
      default: "",
    },

    alt: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* ================= SLIDE ================= */

const SlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    alt: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* ================= FAQ ITEM ================= */

const FAQItemSchema = new mongoose.Schema(
  {
    q: {
      type: String,
      trim: true,
      default: "",
    },

    a: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

/* ================= BLOCK ================= */

const BlockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["content", "slider", "cards", "faq"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    heading: {
      type: String,
      default: "",
    },

    subText: {
      type: String,
      default: "",
    },

    bottomText: {
      type: String,
      default: "",
    },

    slides: {
      type: [SlideSchema],
      default: [],
    },

    cards: {
      type: [CardSchema],
      default: [],
    },

    faqImage: {
      type: String,
      default: "",
    },

    faqImagePublicId: {
      type: String,
      default: "",
    },

    faqImageAlt: {
      type: String,
      default: "",
    },

    faqs: {
      type: [FAQItemSchema],
      default: [],
    },
  },
  { _id: false }
);

/* ================= MINISTRY ================= */

const MinistrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    shortDesc: {
      type: String,
      trim: true,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    logoPublicId: {
      type: String,
      default: "",
    },

    logoAlt: {
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

    coverAlt: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXES ================= */

MinistrySchema.index({ slug: 1 });
MinistrySchema.index({ isActive: 1 });

export const MinistryModel =
  mongoose.models.Ministry ||
  mongoose.model("Ministry", MinistrySchema);