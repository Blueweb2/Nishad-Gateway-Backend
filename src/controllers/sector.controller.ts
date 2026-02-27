// sector.controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import * as SectorService from "../services/sector.service";

import {
  CreateSectorRoute,
  UpdateSectorRoute,
  SectorSlugRoute,
} from "../types/sector.routes.types";

import { IdRoute } from "../types/common.routes.types";

/* ================= CREATE ================= */

export const createSector = async (
  req: FastifyRequest<CreateSectorRoute>,
  reply: FastifyReply
) => {
  const sector = await SectorService.createSectorService(req.body);
  return reply.code(201).send(sector);
};

/* ================= GET ALL ================= */

export const getAllSectors = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  const sectors = await SectorService.getAllSectorsService(false);
  return reply.send(sectors);
};

/* ================= GET BY SLUG ================= */

export const getSectorBySlug = async (
  req: FastifyRequest<SectorSlugRoute>,
  reply: FastifyReply
) => {
  const sector = await SectorService.getSectorBySlugService(
    req.params.slug
  );

  return reply.send(sector);
};

/* ================= GET BY ID (ADMIN) ================= */

export const getById = async (
  req: FastifyRequest<IdRoute>,
  reply: FastifyReply
) => {
  const sector = await SectorService.getSectorByIdService(
    req.params.id
  );

  return reply.send(sector);
};

/* ================= UPDATE ================= */

export const updateSector = async (
  req: FastifyRequest<UpdateSectorRoute>,
  reply: FastifyReply
) => {
  const sector = await SectorService.updateSectorService(
    req.params.id,
    req.body
  );

  return reply.send(sector);
};

/* ================= DELETE ================= */

export const deleteSector = async (
  req: FastifyRequest<IdRoute>,
  reply: FastifyReply
) => {
  await SectorService.deleteSectorService(req.params.id);

  return reply.send({ message: "Sector deleted successfully" });
};

/* ================= ADMIN LIST ================= */

export const getAdmin = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  const sectors = await SectorService.getAllSectorsService(true);
  return reply.send(sectors);
};