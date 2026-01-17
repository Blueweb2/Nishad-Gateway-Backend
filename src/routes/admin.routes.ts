import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model";

export default async function adminRoutes(app: FastifyInstance) {
  // ✅ LOGIN ADMIN (JWT + Cookie)
  app.post("/admin/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return reply.code(401).send({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return reply.code(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ create token
    const token = app.jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      { expiresIn: "5h" }
    );

    // ✅ set cookie
    reply.setCookie("admin_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 5, // 5 hours
    });

    return reply.send({
      success: true,
      message: "Login success",
      admin: { id: admin._id, email: admin.email },
    });
  });

  // ✅ LOGOUT
  app.post("/admin/logout", async (_req, reply) => {
    reply.clearCookie("admin_token", { path: "/" });

    return reply.send({
      success: true,
      message: "Logout success",
    });
  });
}
