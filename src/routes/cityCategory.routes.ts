import { FastifyInstance } from "fastify";
import { CityCategoryController } from "../controllers/cityCategory.controller";

import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

import {
  cityIdParamSchema,
  categoryIdParamSchema,
  createCityCategoryBodySchema,
  updateCityCategoryBodySchema,
} from "../schemas/cityCategory.schema";

import type {
  CityIdParams,
  CityCategoryParams
} from "../types/routes.types";

export default async function cityCategoryRoutes(app: FastifyInstance) {

  /* ================= PUBLIC ================= */

  app.get<{ Params: CityIdParams }>(
    "/cities/:cityId/categories",
    { schema: { params: cityIdParamSchema } },
    CityCategoryController.getByCityId
  );

  app.get<{ Params: CityCategoryParams }>(
    "/cities/:cityId/categories/:categoryId",
    { schema: { params: categoryIdParamSchema } },
    CityCategoryController.getById
  );

  /* ================= ADMIN ================= */

  app.get<{ Params: CityIdParams }>(
    "/admin/cities/:cityId/categories",
    {
      preHandler: [auth, adminOnly],
      schema: { params: cityIdParamSchema },
    },
    CityCategoryController.getByCityId
  );

  app.get<{ Params: CityCategoryParams }>(
    "/admin/cities/:cityId/categories/:categoryId",
    {
      preHandler: [auth, adminOnly],
      schema: { params: categoryIdParamSchema },
    },
    CityCategoryController.getById
  );

  app.post<{
    Params: CityIdParams;
  }>(
    "/admin/cities/:cityId/categories",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: cityIdParamSchema,
        body: createCityCategoryBodySchema,
      },
    },
    CityCategoryController.create
  );

  app.put<{
    Params: CityCategoryParams;
  }>(
    "/admin/cities/:cityId/categories/:categoryId",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: categoryIdParamSchema,
        body: updateCityCategoryBodySchema,
      },
    },
    CityCategoryController.update
  );

  app.delete<{ Params: CityCategoryParams }>(
    "/admin/cities/:cityId/categories/:categoryId",
    {
      preHandler: [auth, adminOnly],
      schema: { params: categoryIdParamSchema },
    },
    CityCategoryController.remove
  );
}
