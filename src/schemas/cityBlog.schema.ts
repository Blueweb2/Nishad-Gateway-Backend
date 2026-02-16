import { idParamSchema } from "./common.params";

/* ======================================================
   SECTION SCHEMA
====================================================== */

export const citySectionSchema = {
  type: "object",
  required: ["id", "type", "content", "order"],
  additionalProperties: false,

  properties: {
    id: {
      type: "string",
      minLength: 1,
    },

    type: {
      type: "string",
      enum: [
        "HERO",
        "CATEGORIES",
        "VISION",
        "INVESTMENT_HIGHLIGHTS",
        "INFRASTRUCTURE",
        "BUSINESS_SETUP_OPTIONS",
        "LANDMARKS",
        "FOOD_GUIDE",
        "TRANSPORTATION_GUIDE",
        "EXPANDABLE_SNAPSHOT",
        "FUTURE_OUTLOOK",
      ],
    },

    title: { type: "string" },

    content: {
      type: "object",
      minProperties: 1,
    },

    order: {
      type: "number",
      minimum: 1,
    },

    isActive: {
      type: "boolean",
      default: true,
    },
  },

  allOf: [
    {
      if: {
        properties: { type: { const: "HERO" } },
        required: ["type"],
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "subheading", "backgroundImage"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              subheading: { type: "string" },
              backgroundImage: { type: "string" },
              backgroundImagePublicId: { type: "string" },
              ctaText: { type: "string" },
              ctaLink: { type: "string" },
            },
          },
        },
      },
    },


    /* ================= CATEGORIES ================= */
    {
      if: {
        properties: { type: { const: "CATEGORIES" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "introText"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              introText: { type: "string" },
            },
          },
        },
      },
    },

    /* ================= VISION ================= */
    {
      if: {
        properties: { type: { const: "VISION" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "content", "imageUrl"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              content: { type: "string" },
              imageUrl: { type: "string" },
              imagePublicId: { type: "string" },
            },
          },
        },
      },
    },

    /* ================= INVESTMENT HIGHLIGHTS ================= */
    {
      if: {
        properties: { type: { const: "INVESTMENT_HIGHLIGHTS" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["mainHeading", "description", "cards"],
            additionalProperties: false,
            properties: {
              mainHeading: { type: "string", minLength: 1 },
              description: { type: "string", minLength: 1 },

              cards: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: [
                    "mainImage",
                    "subImage",
                    "title",
                    "subText",
                  ],
                  additionalProperties: false,
                  properties: {
                    mainImage: { type: "string", minLength: 1 },
                    mainImagePublicId: { type: "string" }, // ✅

                    subImage: { type: "string", minLength: 1 },
                    subImagePublicId: { type: "string" }, // ✅

                    title: { type: "string", minLength: 1 },
                    subText: { type: "string", minLength: 1 },
                  },
                },
              },
            },
          },
        },
      },
    },



    /* ================= BUSINESS SETUP OPTIONS ================= */
    {
      if: {
        properties: { type: { const: "BUSINESS_SETUP_OPTIONS" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "description", "options"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              description: { type: "string", minLength: 1 },

              options: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: ["title", "link"],
                  additionalProperties: false,
                  properties: {
                    title: { type: "string", minLength: 1 },
                    link: { type: "string", minLength: 1 },

                  },
                },
              },

              decisionFlow: { type: "string" },   // ✅ optional
              bottomText: { type: "string" },     // ✅ optional
            },
          },
        },
      },
    },


    {
      if: {
        properties: { type: { const: "INFRASTRUCTURE" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "description", "slides"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              description: { type: "string", minLength: 1 },

              slides: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: ["imageUrl", "title", "text"],
                  additionalProperties: false,
                  properties: {
                    imageUrl: { type: "string", minLength: 1 },
                    imagePublicId: { type: "string" },
                    title: { type: "string", minLength: 1 },
                    text: { type: "string", minLength: 1 },
                  },
                },
              },
            },
          },
        },
      },
    },



    /* ================= LANDMARKS ================= */
    {
      if: {
        properties: { type: { const: "LANDMARKS" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "items"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },

              ctaText: { type: "string" },
              ctaLink: { type: "string" },

              items: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: ["title", "description", "link"], // ✅ updated
                  additionalProperties: false,
                  properties: {
                    title: { type: "string", minLength: 1 },
                    description: { type: "string", minLength: 1 },
                    link: { type: "string", minLength: 1 }, // ✅ added
                  },
                },
              },
            },
          },
        },
      },
    },



    /* ================= FOOD GUIDE ================= */
    {
      if: {
        properties: { type: { const: "FOOD_GUIDE" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "filters"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },

              filters: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: ["label", "items"],
                  additionalProperties: false,
                  properties: {
                    label: { type: "string", minLength: 1 },

                    items: {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "object",
                        required: [
                          "imageUrl",
                          "title",
                          "description",
                          "link"
                        ],
                        additionalProperties: false,
                        properties: {
                          imageUrl: { type: "string", minLength: 1 },
                          imagePublicId: { type: "string" },
                          title: { type: "string", minLength: 1 },
                          description: { type: "string", minLength: 1 },
                          link: { type: "string", minLength: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },



    /* ================= TRANSPORTATION GUIDE ================= */
    {
      if: {
        properties: { type: { const: "TRANSPORTATION_GUIDE" } },
      },
      then: {
        properties: {
          content: {
            type: "object",
            required: ["heading", "slides"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },

              slides: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  required: [
                    "label",
                    "backgroundImage",
                    "title",
                    "link"
                  ],
                  additionalProperties: false,
                  properties: {
                    label: { type: "string", minLength: 1 },
                    backgroundImage: { type: "string", minLength: 1 },
                    backgroundImagePublicId: { type: "string" },
                    title: { type: "string", minLength: 1 },
                    link: { type: "string", minLength: 1 }
                  }
                }
              }
            }
          }
        }
      }
    },



    {
  if: {
    properties: { type: { const: "EXPANDABLE_SNAPSHOT" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "cards"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },

          cards: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              required: ["imageUrl", "caption"],
              additionalProperties: false,
              properties: {
                imageUrl: { type: "string", minLength: 1 },
                imagePublicId: { type: ["string", "null"] },
                caption: { type: "string", minLength: 1 }
              }
            }
          }
        }
      }
    }
  }
},



{
  if: {
    properties: { type: { const: "FUTURE_OUTLOOK" } },
  },
  then: {
    properties: {
      content: {
        type: "object",
        required: ["heading", "slides"],
        additionalProperties: false,
        properties: {
          heading: { type: "string", minLength: 1 },

          slides: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: [
                "title",
                "description",
                "imageUrl",
                "ctaText",
                "ctaLink"
              ],
              additionalProperties: false,
              properties: {
                title: { type: "string", minLength: 1 },
                description: { type: "string", minLength: 1 },
                imageUrl: { type: "string", minLength: 1 },
                imagePublicId: { type: "string" },
                ctaText: { type: "string", minLength: 1 },
                ctaLink: { type: "string", minLength: 1 }
              }
            }
          }
        }
      }
    }
  }
}




  ],
};

/* ======================================================
   UPDATE BLOG (UPSERT)
   Allows:
   - sections only
   - status only
   - both
====================================================== */

export const updateCityBlogSchema = {
  params: idParamSchema,

  body: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,

    properties: {
      sections: {
        type: "array",
        items: citySectionSchema,
        minItems: 1,
      },

      status: {
        type: "string",
        enum: ["DRAFT", "PUBLISHED"],
      },
    },
  },
};

/* ======================================================
   SLUG PARAM (PUBLIC)
====================================================== */

export const citySlugParamSchema = {
  type: "object",
  required: ["citySlug"],
  properties: {
    citySlug: {
      type: "string",
      minLength: 2,
      maxLength: 100,
      pattern: "^[a-z0-9-]+$",
    },
  },
};
