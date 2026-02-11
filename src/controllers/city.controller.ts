import { FastifyReply, FastifyRequest } from "fastify";
import { CityService } from "../services/city.service";
import mongoose from "mongoose";
import { IdRoute, CitySlugRoute } from "../types/routes.types";

export const CityController = {

  /* ================= CREATE ================= */

  async create(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const city = await CityService.createCity(req.body);
      return reply.code(201).send({
        message: "City created",
        city,
      });

    } catch (error: any) {

      if (error.code === 11000) {
        return reply.code(400).send({
          message: "City slug already exists",
        });
      }

      return reply.code(500).send({
        message: "Failed to create city",
      });
    }
  },

  /* ================= GET ALL ================= */

 async getPublic(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const cities = await CityService.getPublicCities();
      return reply.send({ cities });
    } catch {
      return reply.code(500).send({ message: "Failed to fetch cities" });
    }
  },

  async getAllAdmin(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const cities = await CityService.getAllCities();
      return reply.send({ cities });
    } catch {
      return reply.code(500).send({ message: "Failed to fetch cities" });
    }
  },

  /* ================= GET BY SLUG ================= */

  async getBySlug(
    req: FastifyRequest<CitySlugRoute>,
    reply: FastifyReply
  ) {
    try {
      const { citySlug } = req.params;

      const city = await CityService.getCityBySlug(citySlug);

      if (!city) {
        return reply.code(404).send({
          message: "City not found",
        });
      }

      return reply.code(200).send({ city });

    } catch {
      return reply.code(500).send({
        message: "Failed to fetch city",
      });
    }
  },

  /* ================= GET BY ID ================= */

  async getById(
    req: FastifyRequest<IdRoute>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({
          message: "Invalid city ID",
        });
      }

      const city = await CityService.getCityById(id);

      if (!city) {
        return reply.code(404).send({
          message: "City not found",
        });
      }

      return reply.code(200).send({ city });

    } catch {
      return reply.code(500).send({
        message: "Failed to fetch city",
      });
    }
  },

  /* ================= UPDATE ================= */

  async update(
    req: FastifyRequest<IdRoute>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({
          message: "Invalid city ID",
        });
      }

      const updated = await CityService.updateCity(id, req.body);

      if (!updated) {
        return reply.code(404).send({
          message: "City not found",
        });
      }

      return reply.code(200).send({
        message: "City updated",
        city: updated,
      });

    } catch (error: any) {

      if (error.code === 11000) {
        return reply.code(400).send({
          message: "City slug already exists",
        });
      }

      return reply.code(500).send({
        message: "Failed to update city",
      });
    }
  },

  /* ================= DELETE ================= */

  async remove(
    req: FastifyRequest<IdRoute>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({
          message: "Invalid city ID",
        });
      }

      const deleted = await CityService.deleteCity(id);

      if (!deleted) {
        return reply.code(404).send({
          message: "City not found",
        });
      }

      return reply.code(200).send({
        message: "City deleted",
      });

    } catch {
      return reply.code(500).send({
        message: "Failed to delete city",
      });
    }
  },


};
