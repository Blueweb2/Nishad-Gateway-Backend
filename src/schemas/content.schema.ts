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
      sectionOrder: { type: "array", items: { type: "string" } },

      heroTitle: { type: "string" },
      heroSubtitle: { type: "string" },
      heroDescription: { type: "string" },
      heroButtonText: { type: "string" },
      heroButtonLink: { type: "string" },
      heroImage: { type: "string" },

      whyHeading: { type: "string" },
      whySlides: { type: "array" },

      entityTableHeading: { type: "string" },
      entityTableColumns: { type: "array" },
      entityTableRows: { type: "array" },

      entityTypesHeading: { type: "string" },
      entityTypesDescription: { type: "string" },
      entityTypesSlides: { type: "array" },

      ownershipHeading: { type: "string" },
      ownershipSlides: { type: "array" },

      entityChooseHeading: { type: "string" },
      entityChooseSubheading: { type: "string" },
      entityChooseQuestions: { type: "array" },

      documentsHeading: { type: "string" },
      documentsSubheading: { type: "string" },

      faqHeading: { type: "string" },
      faqs: { type: "array" },
    },
    additionalProperties: false, // ✅ now safe
  },
};
