export const createServiceSchema = {
  body: {
    type: "object",
    required: ["index", "title", "slug", "isActive"],
    properties: {
      index: { type: "string", minLength: 1 },
      title: { type: "string", minLength: 2 },
      slug: { type: "string", minLength: 2 },
      isActive: { type: "boolean" },
    },
    additionalProperties: false,
  },
};

export const updateServiceSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
  body: {
    type: "object",
    properties: {
      index: { type: "string", minLength: 1 },
      title: { type: "string", minLength: 2 },
      slug: { type: "string", minLength: 2 },
      isActive: { type: "boolean" },
    },
    additionalProperties: false,
  },
};


export const getServiceBySlugSchema = {
  params: {
    type: "object",
    required: ["slug"],
    properties: {
      slug: { type: "string", minLength: 1 },
    },
  },
};


export const deleteServiceSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
};
