import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityBlogPostService } from "../services/cityBlogPost.service";

export const CityBlogPostController = {
  /* ======================================================
     PUBLIC – CATEGORY BLOG LIST
  ====================================================== */
  async getPublicCategoryBlogs(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { citySlug, categorySlug } =
        req.params as { citySlug: string; categorySlug: string };

      const result =
        await CityBlogPostService.getPublicCategoryBlogs(
          citySlug,
          categorySlug
        );

      if (!result) {
        return reply.code(404).send({ message: "Not found" });
      }

      return reply.code(200).send(result);
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to load category blogs",
      });
    }
  },

  /* ======================================================
     PUBLIC – BLOG DETAIL
  ====================================================== */
  async getPublicBlogDetail(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { citySlug, categorySlug, blogSlug } =
        req.params as {
          citySlug: string;
          categorySlug: string;
          blogSlug: string;
        };

      const result =
        await CityBlogPostService.getPublicBlogDetail(
          citySlug,
          categorySlug,
          blogSlug
        );

      if (!result) {
        return reply.code(404).send({ message: "Not found" });
      }

      return reply.code(200).send(result);
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to load blog",
      });
    }
  },

  /* ======================================================
     ADMIN – CREATE BLOG
  ====================================================== */
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId } =
        req.params as { cityId: string; categoryId: string };

      const blog = await CityBlogPostService.create(
        cityId,
        categoryId,
        req.body
      );

      return reply.code(201).send({
        message: "Blog created successfully",
        blog,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(400).send({
          message: "Blog slug already exists in this category",
        });
      }

      if (err.message?.includes("Invalid")) {
        return reply.code(400).send({ message: err.message });
      }

      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to create blog",
      });
    }
  },

  /* ======================================================
     ADMIN – UPDATE BLOG
  ====================================================== */
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId, blogId } =
        req.params as {
          cityId: string;
          categoryId: string;
          blogId: string;
        };

      const updated = await CityBlogPostService.update(
        cityId,
        categoryId,
        blogId,
        req.body
      );

      if (!updated) {
        return reply.code(404).send({ message: "Blog not found" });
      }

      return reply.code(200).send({
        message: "Blog updated successfully",
        blog: updated,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(400).send({
          message: "Blog slug already exists",
        });
      }

      if (err.message?.includes("Invalid")) {
        return reply.code(400).send({ message: err.message });
      }

      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to update blog",
      });
    }
  },

  /* ======================================================
     ADMIN – DELETE BLOG
  ====================================================== */
  async remove(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId, blogId } =
        req.params as {
          cityId: string;
          categoryId: string;
          blogId: string;
        };

      const deleted = await CityBlogPostService.remove(
        cityId,
        categoryId,
        blogId
      );

      if (!deleted) {
        return reply.code(404).send({ message: "Blog not found" });
      }

      return reply.code(200).send({
        message: "Blog deleted successfully",
      });
    } catch (err: any) {
      if (err.message?.includes("Invalid")) {
        return reply.code(400).send({ message: err.message });
      }

      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to delete blog",
      });
    }
  },

  /* ======================================================
     ADMIN – GET BLOGS BY CATEGORY
  ====================================================== */
  async getByCategoryAdmin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId } =
        req.params as { cityId: string; categoryId: string };

      const blogs =
        await CityBlogPostService.getByCategoryAdmin(
          cityId,
          categoryId
        );

      return reply.code(200).send({ blogs });
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to load blogs",
      });
    }
  },

  /* ======================================================
     ADMIN – GET SINGLE BLOG
  ====================================================== */
  async getSingleAdmin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { cityId, categoryId, blogId } =
        req.params as {
          cityId: string;
          categoryId: string;
          blogId: string;
        };

      const blog = await CityBlogPostService.getById(
        cityId,
        categoryId,
        blogId
      );

      if (!blog) {
        return reply.code(404).send({
          message: "Blog not found",
        });
      }

      return reply.code(200).send({ blog });
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({
        message: "Failed to load blog",
      });
    }
  },
};
