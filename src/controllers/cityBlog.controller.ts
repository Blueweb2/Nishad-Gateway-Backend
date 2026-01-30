import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityBlogService } from "../services/cityBlog.service";
import { CityService } from "../services/city.service";
import { CityBlogModel } from "../models/cityBlog.model";

export const CityBlogController = {
  /* ======================================================
     ADMIN – GET BLOG BY CITY ID
  ====================================================== */
  async getByCityId(
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

      const blog = await CityBlogService.getByCityId(id);

      return reply.code(200).send({
        city: {
          _id: city._id,
          cityName: city.cityName,
          citySlug: city.citySlug,
        },
        sections: blog?.sections || [],
        status: blog?.status || "DRAFT",
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
  ====================================================== */
  async upsert(
    req: FastifyRequest<{
      Params: { id: string };
      Body: {
        sections: any[];
        status?: "DRAFT" | "PUBLISHED";
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { sections, status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const city = await CityService.getCityById(id);
      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      // 🚨 HERO ENFORCEMENT
      const heroSections = sections.filter(
        (s) => s.type === "HERO" && s.isActive
      );

      if (heroSections.length === 0) {
        return reply.code(400).send({
          message: "Hero section is required",
        });
      }

      if (heroSections.length > 1) {
        return reply.code(400).send({
          message: "Only one Hero section is allowed",
        });
      }

      const blog = await CityBlogService.upsert(
        id,
        sections,
        status || "DRAFT"
      );

      return reply.code(200).send({
        message: "City blog saved",
        blog,
      });
    } catch (err) {
      console.error("CityBlog upsert error:", err);
      return reply.code(500).send({
        message: "Failed to save city blog",
      });
    }
  },

  /* ======================================================
     USER – GET BLOG BY CITY SLUG (PUBLIC)
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

      const data = await CityBlogService.getByCitySlug(citySlug);

      if (!data) {
        return reply.code(404).send({
          message: "City not found or blog not published",
        });
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