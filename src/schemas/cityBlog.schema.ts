import { idParamSchema } from "./common.params";

/* ======================================================
   SECTION SCHEMA
====================================================== */

export const citySectionSchema = {
  type: "object",
  required: ["id", "type", "content", "order"],
  additionalProperties: false,

  properties: {
    id: {
      type: "string",
      minLength: 1,
    },

    type: {
      type: "string",
      enum: [
        "HERO",
        "CATEGORIES",
        "VISION",
        "INVESTMENT_HIGHLIGHTS",
        "INFRASTRUCTURE",
        "BUSINESS_SETUP_OPTIONS",
        "FEATURE_CARDS",
        "STATS",
        "IMAGE_TEXT",
        "BUSINESS",
        "LIFESTYLE",
        "STEPS",
        "PLACES_GRID",
        "FAQ",
        "CTA",
      ],
    },

    title: { type: "string" },

    content: {
      type: "object",
      minProperties: 1,
    },

    order: {
      type: "number",
      minimum: 1,
    },

    isActive: {
      type: "boolean",
      default: true,
    },
  },

  allOf: [
    {
      if: {
        properties: { type: { const: "HERO" } },
        required: ["type"],
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
              backgroundImagePublicId: { type: "string" },
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
          imagePublicId: { type: "string" },
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
        required: ["mainHeading", "description", "cards"],
        additionalProperties: false,
        properties: {
          mainHeading: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },

          cards: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: [
                "mainImage",
                "subImage",
                "title",
                "subText",
              ],
              additionalProperties: false,
              properties: {
                mainImage: { type: "string", minLength: 1 },
                mainImagePublicId: { type: "string" }, // ✅

                subImage: { type: "string", minLength: 1 },
                subImagePublicId: { type: "string" }, // ✅

                title: { type: "string", minLength: 1 },
                subText: { type: "string", minLength: 1 },
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
          description: { type: "string", minLength: 1 },

          options: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["title", "link"],
              additionalProperties: false,
              properties: {
                title: { type: "string", minLength: 1 },
                link: { type: "string", minLength: 1 },
             
              },
            },
          },

          decisionFlow: { type: "string" },   // ✅ optional
          bottomText: { type: "string" },     // ✅ optional
        },
      },
    },
  },
},


{
  if: {
    properties: { type: { const: "INFRASTRUCTURE" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "description", "slides"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },

          slides: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["imageUrl", "title", "text"],
              additionalProperties: false,
              properties: {
                imageUrl: { type: "string", minLength: 1 },
                imagePublicId: { type: "string" },
                title: { type: "string", minLength: 1 },
                text: { type: "string", minLength: 1 },
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
