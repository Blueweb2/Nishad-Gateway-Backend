export const createLeadSchema = {
  body: {
    type: "object",
    required: [
      "fullName",
      "email",
      "mobile",
      "investorType",
      "activity",
      "city",
      "timeline",
      "visas",
      "supports",
      "estimate",
    ],
    properties: {
      fullName: { type: "string", minLength: 2 },
      email: { type: "string", format: "email" },
      mobile: { type: "string", minLength: 6 },

      investorType: { type: "string", minLength: 1 },
      activity: { type: "string", minLength: 1 },
      city: { type: "string", minLength: 1 },
      timeline: { type: "string", minLength: 1 },
      visas: { type: "number", minimum: 0 },

      supports: {
        type: "object",
        required: ["bankSupport", "accountingSupport", "vroSupport"],
        properties: {
          bankSupport: { type: "boolean" },
          accountingSupport: { type: "boolean" },
          vroSupport: { type: "boolean" },
        },
        additionalProperties: false,
      },

      estimate: {
        type: "object",
        required: [
          "min",
          "max",
          "timelineText",
          "recommendedSetup",
          "suggestedCity",
        ],
        properties: {
          min: { type: "number", minimum: 0 },
          max: { type: "number", minimum: 0 },
          timelineText: { type: "string", minLength: 1 },
          recommendedSetup: { type: "string", minLength: 1 },
          suggestedCity: { type: "string", minLength: 1 },
        },
        additionalProperties: false,
      },

      aiReply: { type: "string" },
      source: { type: "string" },
      status: {
        type: "string",
        enum: ["new", "contacted", "converted", "closed"],
      },
    },
    additionalProperties: false,
  },
};
