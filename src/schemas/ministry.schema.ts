export const createMinistrySchema = {
  body: {
    type: "object",
    required: ["title", "slug"],
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      shortDesc: { type: "string" },

      logo: { type: "string" },
      logoAlt: { type: "string" },

      coverImage: { type: "string" },
      coverAlt: { type: "string" },

      blocks: {
        type: "array",
        items: {
          type: "object",

          properties: {
            id: { type: "string" }, 

            type: {
              type: "string",
              enum: ["content", "slider", "cards", "faq"]
            },

            content: { type: "string" },

            heading: { type: "string" },
            subText: { type: "string" },
            bottomText: { type: "string" },

            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                  alt: { type: "string" },
                },
              },
            },

            cards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  iconSvg: { type: "string" },
                  alt: { type: "string" },
                },
              },
            },

            faqImage: { type: "string" },
            faqImageAlt: { type: "string" },

            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  q: { type: "string" },
                  a: { type: "string" }
                }
              }
            }

          }
        }
      }
    }
  }
};

export const updateMinistrySchema = {
  body: {
    type: "object",
    additionalProperties: true,
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      shortDesc: { type: "string" },
      logo: { type: "string" },
      logoAlt: { type: "string" },
      coverImage: { type: "string" },
      coverAlt: { type: "string" },
      blocks: { type: "array" }
    }
  }
};