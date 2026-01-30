import mongoose, { Schema, Document, Types } from "mongoose";
import crypto from "crypto";


export interface ISubServiceContent extends Document {
  subServiceId: Types.ObjectId;

  sectionOrder: string[];


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

// table of contents
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
    knowMoreLabel?: string;
knowMoreUrl?: string;
  }[];


// OWNERSHIP SLIDER
ownershipHeading: string;

// ✅ NEW
ownershipTabOneLabel?: string;
ownershipTabTwoLabel?: string;

ownershipSlides: {
  title: string;       // capsule text
  leftText?: string;   // left text
  rightText?: string;  // right text
  image: string;
}[];



 // ✅ DOCUMENTS REQUIRED (FINAL)
documentsHeading: string;
documentsSubheading: string;

documentEntityTabs: {
  label: string;   // LLC, Branch, RHQ...
  value: string;   // llc, branch, rhq...
}[];

documentGroups: {
  entityValue: string;
  cards: {
    title: string;
    items: string[];
    icon?: string;
  }[];
}[];

  //  LOCATIONS SLIDER
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
        "locations",
        "faq",
      ],
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

    entityTableColumns: {
  type: [
    {
      key: { type: String, default: "" },
      label: { type: String, default: "" },
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


    entityTableRows: [
      {
        id: { type: String, default: () => crypto.randomUUID() },
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
    description: { type: String, default: "" },

    mainImage: { type: String, default: "" },
    subImage: { type: String, default: "" },
  },
],


    // ENTITY CHOOSE SECTION

//  ENTITY CHOOSE SECTION (UPDATED)
entityChooseHeading: { type: String, default: "" },
entityChooseSubheading: { type: String, default: "" },

entityChooseQuestions: {
  type: [
    {
      question: { type: String, default: "" },

      knowMoreLabel: {
        type: String,
        default: "Know more",
      },

      knowMoreUrl: {
        type: String,
        default: "",
      },
    },
  ],
  default: [],
},


// OWNERSHIP SLIDER
ownershipHeading: { type: String, default: "" },

//  NEW TAB LABELS
ownershipTabOneLabel: { type: String, default: "" },
ownershipTabTwoLabel: { type: String, default: "" },

//  UPDATED SLIDES
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




    // DOCUMENTS REQUIRED SECTION

// DOCUMENTS REQUIRED SECTION

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
      entityValue: {
        type: String,
        required: true,
      },
      cards: {
        type: [
          {
            title: {
              type: String,
              default: "",
            },
            items: {
              type: [String],
              default: [],
            },
            icon: {
              type: String,
              default: "",
            },
          },
        ],
        default: [],
      },
    },
  ],
  default: [],
},
// RIGHT SIDE CONTENT (Cards per entity)




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

    // ✅ BLOG META (NEW)
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


export const SubServiceContentModel = mongoose.model<ISubServiceContent>(
  "SubServiceContent",
  SubServiceContentSchema
);
