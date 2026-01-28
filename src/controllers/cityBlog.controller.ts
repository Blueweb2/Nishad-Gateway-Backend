import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityBlogService } from "../services/cityBlog.service";
import { CityService } from "../services/city.service";

export const CityBlogController = {
  /* ======================================================
     ADMIN – GET BLOG BY CITY ID
     GET /api/cities/id/:id/blog
     Used in: /admin/cities/blog/[id]
  ====================================================== */
  async getByCityId(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      // Ensure city exists
      const city = await CityService.getCityById(id);
      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      // Fetch blog by cityId
      const blog = await CityBlogService.getByCityId(id);

      return reply.code(200).send({
        city: {
          _id: city._id,
          cityName: city.cityName,
          citySlug: city.citySlug,
        },
        sections: blog?.sections || [],
      });
    } catch (err) {
      console.error("CityBlog getByCityId error:", err);
      return reply
        .code(500)
        .send({ message: "Failed to load city blog" });
    }
  },

  /* ======================================================
     ADMIN – CREATE / UPDATE BLOG
     PUT /api/cities/id/:id/blog
     Saves full sections array
  ====================================================== */
  async upsert(
    req: FastifyRequest<{
      Params: { id: string };
      Body: { sections: any[] };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { sections } = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      // Ensure city exists
      const city = await CityService.getCityById(id);
      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      // Upsert blog
      const blog = await CityBlogService.upsert(id, sections);

      return reply.code(200).send({
        message: "City blog saved",
        blog,
      });
    } catch (err) {
      console.error("CityBlog upsert error:", err);
      return reply
        .code(500)
        .send({ message: "Failed to save city blog" });
    }
  },

  /* ======================================================
     USER – GET BLOG BY CITY SLUG (PUBLIC)
     GET /api/cities/slug/:citySlug/blog
     Used in: /cities/[citySlug]
  ====================================================== */
  async getByCitySlug(
    req: FastifyRequest<{ Params: { citySlug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { citySlug } = req.params;

      if (!citySlug || citySlug.trim().length === 0) {
        return reply
          .code(400)
          .send({ message: "City slug is required" });
      }

      // Fetch city + blog via service
      const data = await CityBlogService.getByCitySlug(citySlug);

      if (!data) {
        return reply.code(404).send({ message: "City not found" });
      }

      return reply.code(200).send(data);
    } catch (err) {
      console.error("CityBlog getByCitySlug error:", err);
      return reply
        .code(500)
        .send({ message: "Failed to load city blog" });
    }
  },
};