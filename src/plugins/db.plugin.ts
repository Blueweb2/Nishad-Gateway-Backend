import fp from "fastify-plugin";
import mongoose from "mongoose";
import { FastifyInstance } from "fastify";

async function dbPlugin(app: FastifyInstance) {
  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error(" MONGO_URI missing in .env");

  await mongoose.connect(uri);

  app.log.info(" MongoDB Connected");
}

export default fp(dbPlugin);