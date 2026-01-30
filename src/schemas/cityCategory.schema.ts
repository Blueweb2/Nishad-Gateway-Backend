/* ===============================
   PARAM SCHEMAS
================================ */

export const cityIdParamSchema = {
  type: "object",
  required: ["cityId"],
  properties: {
    cityId: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};

export const categoryIdParamSchema = {
  type: "object",
  required: ["cityId", "categoryId"],
  properties: {
    cityId: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
    categoryId: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};

// Create Body Schema
export const createCityCategoryBodySchema = {
  type: "object",
  required: ["name", "slug"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 2, maxLength: 100 },

    slug: {
      type: "string",
      pattern: "^[a-z0-9-]+$",
    },

    description: { type: "string", maxLength: 500 },

    order: { type: "number", minimum: 0, default: 0 },

    isActive: { type: "boolean", default: true },
  },
};



// Update Body Schema
export const updateCityCategoryBodySchema = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: {
    name: { type: "string", minLength: 2, maxLength: 100 },

    slug: {
      type: "string",
      pattern: "^[a-z0-9-]+$",
    },

    description: { type: "string", maxLength: 500 },

    order: { type: "number", minimum: 0 },

    isActive: { type: "boolean" },
  },
};