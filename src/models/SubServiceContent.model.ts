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

// ✅ ENTITY TYPES SLIDER 
entityTypesHeading: string;
entityTypesDescription: string;
entityTypesSlides: {
  title: string;
  image: string;
  description?: string;
}[];

// ENTITY CHOOSE SECTION

entityChooseHeading: string;
entityChooseSubheading: string;
entityChooseQuestions: {
  question: string;
  options: { label: string; value: string }[];
  selectedValue?: string;
}[];


documentsHeading: string;
documentsSubheading: string;

documentEntityTabs: {
  label: string; // LLC, Branch, RHQ...
  value: string; // llc, branch...
}[];

documentGroups: {
  entityValue: string; // link to tab value
  cards: {
    title: string; // Individual Shareholder
    items: string[]; // Passport copy, etc
    icon?: string; // optional
  }[];
}[];


// ✅ LOCATIONS SLIDER
locationsHeading: string;
locationsSubheading: string;
locationsSlides: {
  title: string;
  description: string;
  image: string;
  tag?: string; // ex: ARTICLE
  link?: string; // optional click
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
  faqHeading: string;

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

  // ✅ ENTITY TYPES SLIDER (NEW)
entityTypesHeading: { type: String, default: "" },
entityTypesDescription: { type: String, default: "" },

entityTypesSlides: [
  {
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
  },
],


entityChooseHeading: { type: String, default: "" },
entityChooseSubheading: { type: String, default: "" },
entityChooseQuestions: [
  {
    question: { type: String, default: "" },
    options: [
      {
        label: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    selectedValue: { type: String, default: "" },
  },
],


documentsHeading: { type: String, default: "" },
documentsSubheading: { type: String, default: "" },

documentEntityTabs: {
  type: [
    {
      label: { type: String, default: "" },
      value: { type: String, default: "" },
    },
  ],
  default: [],
},

documentGroups: {
  type: [
    {
      entityValue: { type: String, default: "" },
      cards: [
        {
          title: { type: String, default: "" },
          items: { type: [String], default: [] },
          icon: { type: String, default: "" },
        },
      ],
    },
  ],
  default: [],
},



// ✅ LOCATIONS SLIDER
locationsHeading: { type: String, default: "" },
locationsSubheading: { type: String, default: "" },

locationsSlides: {
  type: [
    {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      tag: { type: String, default: "ARTICLE" },
      link: { type: String, default: "" },
    },
  ],
  default: [],
},



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

    faqHeading: { type: String, default: "Frequently Asked Questions" },

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
