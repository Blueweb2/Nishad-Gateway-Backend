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

/* ======================================================
   SLUG VALIDATION
   lowercase letters, numbers, hyphens
====================================================== */

export const slugSchema = {
  type: "string",
  minLength: 2,
  maxLength: 100,
  pattern: "^[a-z0-9-]+$",
};