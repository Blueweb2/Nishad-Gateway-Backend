import { FastifyInstance } from "fastify";
import { createLeadController, getLeadsController } from "../controllers/lead.controller";
import { auth } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";
import { createLeadSchema } from "../schemas/lead.schema";

export default async function leadRoutes(app: FastifyInstance) {
  app.post("/leads", { schema: createLeadSchema }, createLeadController);

  app.get("/leads", { preHandler: [auth, adminOnly] }, getLeadsController);
}
