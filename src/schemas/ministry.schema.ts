export const createMinistrySchema = {
  body: {
    type: "object",
    required: ["title", "slug"],
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      shortDesc: { type: "string" },
      logo: { type: "string" },
      coverImage: { type: "string" },
      blocks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string" },

            content: { type: "string" },

            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                },
              },
            },

            cards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  icon: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};