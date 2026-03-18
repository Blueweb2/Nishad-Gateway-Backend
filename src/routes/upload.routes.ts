import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { getSignedUpload, deleteImage } from "../controllers/upload.controller";

export default async function uploadRoutes(app: FastifyInstance) {

  const adminAccess = [auth, authorize(["admin", "superadmin"])];

  app.get("/signed", { preHandler: adminAccess }, getSignedUpload);

  app.delete("/delete", { preHandler: adminAccess }, deleteImage);
}