import { RouteGenericInterface } from "fastify";

/* ======================================================
   ID PARAM VALIDATION
====================================================== */

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
====================================================== */

export const slugSchema = {
  type: "string",
  minLength: 2,
  maxLength: 100,
  pattern: "^[a-z0-9-]+$",
};

/* =====================================================
   ADMIN LOG QUERY VALIDATION
===================================================== */

export const adminLogsQuerySchema = {
  type: "object",
  properties: {
    adminId: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
    from: {
      type: "string",
      format: "date-time",
    },
    to: {
      type: "string",
      format: "date-time",
    },
  },
  additionalProperties: false,
};

/* =====================================================
   ADMIN LOG ROUTE TYPES
===================================================== */

export interface AdminLogsQuery {
  adminId?: string;
  from?: string;
  to?: string;
}

export interface AdminLogsRoute extends RouteGenericInterface {
  Querystring: AdminLogsQuery;
}
