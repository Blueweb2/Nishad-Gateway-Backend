// Get content by subId
export const getSubServiceContentSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
  },
};

// Get content by slug
export const getSubServiceContentBySlugSchema = {
  params: {
    type: "object",
    required: ["slug"],
    properties: {
      slug: { type: "string", minLength: 1 },
    },
  },
};

// Upsert content
export const upsertSubServiceContentSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
  },

  body: {
    type: "object",

    properties: {
      sectionOrder: {
        type: "array",
        items: { type: "string" },
      },

      // HERO
      heroTitle: { type: "string" },
      heroSubtitle: { type: "string" },
      heroDescription: { type: "string" },
      heroButtonText: { type: "string" },
      heroButtonLink: { type: "string" },
      heroImage: { type: "string" },

      // WHY
      whyHeading: { type: "string" },
      whySlides: { type: "array" },

      // ENTITY TABLE
      entityTableHeading: { type: "string" },
      entityTableColumns: { type: "array" },
      entityTableRows: { type: "array" },

      // ENTITY TYPES
      entityTypesHeading: { type: "string" },
      entityTypesDescription: { type: "string" },
      entityTypesSlides: { type: "array" },

      // OWNERSHIP
      ownershipHeading: { type: "string" },
      ownershipSlides: { type: "array" },

      // ✅ ENTITY CHOOSE (IMPORTANT FIX)
      entityChooseHeading: { type: "string" },
      entityChooseSubheading: { type: "string" },

      entityChooseQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            linkUrl: { type: "string" },
          },
          additionalProperties: false,
        },
      },

      // DOCUMENTS
      documentsHeading: { type: "string" },
      documentsSubheading: { type: "string" },

      // FAQ
      faqHeading: { type: "string" },
      faqs: { type: "array" },
    },

    additionalProperties: true, // allows other large sections safely
  },
};