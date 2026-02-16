import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { getSignedUpload, deleteImage } from "../controllers/upload.controller";


export default async function uploadRoutes(app: FastifyInstance) {
  // Signed Upload (secure)
  app.get("/signed", { preHandler: [auth, adminOnly] }, getSignedUpload);
  app.delete(
  "/delete",
  { preHandler: [auth, adminOnly] },
  deleteImage
);

}
