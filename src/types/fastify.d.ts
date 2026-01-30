import { RouteGenericInterface } from "fastify";

/* =====================================================
   PARAM OBJECTS (Pure Interfaces)
===================================================== */

export interface IdParams {
  id: string;
}

export interface CityIdParams {
  cityId: string;
}

export interface CityCategoryParams {
  cityId: string;
  categoryId: string;
}

export interface CitySlugParams {
  citySlug: string;
}

/* =====================================================
   ROUTE GENERIC TYPES (Fastify Compatible)
===================================================== */

export interface IdRoute extends RouteGenericInterface {
  Params: IdParams;
}

export interface CitySlugRoute extends RouteGenericInterface {
  Params: CitySlugParams;
}

export interface CityCategoryRoute extends RouteGenericInterface {
  Params: CityCategoryParams;
}

export interface CityBlogUpsertRoute extends RouteGenericInterface {
  Params: IdParams;
  Body: {
    sections: any[];
    status?: "DRAFT" | "PUBLISHED";
  };
}
