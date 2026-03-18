import { FastifyInstance } from "fastify";
import { sendContactEmail } from "../controllers/contact.controller";

export default async function contactRoutes(app: FastifyInstance) {

  app.post(
    "/contact",
    {
      config: {
        rateLimit: {
          max: 5,              // 🔥 limit abuse
          timeWindow: "1 minute",
        },
      },
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "message"],
          additionalProperties: false,
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            message: { type: "string", minLength: 10 },
          },
        },
      },
    },
    sendContactEmail
  );

}