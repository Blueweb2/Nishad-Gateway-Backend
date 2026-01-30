export const citySectionSchema = {
  type: "object",
  required: ["type", "content"],
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      enum: [
        "HERO",
        "CATEGORIES",
        "INTRO_TEXT",
        "FEATURE_CARDS",
        "STATS",
        "IMAGE_TEXT",
        "BUSINESS",
        "LIFESTYLE",
        "STEPS",
        "INFRASTRUCTURE",
        "PLACES_GRID",
        "FAQ",
        "CTA",
      ],
    },

    title: { type: "string" },

    content: { type: "object" },

    order: {
      type: "number",
      minimum: 0,
    },

    isActive: {
      type: "boolean",
    },
  },

  allOf: [
    {
      if: {
        properties: { type: { const: "CATEGORIES" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["categories", "introText"],
            properties: {
              categories: {
                type: "array",
                items: {
                  type: "object",
                  required: ["label", "link"],
                  properties: {
                    label: { type: "string" },
                    link: { type: "string" },
                  },
                },
              },
              introText: { type: "string" },
            },
          },
        },
      },
    },
  ],
};

export const updateCityBlogSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 24, maxLength: 24 },
    },
  },

  body: {
    type: "object",
    required: ["sections"],
    additionalProperties: false,
    properties: {
      sections: {
        type: "array",
        items: citySectionSchema,
        minItems: 1,
      },

      status: {
        type: "string",
        enum: ["DRAFT", "PUBLISHED"],
      },
    },
  },
};


/* =========================================
   PARAM VALIDATION
========================================= */

export const cityIdParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};

export const citySlugParamSchema = {
  type: "object",
  required: ["citySlug"],
  properties: {
    citySlug: {
      type: "string",
      minLength: 2,
      maxLength: 100,
      pattern: "^[a-z0-9-]+$",
    },
  },
};