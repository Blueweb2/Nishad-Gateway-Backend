export type AppError = {
  statusCode: number;
  message: string;
};

export const createError = (statusCode: number, message: string): AppError => {
  return { statusCode, message };
};
