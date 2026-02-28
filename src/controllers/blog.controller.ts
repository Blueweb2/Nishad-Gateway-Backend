// controllers/blog.controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { BlogService } from "../services/blog.service";
import { CreateBlogDTO, UpdateBlogDTO } from "../types/blog.types";

export class BlogController {

  /* ================= PUBLIC ================= */

  static async getFeatured(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const blogs = await BlogService.getFeatured();

      return reply.status(200).send({
        success: true,
        data: blogs,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Failed to fetch featured blogs",
      });
    }
  }

  static async getAll(
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        tag?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const page = Math.max(1, Number(request.query.page) || 1);
      const limit = Math.min(
        50,
        Math.max(1, Number(request.query.limit) || 10)
      );

      const tag = request.query.tag;

      const blogs = await BlogService.getAllPublished(
        page,
        limit,
        tag
      );

      return reply.status(200).send({
        success: true,
        ...blogs,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Failed to fetch blogs",
      });
    }
  }

  static async getSingle(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const blog = await BlogService.getBySlug(
        request.params.slug
      );

      if (!blog) {
        return reply.status(404).send({
          success: false,
          message: "Blog not found",
        });
      }

      return reply.status(200).send({
        success: true,
        data: blog,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Failed to fetch blog",
      });
    }
  }

  static async getRelated(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  try {
    const { slug } = request.params;

    const related =
      await BlogService.getRelatedBySlug(slug);

    return reply.status(200).send({
      success: true,
      data: related,
    });

  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: "Failed to fetch related blogs",
    });
  }
}

  /* ================= ADMIN ================= */

  static async getAdmin(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const blogs = await BlogService.getAllAdmin();

      return reply.status(200).send({
        success: true,
        data: blogs,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Failed to fetch blogs",
      });
    }
  }

  static async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await BlogService.getById(id);

    if (!blog) {
      return reply.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    return reply.status(200).send({
      success: true,
      data: blog,
    });
  }

  static async create(
    request: FastifyRequest<{ Body: CreateBlogDTO }>,
    reply: FastifyReply
  ) {
    try {
      const blog = await BlogService.create(request.body);

      return reply.status(201).send({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Blog creation failed",
      });
    }
  }

  static async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateBlogDTO;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.status(400).send({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const blog = await BlogService.update(
        id,
        request.body
      );

      return reply.status(200).send({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Update failed",
      });
    }
  }

  static async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.status(400).send({
          success: false,
          message: "Invalid blog ID",
        });
      }

      await BlogService.delete(id);

      return reply.status(200).send({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Delete failed",
      });
    }
  }
}