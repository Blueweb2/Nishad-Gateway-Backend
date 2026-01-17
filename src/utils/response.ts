// common response format
import { FastifyReply } from "fastify";

export const sendResponse = (
  reply: FastifyReply,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  return reply.status(statusCode).send({
    success,
    message,
    data,
  });
};
