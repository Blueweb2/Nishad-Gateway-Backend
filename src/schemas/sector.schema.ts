// src/schemas/sector.schema.ts

/* ================= BLOCK SCHEMA ================= */

export const sectorBlockSchema = {
  type: "object",
  additionalProperties: false,
  required: ["type", "data"],
  properties: {
    _id: { type: "string" },   // ✅ allow uuid
    type: {
      type: "string",
      enum: ["hero", "richContent", "industries", "faq"],
    },
    data: {
      type: "object",
      additionalProperties: true,
    },
  },
};
/* ================= CREATE SECTOR ================= */

export const createSectorSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    required: ["title", "excerpt", "blocks", "coverImage"],
    properties: {
      title: { type: "string", minLength: 3 },
      excerpt: { type: "string", minLength: 10 },

      blocks: {
        type: "array",
        minItems: 1,
        items: sectorBlockSchema,
      },

      coverImage: {
        type: "object",
        additionalProperties: false,
        required: ["url", "alt"],
        properties: {
          url: { type: "string", format: "uri" },
          alt: { type: "string", minLength: 2 },
          publicId: { type: "string" },
        },
      },

      status: {
        type: "string",
        enum: ["draft", "published"],
      },
    },
  },
};
/* ================= UPDATE SECTOR ================= */

export const updateSectorSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 3 },
      excerpt: { type: "string", minLength: 10 },

      blocks: {
        type: "array",
        items: sectorBlockSchema,
      },

      coverImage: {
        type: "object",
        additionalProperties: false,
        properties: {
          url: { type: "string", format: "uri" },
          alt: { type: "string", minLength: 2 },
          publicId: { type: "string" },
        },
      },

      status: {
        type: "string",
        enum: ["draft", "published"],
      },

      order: { type: "number", minimum: 0 },

      metaTitle: { type: "string", minLength: 3 },
      metaDescription: { type: "string", minLength: 10 },
      metaKeywords: {
        type: "array",
        items: { type: "string" },
      },
ogImage: {
  anyOf: [
    { type: "string", format: "uri" },
    { type: "string", maxLength: 0 }
  ]
},    },
  },
};

/* ================= PARAMS ================= */

export const sectorSlugParamsSchema = {
  params: {
    type: "object",
    required: ["slug"],
    properties: {
      slug: { type: "string", minLength: 1 },
    },
  },
};

export const sectorIdParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
};