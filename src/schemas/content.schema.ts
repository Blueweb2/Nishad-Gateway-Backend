// Get content by subId
export const getSubServiceContentSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
  },
};


// Get content by slug
export const getSubServiceContentBySlugSchema = {
  params: {
    type: "object",
    required: ["slug"],
    properties: {
      slug: { type: "string", minLength: 1 },
    },
  },
};



export const upsertSubServiceContentSchema = {
  params: {
    type: "object",
    required: ["subId"],
    properties: {
      subId: { type: "string", minLength: 1 },
    },
  },
  body: {
    type: "object",
    additionalProperties: true, // because content is large and dynamic
  },
};
