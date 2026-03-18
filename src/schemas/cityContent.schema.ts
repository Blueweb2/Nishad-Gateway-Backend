export const createCityContentSchema = {
  body: {
    type: "object",
    required: ["title", "slug", "type"],
    properties: {
      cityId: {
        type: "string",
      },

      categoryId: {
        type: "string",
      },

      placeId: {
        type: "string",
        nullable: true
      },

      title: {
        type: "string",
        minLength: 2,
        maxLength: 200,
      },

      slug: {
        type: "string",
        minLength: 2,
      },

      description: {
        type: "string",
      },

      /* ADD THIS */
      content: {
        type: "string",
      },

      image: {
        type: "string",
      },

      type: {
        type: "string",
        enum: ["overview", "listing"],
      },

      address: {
        type: "string",
      },

      phone: {
        type: "string",
      },

      website: {
        type: "string",
      },

      order: {
        type: "number",
        minimum: 0,
      },

      isActive: {
        type: "boolean",
      }
    }
  }
};

export const updateCityContentSchema = {
  body: {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 2,
      },

      slug: {
        type: "string",
      },

      description: {
        type: "string",
      },

      image: {
        type: "string",
      },

      type: {
        type: "string",
        enum: ["overview", "article", "place", "business"],
      },

      placeId: {
        type: "string",
        nullable: true
      },

      address: {
        type: "string",
      },

      phone: {
        type: "string",
      },

      website: {
        type: "string",
      },

      order: {
        type: "number",
      },

      isActive: {
        type: "boolean",
      }
    }
  }
};