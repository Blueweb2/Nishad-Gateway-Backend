export const createServiceSchema = {
  body: {
    type: "object",
    required: ["index", "title", "slug"],
    properties: {
      index: { type: "string" },
      title: { type: "string" },
      slug: { type: "string" },
      isActive: { type: "boolean" },
    },
  },
};

export const updateServiceSchema = {
  body: {
    type: "object",
    properties: {
      index: { type: "string" },
      title: { type: "string" },
      slug: { type: "string" },
      isActive: { type: "boolean" },
    },
  },
};
