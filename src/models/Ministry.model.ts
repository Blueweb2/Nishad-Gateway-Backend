import mongoose from "mongoose";

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

    alt: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

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

    alt: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

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

const BlockSchema = new mongoose.Schema(
  {
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
      trim: true,
      default: "",
    },

    subText: {
      type: String,
      trim: true,
      default: "",
    },

    bottomText: {
      type: String,
      trim: true,
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

    logoAlt: {
      type: String,
      default: "",
    },

    coverImage: {
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

/* ----------- Indexes ----------- */

MinistrySchema.index({ slug: 1 });
MinistrySchema.index({ isActive: 1 });

export const MinistryModel =
  mongoose.models.Ministry ||
  mongoose.model("Ministry", MinistrySchema);