import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubServiceContent extends Document {
  subServiceId: Types.ObjectId;

  // HERO
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImage: string;

  // WHY SECTION (Slider)
  whyHeading: string;
  whySlides: {
    title: string;
    description: string;
    image: string;
  }[];
  whyCtaText: string;
  whyCtaLink: string;


  entityTableHeading: string;

entityTableRows: {
  entityType: string;
  ownership: string;
  bestFor: string;
  capital: string;
  regulatoryBody: string;
  timeToSetup: string;
  icon?: string;
}[];


  // INTRO
  introHeading: string;
  introText: string;

  // SECTIONS
  sections: {
    heading: string;
    text: string;
    image?: string;
  }[];

  // FAQ
  faqs: { q: string; a: string }[];

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

    // HERO
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    heroButtonText: { type: String, default: "" },
    heroButtonLink: { type: String, default: "" },
    heroImage: { type: String, default: "" },

    // WHY SECTION (Slider)
    whyHeading: { type: String, default: "" },

    whySlides: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],

    whyCtaText: { type: String, default: "" },
    whyCtaLink: { type: String, default: "" },




    entityTableHeading: { type: String, default: "" },

entityTableRows: [
  {
    entityType: { type: String, default: "" },
    ownership: { type: String, default: "" },
    bestFor: { type: String, default: "" },
    capital: { type: String, default: "" },
    regulatoryBody: { type: String, default: "" },
    timeToSetup: { type: String, default: "" },
    icon: { type: String, default: "" }, // optional
  },
],


    // INTRO
    introHeading: { type: String, default: "" },
    introText: { type: String, default: "" },

    // SECTIONS
    sections: [
      {
        heading: { type: String, default: "" },
        text: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],

    // FAQ
    faqs: [
      {
        q: { type: String, default: "" },
        a: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export const SubServiceContentModel = mongoose.model<ISubServiceContent>(
  "SubServiceContent",
  SubServiceContentSchema
);
