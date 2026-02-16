import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { MediaCleanupController } from "../controllers/mediaCleanup.controller";

export default async function mediaCleanupRoutes(app: FastifyInstance) {

  app.post(
    "/admin/media-cleanup",
    {
      preHandler: [auth, adminOnly],
    },
    MediaCleanupController.cleanup
  );

}
