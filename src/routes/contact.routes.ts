import { FastifyInstance } from "fastify";
import { sendContactEmail } from "../controllers/contact.controller";

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.post("/contact", sendContactEmail);
}