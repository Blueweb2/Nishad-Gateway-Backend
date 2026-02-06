import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";
import { createError } from "../utils/errors";

import { Admin } from "../models/Admin.model";
import { AdminActivity } from "../models/AdminActivity.model";

import bcrypt from "bcryptjs";
import { logAdminActivity } from "../services/activity.service";
import { AdminLogsRoute } from "../types/routes.types";

import { JwtPayload } from "../types/jwt.types";

import {
  loginAdminService,
  logoutAdminService,
  refreshAdminTokenService,
  adminMeService,
} from "../services/admin.service";

type AuthRequest = FastifyRequest & {
  user: JwtPayload;
};


/* ===========================
   LOGIN
=========================== */
export const loginAdminController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const result = await loginAdminService(request.server, email, password);

    reply.setCookie("admin_access_token", result.accessToken, result.accessCookie);
    reply.setCookie("admin_refresh_token", result.refreshToken, result.refreshCookie);

    // 🔥 Log login properly
    await logAdminActivity(
      request,
      "ADMIN_LOGIN",
      undefined,
      undefined,
      result.admin.id.toString()
    );

    return sendResponse(reply, 200, true, "Login success", result.admin);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Login failed",
      null
    );
  }
};

/* ===========================
   LIST ADMINS
=========================== */
export const listAdminsController = async (
  request: AuthRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user.role !== "superadmin") {
      throw createError(403, "Access denied");
    }

    const admins = await Admin.find().select("-password");

    return sendResponse(reply, 200, true, "Admins fetched", admins);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Failed to fetch admins",
      null
    );
  }
};

/* ===========================
   CREATE ADMIN
=========================== */
export const createAdminController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const existing = await Admin.findOne({ email });
    if (existing) {
      throw createError(400, "Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await logAdminActivity(
      request,
      "CREATE_ADMIN",
      "Admin",
      newAdmin._id.toString()
    );

    return sendResponse(reply, 201, true, "Admin created", {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    });

  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Failed to create admin",
      null
    );
  }
};


/* ===========================
   DELETE ADMIN
=========================== */
export const deleteAdminController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user.role !== "superadmin") {
      throw createError(403, "Access denied");
    }

    const { id } = request.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      throw createError(404, "Admin not found");
    }

    if (admin.role === "superadmin") {
      // 🔥 Count total superadmins
      const superAdminCount = await Admin.countDocuments({
        role: "superadmin",
      });

      if (superAdminCount <= 1) {
        throw createError(
          403,
          "Cannot delete the last superadmin"
        );
      }
    }

    await admin.deleteOne();

    await logAdminActivity(
      request,
      "DELETE_ADMIN",
      "Admin",
      id
    );

    return sendResponse(reply, 200, true, "Admin deleted", null);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Delete failed",
      null
    );
  }
};


/* ===========================
   GET ADMIN LOGS
=========================== */
export const getAdminLogsController = async (
  request: FastifyRequest<AdminLogsRoute>,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user.role !== "superadmin") {
      throw createError(403, "Superadmin only");
    }

    const { adminId, from, to } = request.query;

    const filter: {
      adminId?: string;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (adminId) {
      filter.adminId = adminId;
    }

    if (from || to) {
      filter.createdAt = {};

      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await AdminActivity.find(filter)
      .populate("adminId", "email role")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return sendResponse(reply, 200, true, "Logs fetched", logs);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 500,
      false,
      err.message || "Failed to fetch logs",
      null
    );
  }
};

/* ===========================
   LOGOUT
=========================== */
export const logoutAdminController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = logoutAdminService();

    reply.clearCookie("admin_access_token", result.clearOptions);
    reply.clearCookie("admin_refresh_token", result.clearOptions);

    return sendResponse(reply, 200, true, "Logout success", null);
  } catch {
    return sendResponse(reply, 500, false, "Logout failed", null);
  }
};

/* ===========================
   REFRESH TOKEN
=========================== */
export const refreshAdminTokenController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const refreshToken = request.cookies.admin_refresh_token;

    const result = await refreshAdminTokenService(
      request.server,
      refreshToken
    );

    reply.setCookie("admin_access_token", result.accessToken, result.cookie);

    return sendResponse(reply, 200, true, "Token refreshed", null);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 401,
      false,
      err.message || "Refresh failed",
      null
    );
  }
};

/* ===========================
   SESSION CHECK
=========================== */
export const adminMeController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const accessToken = request.cookies.admin_access_token;

    const admin = await adminMeService(request.server, accessToken);

    return sendResponse(reply, 200, true, "Session active", admin);
  } catch (err: any) {
    return sendResponse(
      reply,
      err.statusCode || 401,
      false,
      err.message || "Session expired",
      null
    );
  }
};
