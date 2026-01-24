import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { getSignedUpload } from "../controllers/upload.controller";

export default async function uploadRoutes(app: FastifyInstance) {
  // Signed Upload (secure)
  app.get("/signed", { preHandler: [auth, adminOnly] }, getSignedUpload);
}
