import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    swagger: {
      info: {
        title: "Nishad Gateway API",
        description: "Admin APIs for Nishad Gateway",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
  });

  app.log.info(" Swagger enabled at /docs");
}

export default fp(swaggerPlugin);