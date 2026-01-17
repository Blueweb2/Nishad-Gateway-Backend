export const createSubServiceSchema = {
  body: {
    type: "object",
    required: ["title", "slug"],
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      shortDesc: { type: "string" },
      thumbnail: { type: "string" },
      order: { type: "number" },
      isActive: { type: "boolean" },
    },
  },
};

export const updateSubServiceSchema = {
  body: {
    type: "object",
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      shortDesc: { type: "string" },
      thumbnail: { type: "string" },
      order: { type: "number" },
      isActive: { type: "boolean" },
    },
  },
};
