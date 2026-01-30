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

export default async function cityCategoryRoutes(app: FastifyInstance) {

  /* ========================================
     PUBLIC ROUTE
     Get categories by city
  ======================================== */
  app.get(
    "/cities/id/:cityId/categories",
    { schema: { params: cityIdParamSchema } },
    CityCategoryController.getByCityId
  );

  /* ========================================
     PUBLIC ROUTE
     Get single category
  ======================================== */
  app.get(
    "/cities/id/:cityId/categories/:categoryId",
    { schema: { params: categoryIdParamSchema } },
    CityCategoryController.getById
  );

  /* ========================================
     ADMIN ROUTES (PROTECTED)
  ======================================== */

  // CREATE
  app.post(
    "/cities/id/:cityId/categories",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: cityIdParamSchema,
        body: createCityCategoryBodySchema,
      },
    },
    CityCategoryController.create
  );

  // UPDATE
  app.put(
    "/cities/id/:cityId/categories/:categoryId",
    {
      preHandler: [auth, adminOnly],
      schema: {
        params: categoryIdParamSchema,
        body: updateCityCategoryBodySchema,
      },
    },
    CityCategoryController.update
  );

  // DELETE
  app.delete(
    "/cities/id/:cityId/categories/:categoryId",
    {
      preHandler: [auth, adminOnly],
      schema: { params: categoryIdParamSchema },
    },
    CityCategoryController.remove
  );
}