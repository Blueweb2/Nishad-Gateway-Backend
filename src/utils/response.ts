import { FastifyReply } from "fastify";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export const sendResponse = <T>(
  reply: FastifyReply,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null
) => {
  return reply.code(statusCode).send({
    success,
    message,
    data,
  } as ApiResponse<T>);
};
