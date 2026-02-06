import { RouteGenericInterface } from "fastify";

/* =====================================================
   PARAM OBJECTS
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
   BLOG SECTION TYPES
===================================================== */

export type SectionType =
  | "HERO"
  | "CONTENT"
  | "VISION"
  | "FEATURES";

export interface BlogSection {
  order: number;
  type: SectionType;
  isActive: boolean;

  // Flexible optional content fields
  title?: string;
  description?: string;

  // Allow extra dynamic fields
  [key: string]: unknown;
}

/* =====================================================
   ROUTE GENERICS
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
    sections: BlogSection[];
    status?: "DRAFT" | "PUBLISHED";
  };
}

/* =====================================================
   ADMIN LOG ROUTE
===================================================== */

export interface AdminLogsQuery {
  adminId?: string;
  from?: string;
  to?: string;
}

export interface AdminLogsRoute extends RouteGenericInterface {
  Querystring: AdminLogsQuery;
}
