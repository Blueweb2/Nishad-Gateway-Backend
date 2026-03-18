import { FastifyInstance } from "fastify";
import * as SectorController from "../controllers/sector.controller";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

import {
  SectorSlugRoute,
  CreateSectorRoute,
  UpdateSectorRoute,
} from "../types/sector.routes.types";

import { IdRoute } from "../types/common.routes.types";

import {
  createSectorSchema,
  updateSectorSchema,
  sectorIdParamsSchema,
} from "../schemas/sector.schema";

export async function sectorRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  /* ================= ADMIN ================= */

  app.get(
    "/admin",
    { preHandler: adminAccess },
    SectorController.getAdmin
  );

  app.post<CreateSectorRoute>(
    "/admin",
    {
      preHandler: adminAccess,
      schema: createSectorSchema,
    },
    SectorController.createSector
  );

  app.get<IdRoute>(
    "/admin/:id",
    {
      preHandler: adminAccess,
      schema: sectorIdParamsSchema,
    },
    SectorController.getById
  );

  app.put<UpdateSectorRoute>(
    "/admin/:id",
    {
      preHandler: adminAccess,
      schema: {
        ...updateSectorSchema,
        params: sectorIdParamsSchema.params,
      },
    },
    SectorController.updateSector
  );

  app.delete<IdRoute>(
    "/admin/:id",
    {
      preHandler: adminAccess,
      schema: sectorIdParamsSchema,
    },
    SectorController.deleteSector
  );

  /* ================= PUBLIC ================= */

  app.get("/", SectorController.getAllSectors);

  app.get<SectorSlugRoute>(
    "/:slug",
    SectorController.getSectorBySlug
  );
}