import mongoose, { Schema, Document, Types } from "mongoose";
import crypto from "crypto";

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

  introHeading: string;
  introText: string;

  sections: {
    heading: string;
    text: string;
    image?: string;
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

const SubServiceContentSchema = new Schema<ISubServiceContent>(
  {
    subServiceId: {
      type: Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
      unique: true,
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
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          image: { type: String, default: "" },
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
          key: {
            type: String,
            required: true,   // ✅ key must exist
            trim: true,
          },
          label: {
            type: String,
            required: true,   // ✅ label must exist
            trim: true,
          },
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

    // ✅ FIXED — No auto default row
    entityTableRows: {
      type: [
        {
          id: {
            type: String,
            default: () => crypto.randomUUID(),
          },
          entityType: { type: String, default: "" },
          ownership: { type: String, default: "" },
          bestFor: { type: String, default: "" },
          capital: { type: String, default: "" },
          regulatoryBody: { type: String, default: "" },
          timeToSetup: { type: String, default: "" },
          icon: { type: String, default: "" },
        },
      ],
      default: [],   // ✅ Important fix
    },

    /* ================= ENTITY TYPES ================= */

    entityTypesHeading: { type: String, default: "" },
    entityTypesDescription: { type: String, default: "" },

    entityTypesSlides: {
      type: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          mainImage: { type: String, default: "" },
          subImage: { type: String, default: "" },
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
          title: { type: String, default: "" },
          leftText: { type: String, default: "" },
          rightText: { type: String, default: "" },
          image: { type: String, default: "" },
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
          label: { type: String, default: "" },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },

    documentGroups: {
      type: [
        {
          entityValue: { type: String, required: true },
          cards: {
            type: [
              {
                title: { type: String, default: "" },
                items: { type: [String], default: [] },
                icon: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },

    /* ================= FAQ ================= */

    faqHeading: {
      type: String,
      default: "Frequently Asked Questions",
    },
    faqImage: { type: String, default: "" },
    faqCtaText: { type: String, default: "" },

    faqs: {
      type: [
        {
          q: { type: String, default: "" },
          a: { type: String, default: "" },
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const SubServiceContentModel =
  mongoose.model<ISubServiceContent>(
    "SubServiceContent",
    SubServiceContentSchema
  );
