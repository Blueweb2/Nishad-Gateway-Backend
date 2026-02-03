import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { CityBlogPostModel } from "../models/cityBlogPost.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";

export const CityBlogPostController = {

  /* ======================================================
     PUBLIC – GET BLOG DETAIL
     GET /public/cities/:citySlug/:categorySlug/:blogSlug
  ====================================================== */

  async getPublicBlogDetail(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { citySlug, categorySlug, blogSlug } =
        req.params as {
          citySlug: string;
          categorySlug: string;
          blogSlug: string;
        };

      const city = await CityModel.findOne({
        citySlug,
        isActive: true,
      }).lean();

      if (!city) {
        return reply.code(404).send({ message: "City not found" });
      }

      const category = await CityCategoryModel.findOne({
        cityId: city._id,
        slug: categorySlug,
        isActive: true,
      }).lean();

      if (!category) {
        return reply.code(404).send({ message: "Category not found" });
      }

      const blog = await CityBlogPostModel.findOne({
        cityId: city._id,
        categoryId: category._id,
        slug: blogSlug,
        isPublished: true,
      }).lean();

      if (!blog) {
        return reply.code(404).send({ message: "Blog not found" });
      }

      return reply.code(200).send({
        city: {
          cityName: city.cityName,
          citySlug: city.citySlug,
        },
        category: {
          name: category.name,
          slug: category.slug,
        },
        blog,
      });

    } catch (err) {
      console.error("Public blog detail error:", err);
      return reply.code(500).send({
        message: "Failed to load blog",
      });
    }
  },

  /* ======================================================
     ADMIN – CREATE BLOG
  ====================================================== */

  async create(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
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

      const blog = await CityBlogPostModel.create({
        ...body,
        cityId: new mongoose.Types.ObjectId(cityId),
        categoryId: new mongoose.Types.ObjectId(categoryId),
      });

      return reply.code(201).send({
        message: "Blog created successfully",
        blog,
      });

    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(400).send({
          message: "Blog slug already exists for this city",
        });
      }

      console.error("Create blog error:", err);
      return reply.code(500).send({
        message: "Failed to create blog",
      });
    }
  },

  /* ======================================================
     ADMIN – UPDATE BLOG
  ====================================================== */

  async update(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { blogId } =
        req.params as { blogId: string };

      const body = req.body as any;

      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return reply.code(400).send({ message: "Invalid blog ID" });
      }

      const updated = await CityBlogPostModel.findByIdAndUpdate(
        blogId,
        body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updated) {
        return reply.code(404).send({
          message: "Blog not found",
        });
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

      console.error("Update blog error:", err);
      return reply.code(500).send({
        message: "Failed to update blog",
      });
    }
  },

  /* ======================================================
     ADMIN – DELETE BLOG (HARD DELETE)
  ====================================================== */

  async remove(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { blogId } =
        req.params as { blogId: string };

      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return reply.code(400).send({ message: "Invalid blog ID" });
      }

      const deleted = await CityBlogPostModel.findByIdAndDelete(blogId);

      if (!deleted) {
        return reply.code(404).send({
          message: "Blog not found",
        });
      }

      return reply.code(200).send({
        message: "Blog deleted successfully",
      });

    } catch (err) {
      console.error("Delete blog error:", err);
      return reply.code(500).send({
        message: "Failed to delete blog",
      });
    }
  },

};
