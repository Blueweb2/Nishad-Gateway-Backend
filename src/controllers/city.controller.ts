import { FastifyReply, FastifyRequest } from "fastify";
import { CityService } from "../services/city.service";

export const CityController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const city = await CityService.createCity(req.body);
      return reply.code(201).send({ message: "City created", city });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  },

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const cities = await CityService.getCities(req.query);
      return reply.code(200).send({ cities });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  },

  async getBySlug(
    req: FastifyRequest<{ Params: { citySlug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { citySlug } = req.params;

      const city = await CityService.getCityBySlug(citySlug);
      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ city });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  },


  async getById(
req: FastifyRequest<{ Params: { id: string } }>,
reply: FastifyReply
) {
try {
const { id } = req.params;


const city = await CityService.getCityById(id);
if (!city) {
return reply.code(404).send({ message: "City not found" });
}


return reply.code(200).send({ city });
} catch (error: any) {
return reply.code(500).send({ message: error.message });
}
},

  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      const updated = await CityService.updateCity(id, req.body);
      if (!updated) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ message: "City updated", city: updated });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  },

  async remove(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      const deleted = await CityService.deleteCity(id);
      if (!deleted) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send({ message: "City deleted" });
    } catch (error: any) {
      return reply.code(500).send({ message: error.message });
    }
  },
};