import { RouteGenericInterface } from "fastify";

/* =====================================================
   COMMON PARAM TYPES
===================================================== */

export interface IdParams {
  id: string;
}

export interface IdRoute extends RouteGenericInterface {
  Params: IdParams;
}