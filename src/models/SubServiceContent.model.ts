import mongoose, { Schema, Document, Types, HydratedDocument } from "mongoose";
import crypto from "crypto";

/* ================= TYPES ================= */

export interface ISubServiceContent extends Document {
  subServiceId: Types.ObjectId;

  sectionOrder: string[];

  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImage: string;

  whyHeading: string;
  whySlides: {
    title: string;
    description: string;
    image: string;
  }[];
  whyCtaText: string;
  whyCtaLink: string;

  entityTableHeading: string;

  entityTableColumns: {
    key: string;
    label: string;
  }[];

  entityTableRows: {
    id: string;
    entityType: string;
    ownership: string;
    bestFor: string;
    capital: string;
    regulatoryBody: string;
    timeToSetup: string;
    icon?: string;
  }[];

  entityTypesHeading: string;
  entityTypesDescription: string;
  entityTypesSlides: {
    title: string;
    description?: string;
    mainImage: string;
    subImage: string;
  }[];

  entityChooseHeading: string;
  entityChooseSubheading: string;
  entityChooseQuestions: {
    description: string;
    linkUrl: string;
  }[];

  ownershipHeading: string;
  ownershipTabOneLabel?: string;
  ownershipTabTwoLabel?: string;
  ownershipSlides: {
    title: string;
    leftText?: string;
    rightText?: string;
    image: string;
  }[];

  documentsHeading: string;
  documentsSubheading: string;

  documentEntityTabs: {
    label: string;
    value: string;
  }[];

  documentGroups: {
    entityValue: string;
    cards: {
      title: string;
      items: string[];
      icon?: string;
    }[];
  }[];

  faqHeading: string;
  faqImage?: string;
  faqCtaText?: string;
  faqs: { q: string; a: string }[];

  status?: "draft" | "published";
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

type Doc = HydratedDocument<ISubServiceContent>;

/* ================= SCHEMA ================= */

const SubServiceContentSchema = new Schema<ISubServiceContent>(
  {
    subServiceId: {
      type: Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
      unique: true,
      index: true, // 🔥 IMPORTANT
    },

    sectionOrder: {
      type: [String],
      default: [
        "hero",
        "why",
        "entityTable",
        "entityTypes",
        "ownership",
        "entityChoose",
        "documents",
        "faq",
      ],
    },

    /* ================= HERO ================= */
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    heroButtonText: { type: String, default: "" },
    heroButtonLink: { type: String, default: "" },
    heroImage: { type: String, default: "" },

    /* ================= WHY ================= */
    whyHeading: { type: String, default: "" },
    whySlides: {
      type: [
        {
          title: String,
          description: String,
          image: String,
        },
      ],
      default: [],
    },
    whyCtaText: { type: String, default: "" },
    whyCtaLink: { type: String, default: "" },

    /* ================= ENTITY TABLE ================= */
    entityTableHeading: { type: String, default: "" },

    entityTableColumns: {
      type: [
        {
          key: { type: String, required: true },
          label: { type: String, required: true },
        },
      ],
      default: [
        { key: "entityType", label: "Entity Type" },
        { key: "ownership", label: "Ownership" },
        { key: "bestFor", label: "Best For" },
        { key: "capital", label: "Capital" },
        { key: "regulatoryBody", label: "Regulatory Body" },
        { key: "timeToSetup", label: "Time to Setup" },
      ],
    },

    entityTableRows: {
      type: [
        {
          id: {
            type: String,
            default: () => crypto.randomUUID(),
          },
          entityType: String,
          ownership: String,
          bestFor: String,
          capital: String,
          regulatoryBody: String,
          timeToSetup: String,
          icon: String,
        },
      ],
      default: [],
    },

    /* ================= ENTITY TYPES ================= */
    entityTypesHeading: { type: String, default: "" },
    entityTypesDescription: { type: String, default: "" },

    entityTypesSlides: {
      type: [
        {
          title: String,
          description: String,
          mainImage: String,
          subImage: String,
        },
      ],
      default: [],
    },

    /* ================= ENTITY CHOOSE ================= */
    entityChooseHeading: { type: String, default: "" },
    entityChooseSubheading: { type: String, default: "" },

    entityChooseQuestions: {
      type: [
        {
          description: String,
          linkUrl: String,
        },
      ],
      default: [],
    },

    /* ================= OWNERSHIP ================= */
    ownershipHeading: { type: String, default: "" },
    ownershipTabOneLabel: { type: String, default: "" },
    ownershipTabTwoLabel: { type: String, default: "" },

    ownershipSlides: {
      type: [
        {
          title: String,
          leftText: String,
          rightText: String,
          image: String,
        },
      ],
      default: [],
    },

    /* ================= DOCUMENTS ================= */
    documentsHeading: { type: String, default: "" },
    documentsSubheading: { type: String, default: "" },

    documentEntityTabs: {
      type: [
        {
          label: String,
          value: { type: String, required: true },
        },
      ],
      default: [],
    },

    documentGroups: {
      type: [
        {
          entityValue: { type: String, required: true },
          cards: [
            {
              title: String,
              items: [String],
              icon: String,
            },
          ],
        },
      ],
      default: [],
    },

    /* ================= FAQ ================= */
    faqHeading: {
      type: String,
      default: "Frequently Asked Questions",
    },
    faqImage: String,
    faqCtaText: String,

    faqs: {
      type: [
        {
          q: String,
          a: String,
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* ================= AUTO PUBLISH ================= */

SubServiceContentSchema.pre("save", function (this: Doc) {
  if (this.isModified("status") && this.status === "published") {
    this.publishedAt = new Date();
  }
});

/* ================= MODEL ================= */

export const SubServiceContentModel =
  mongoose.models.SubServiceContent ||
  mongoose.model<ISubServiceContent>(
    "SubServiceContent",
    SubServiceContentSchema
  );