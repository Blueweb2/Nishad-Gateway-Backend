import { FastifyRequest, FastifyReply } from "fastify";

import {
  createCityContentService,
  getContentsByCategoryIdService,
  getContentBySlugService,
  updateCityContentService,
  deleteCityContentService,
  getCityContentsService,
} from "../services/cityContent.service";

/* CREATE */

export const createCityContent = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  try {
    const data = await createCityContentService(req.body);

    return reply.send({
      success: true,
      message: "Content created successfully",
      data,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      success: false,
      message: "Failed to create content",
    });
  }
};

/* GET BY CATEGORY ID */

export const getByCategoryId = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  const { categoryId } = req.params as {
  categoryId: string;
};
  const data = await getContentsByCategoryIdService(categoryId);

  return reply.send({
    success: true,
    data,
  });
};

/* PUBLIC CATEGORY PAGE */

export const getByCategorySlug = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  try {
   const { citySlug, categorySlug } = req.params as {
  citySlug: string;
  categorySlug: string;
};

    const data = await getCityContentsService(citySlug, categorySlug);

    return reply.send({
      success: true,
      data,
    });
  } catch (error) {
    req.log.error(error);

    return reply.status(500).send({
      success: false,
      message: "Failed to fetch contents",
    });
  }
};

/* GET BY SLUG */

export const getBySlug = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  try {
    const { slug } = req.params as {
  slug: string;
};

    const data = await getContentBySlugService(slug);

    if (!data) {
      return reply.status(404).send({
        success: false,
        message: "Content not found",
      });
    }

    return reply.send({
      success: true,
      data,
    });
  } catch (error) {
    req.log.error(error);

    return reply.status(500).send({
      success: false,
      message: "Failed to fetch content",
    });
  }
};

/* UPDATE */

export const updateCityContent = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as {
  contentId: string;
};

    const data = await updateCityContentService(contentId, req.body);

    return reply.send({
      success: true,
      message: "Content updated successfully",
      data,
    });
  } catch (error) {
    req.log.error(error);

    return reply.status(500).send({
      success: false,
      message: "Failed to update content",
    });
  }
};

/* DELETE */

export const removeCityContent = async (
  req: FastifyRequest<any>,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params as {
  contentId: string;
};

    await deleteCityContentService(contentId);

    return reply.send({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    req.log.error(error);

    return reply.status(500).send({
      success: false,
      message: "Failed to delete content",
    });
  }
};