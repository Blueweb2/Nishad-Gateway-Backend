import { idParamSchema } from "./common.params";

/* ======================================================
   SECTION SCHEMA
====================================================== */

export const citySectionSchema = {
  type: "object",
  required: ["id", "type", "content", "order"],
  additionalProperties: false,

  properties: {
    type: {
      type: "string",
      enum: [
        "HERO",
        "CATEGORIES",
        "VISION",
        "INVESTMENT_HIGHLIGHTS",
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
      default: true,
    },
  },

  allOf: [
    /* ================= HERO ================= */
    {
      if: {
        properties: { type: { const: "HERO" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "subheading", "backgroundImage"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              subheading: { type: "string" },
              backgroundImage: { type: "string" },
              ctaText: { type: "string" },
              ctaLink: { type: "string" },
            },
          },
        },
      },
    },

    /* ================= CATEGORIES ================= */
    {
      if: {
        properties: { type: { const: "CATEGORIES" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "introText"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              introText: { type: "string" },
            },
          },
        },
      },
    },

    /* ================= VISION ================= */
{
  if: {
    properties: { type: { const: "VISION" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "content", "imageUrl"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },
          content: { type: "string" },
          imageUrl: { type: "string" },
        },
      },
    },
  },
},

/* ================= INVESTMENT HIGHLIGHTS ================= */
{
  if: {
    properties: { type: { const: "INVESTMENT_HIGHLIGHTS" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "description", "highlights"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },
          description: { type: "string" },
          highlights: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["number", "title", "imageUrl"],
              additionalProperties: false,
              properties: {
                number: { type: "string" },
                title: { type: "string" },
                imageUrl: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
},

/* ================= BUSINESS SETUP OPTIONS ================= */
{
  if: {
    properties: { type: { const: "BUSINESS_SETUP_OPTIONS" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "description", "options"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },
          description: { type: "string" },
          options: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["title", "link"],
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                link: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
},

/* ---------- NATURE PARKS ---------- */







  ],
};

/* ======================================================
   UPDATE BLOG (UPSERT)
   Allows:
   - sections only
   - status only
   - both
====================================================== */

export const updateCityBlogSchema = {
  params: idParamSchema,

  body: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,

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

/* ======================================================
   SLUG PARAM (PUBLIC)
====================================================== */

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
