

// schemas/city.schema.ts
// schemas/city.schema.ts

export const cityBaseSchema = {
  cityName: {
    type: "string",
    minLength: 2,
    maxLength: 100,
  },

  citySlug: {
    type: "string",
    minLength: 2,
    maxLength: 100,
    pattern: "^[a-z0-9-]+$",
  },

  /* ================= IMAGE ================= */

  cityImage: {
    anyOf: [
      { type: "string", format: "uri" },
      { type: "string", maxLength: 0 }, // allow empty
    ],
  },

  // ✅ NEW
  cityImageAlt: {
    type: "string",
    maxLength: 150,
  },

  // ✅ NEW
  cityImagePublicId: {
    type: "string",
    maxLength: 200,
  },

  /* ================= CONTENT ================= */

  heading: {
    type: "string",
    minLength: 2,
    maxLength: 150,
  },

  description: {
    type: "string",
    maxLength: 2000,
  },

  /* ================= META ================= */

  tag: {
    type: "string",
    enum: ["ARTICLE", "FEATURED", "TRENDING"],
    default: "ARTICLE",
  },

  order: {
    type: "integer",
    minimum: 0,
    default: 0,
  },

  isActive: {
    type: "boolean",
    default: true,
  },
};

// schemas/city.create.schema.ts

// schemas/city.create.schema.ts

export const createCitySchema = {
  body: {
    type: "object",
    required: ["cityName", "citySlug", "heading"],
    additionalProperties: false,
    properties: cityBaseSchema,
  },
};



// schemas/city.update.schema.ts


// schemas/city.update.schema.ts

export const updateCitySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 24, maxLength: 24 },
    },
  },

  body: {
    type: "object",
    additionalProperties: false,
    properties: cityBaseSchema,
    minProperties: 1,
  },
};


// Add Index Validation Schema for GET by ID

export const cityIdParamSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 24, maxLength: 24 },
    },
  },
};

export const getCityByIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 24, maxLength: 24 },
    },
  },
};
