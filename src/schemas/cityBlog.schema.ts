export const citySectionSchema = {
  type: "object",
  required: ["type", "content"],
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      enum: ["HERO", "INTRO", "BUSINESS", "LIFESTYLE", "FAQ", "CTA"],
    },

    title: { type: "string" },

    content: {
      type: ["object", "array", "string"],
    },

    order: {
      type: "number",
      minimum: 0,
    },

    isActive: {
      type: "boolean",
    },
  },
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
    },
  },
};