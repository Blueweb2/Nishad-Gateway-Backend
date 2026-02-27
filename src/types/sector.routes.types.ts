import { RouteGenericInterface } from "fastify";
import { CreateSectorDTO, UpdateSectorDTO } from "./sector.types";
import { IdParams } from "./common.routes.types";

/* =====================================================
   SECTOR PARAMS
===================================================== */

export interface SectorSlugParams {
  slug: string;
}

/* =====================================================
   SECTOR ROUTES
===================================================== */

export interface SectorSlugRoute extends RouteGenericInterface {
  Params: SectorSlugParams;
}

export interface CreateSectorRoute extends RouteGenericInterface {
  Body: CreateSectorDTO;
}

export interface UpdateSectorRoute extends RouteGenericInterface {
  Params: IdParams;
  Body: UpdateSectorDTO;
}