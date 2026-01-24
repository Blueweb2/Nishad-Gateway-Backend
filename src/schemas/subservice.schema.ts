// src/schemas/subservice.schema.ts

export const getSubServicesByServiceSchema = {
  params: {
    type: "object",
    required: ["serviceId"],
    properties: {
      serviceId: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

export const createSubServiceSchema = {
  params: {
    type: "object",
    required: ["serviceId"],
    properties: {
      serviceId: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

export const updateSubServiceSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

export const deleteSubServiceSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};
