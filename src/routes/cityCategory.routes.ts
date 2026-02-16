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
    "/cities/:cityId/categories",
    { schema: { params: cityIdParamSchema } },
    CityCategoryController.getByCityId
  );

  /* ========================================
     PUBLIC ROUTE
     Get single category
  ======================================== */
  app.get(
    "/cities/:cityId/categories/:categoryId",
    { schema: { params: categoryIdParamSchema } },
    CityCategoryController.getById
  );

  /* ========================================
     ADMIN ROUTES (PROTECTED)
  ======================================== */

 /* ========================================
   ADMIN ROUTES (PROTECTED)
======================================== */

// GET ALL (ADMIN)
app.get(
  "/admin/cities/:cityId/categories",
  {
    preHandler: [auth, adminOnly],
    schema: { params: cityIdParamSchema },
  },
  CityCategoryController.getByCityId
);

// CREATE
app.post(
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

// UPDATE
app.put(
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

// DELETE
app.delete(
  "/admin/cities/:cityId/categories/:categoryId",
  {
    preHandler: [auth, adminOnly],
    schema: { params: categoryIdParamSchema },
  },
  CityCategoryController.remove
);

}