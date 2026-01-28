

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
  cityImage: {
    type: "string",
    default: "",
  },
  bestSuitedFor: {
    type: "string",
    default: "",
  },
  focus: {
    type: "string",
    default: "",
  },
  tag: {
    type: "string",
    default: "ARTICLE",
  },
  order: {
    type: "number",
    minimum: 0,
    default: 0,
  },
  isActive: {
    type: "boolean",
    default: true,
  },
};

// schemas/city.create.schema.ts

export const createCitySchema = {
  body: {
    type: "object",
    required: ["cityName", "citySlug"],
    additionalProperties: false,
    properties: cityBaseSchema,
  },
};

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
    minProperties: 1, // 👈 IMPORTANT
  },
};