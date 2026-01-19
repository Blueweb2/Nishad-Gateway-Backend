import { FastifyInstance } from "fastify";
import { uploadImage } from "../controllers/upload.controller";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload/image", { preHandler: [auth, adminOnly] }, uploadImage);
}
