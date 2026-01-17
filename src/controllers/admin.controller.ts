import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model";
import { sendResponse } from "../utils/response";

export const adminLogin = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return sendResponse(reply, 401, false, "Admin not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return sendResponse(reply, 401, false, "Invalid password");
    }

    // ✅ create jwt token
    const token = reply.server.jwt.sign(
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

    return sendResponse(reply, 200, true, "Login success", {
      id: admin._id,
      email: admin.email,
    });
  } catch (err) {
    return sendResponse(reply, 500, false, "Login failed");
  }
};

export const adminLogout = async (_req: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("admin_token", { path: "/" });

  return sendResponse(reply, 200, true, "Logout success");
};
