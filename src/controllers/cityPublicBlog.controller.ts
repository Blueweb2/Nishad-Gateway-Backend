import { FastifyReply, FastifyRequest } from "fastify";
import { CityPublicBlogService } from "../services/cityPublicBlog.service";

export const CityPublicBlogController = {

  async getCategoryBlogs(req: FastifyRequest, reply: FastifyReply) {
    const { citySlug, categorySlug } = req.params as any;

    const data = await CityPublicBlogService.getCategoryBlogs(
      citySlug,
      categorySlug
    );

    if (!data) {
      return reply.code(404).send({
        message: "City or category not found",
      });
    }

    return reply.send(data);
  },

  async getSingleBlog(req: FastifyRequest, reply: FastifyReply) {
    const { citySlug, categorySlug, blogSlug } = req.params as any;

    const data = await CityPublicBlogService.getSingleBlog(
      citySlug,
      categorySlug,
      blogSlug
    );

    if (!data) {
      return reply.code(404).send({
        message: "Blog not found",
      });
    }

    return reply.send(data);
  },
};
