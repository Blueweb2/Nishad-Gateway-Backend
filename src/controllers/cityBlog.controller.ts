import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityBlogService } from "../services/cityBlog.service";
import { CityService } from "../services/city.service";
import {
  IdRoute,
  CitySlugRoute,
  CityBlogUpsertRoute,
} from "../types/fastify";

export const CityBlogController = {

  /* ================= GET BY CITY ID ================= */

  async getByCityId(
    req: FastifyRequest<IdRoute>,
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
      return reply.code(500).send({
        message: "Failed to load city blog",
      });
    }
  },

  /* ================= UPSERT ================= */

  async upsert(
    req: FastifyRequest<CityBlogUpsertRoute>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { sections, status = "DRAFT" } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "Invalid city ID" });
      }

      const city = await CityService.getCityById(id);
      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      if (!Array.isArray(sections) || sections.length === 0) {
        return reply.code(400).send({
          message: "At least one section is required",
        });
      }

      const orders = sections.map((s) => s.order);
      if (orders.length !== new Set(orders).size) {
        return reply.code(400).send({
          message: "Section order values must be unique",
        });
      }

      const heroSections = sections.filter((s) => s.type === "HERO");

      if (heroSections.length !== 1) {
        return reply.code(400).send({
          message: "Exactly one HERO section is required",
        });
      }

      if (status === "PUBLISHED") {
        const activeSections = sections.filter((s) => s.isActive);

        if (activeSections.length === 0) {
          return reply.code(400).send({
            message: "At least one active section is required to publish",
          });
        }

        const activeHeroSections = activeSections.filter(
          (s) => s.type === "HERO"
        );

        if (activeHeroSections.length !== 1) {
          return reply.code(400).send({
            message: "Exactly one active HERO section is required to publish",
          });
        }
      }

      const blog = await CityBlogService.upsert(
        id,
        sections,
        status
      );

      return reply.code(200).send({
        message: "City blog saved successfully",
        blog,
      });

    } catch (err) {
      console.error("CityBlog upsert error:", err);
      return reply.code(500).send({
        message: "Failed to save city blog",
      });
    }
  },

  /* ================= GET BY SLUG ================= */

  async getByCitySlug(
    req: FastifyRequest<CitySlugRoute>,
    reply: FastifyReply
  ) {
    try {
      const { citySlug } = req.params;

      if (!citySlug?.trim()) {
        return reply.code(400).send({
          message: "City slug is required",
        });
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
      return reply.code(500).send({
        message: "Failed to load city blog",
      });
    }
  },
};
