export interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "superadmin";
  type?: "access" | "refresh";

}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

export {}; // 👈 VERY IMPORTANT
