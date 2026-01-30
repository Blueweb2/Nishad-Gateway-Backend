import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityCategoryService } from "../services/cityCategory.service";
import { CityCategoryParams } from "../types/fastify";

export const CityCategoryController = {

  /* ========================================= CREATE */
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId } = req.params as { cityId: string };
      const body = req.body as any;

      if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const category = await CityCategoryService.create(cityId, body);

      if (!category) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(201).send({
        message: "Category created",
        category,
      });

    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(400).send({
          message: "Category slug already exists for this city",
        });
      }

      console.error("Category create error:", err);
      return reply.code(500).send({
        message: "Failed to create category",
      });
    }
  },

  /* ========================================= GET ALL */
  async getByCityId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId } = req.params as { cityId: string };

      if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const categories = await CityCategoryService.getByCityId(cityId);

      return reply.code(200).send({ categories });

    } catch (err) {
      console.error("Category list error:", err);
      return reply.code(500).send({
        message: "Failed to load categories",
      });
    }
  },

  /* ========================================= GET SINGLE */
async getById(
  req: FastifyRequest<{ Params: CityCategoryParams }>,
  reply: FastifyReply
) {
    try {
      const { cityId, categoryId } =
        req.params as { cityId: string; categoryId: string };

      if (
        !mongoose.Types.ObjectId.isValid(cityId) ||
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return reply.code(400).send({ message: "Invalid ID" });
      }

      const category = await CityCategoryService.getById(
        cityId,
        categoryId
      );

      if (!category) {
        return reply.code(404).send({
          message: "Category not found",
        });
      }

      return reply.code(200).send({ category });

    } catch (err) {
      console.error("Category get error:", err);
      return reply.code(500).send({
        message: "Failed to load category",
      });
    }
  },

  /* ========================================= UPDATE */
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId } =
        req.params as { cityId: string; categoryId: string };

      const body = req.body as any;

      if (
        !mongoose.Types.ObjectId.isValid(cityId) ||
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return reply.code(400).send({ message: "Invalid ID" });
      }

      const updated = await CityCategoryService.update(
        cityId,
        categoryId,
        body
      );

      if (!updated) {
        return reply.code(404).send({
          message: "Category not found",
        });
      }

      return reply.code(200).send({
        message: "Category updated",
        category: updated,
      });

    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(400).send({
          message: "Category slug already exists for this city",
        });
      }

      console.error("Category update error:", err);
      return reply.code(500).send({
        message: "Failed to update category",
      });
    }
  },

  /* ========================================= DELETE */
  async remove(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId } =
        req.params as { cityId: string; categoryId: string };

      if (
        !mongoose.Types.ObjectId.isValid(cityId) ||
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return reply.code(400).send({ message: "Invalid ID" });
      }

      const deleted = await CityCategoryService.remove(
        cityId,
        categoryId
      );

      if (!deleted) {
        return reply.code(404).send({
          message: "Category not found",
        });
      }

      return reply.code(200).send({
        message: "Category deleted",
      });

    } catch (err) {
      console.error("Category delete error:", err);
      return reply.code(500).send({
        message: "Failed to delete category",
      });
    }
  },
};