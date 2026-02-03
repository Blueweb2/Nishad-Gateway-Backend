/* ======================================================
   SLUG VALIDATION SCHEMA
   Allows: lowercase letters, numbers, hyphens
   Example:
     mecca
     food
     how-to-perform-umrah
====================================================== */

export const slugSchema = {
  type: "string",
  minLength: 2,
  maxLength: 100,
  pattern: "^[a-z0-9-]+$",
};
