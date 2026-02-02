// schemas/common.params.ts

export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};
