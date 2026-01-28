import { FastifyReply, FastifyRequest } from "fastify";
import { CityService } from "../services/city.service";
import mongoose from "mongoose";

export const CityController = {

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const city = await CityService.createCity(req.body);
      return reply.code(201).send({ message: "City created", city });

    } catch (error: any) {

      // Duplicate slug
      if (error.code === 11000) {
        return reply.code(400).send({
          message: "City slug already exists",
        });
      }

      return reply.code(500).send({ message: "Failed to create city" });
    }
  },

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const cities = await CityService.getCities(req.query);
      return reply.code(200).send({ cities });
    } catch {
      return reply.code(500).send({ message: "Failed to fetch cities" });
    }
  },

  async getBySlug(
    req: FastifyRequest<{ Params: { citySlug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const city = await CityService.getCityBySlug(req.params.citySlug);

      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ city });
    } catch {
      return reply.code(500).send({ message: "Failed to fetch city" });
    }
  },

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const city = await CityService.getCityById(id);

      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ city });

    } catch {
      return reply.code(500).send({ message: "Failed to fetch city" });
    }
  },

  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const updated = await CityService.updateCity(id, req.body);

      if (!updated) {
        return reply.code(404).send({ message: "City not found" });
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

      return reply.code(500).send({ message: "Failed to update city" });
    }
  },

  async remove(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const deleted = await CityService.deleteCity(id);

      if (!deleted) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ message: "City deleted" });

    } catch {
      return reply.code(500).send({ message: "Failed to delete city" });
    }
  },
};