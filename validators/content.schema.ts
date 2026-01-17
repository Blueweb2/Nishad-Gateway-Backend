export const upsertSubServiceContentSchema = {
  body: {
    type: "object",
    properties: {
      heroTitle: { type: "string" },
      heroSubtitle: { type: "string" },
      heroImage: { type: "string" },

      introHeading: { type: "string" },
      introText: { type: "string" },

      sections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            heading: { type: "string" },
            text: { type: "string" },
            image: { type: "string" },
          },
        },
      },

      faqs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            q: { type: "string" },
            a: { type: "string" },
          },
        },
      },
    },
  },
};
