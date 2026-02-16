import { FastifyReply, FastifyRequest } from "fastify";
import { MediaCleanupService } from "../services/mediaCleanup.service";

export const MediaCleanupController = {

  async cleanup(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await MediaCleanupService.cleanUnusedImages();

      return reply.code(200).send({
        success: true,
        message: "Media cleanup completed",
        ...result,
      });

    } catch (err: any) {
      req.log.error(err);

      return reply.code(500).send({
        success: false,
        message: err?.message || "Cleanup failed",
      });
    }
  }

};
