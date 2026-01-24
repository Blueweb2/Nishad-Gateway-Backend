import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import {
  loginAdminService,
  logoutAdminService,
  refreshAdminTokenService,
  adminMeService,
} from "../services/admin.service";

// LOGIN (access + refresh cookie)
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

    // set cookies
    reply.setCookie("admin_access_token", result.accessToken, result.accessCookie);
    reply.setCookie("admin_refresh_token", result.refreshToken, result.refreshCookie);

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

// LOGOUT (clear both cookies)
export const logoutAdminController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = logoutAdminService();

    reply.clearCookie("admin_access_token", result.clearOptions);
    reply.clearCookie("admin_refresh_token", result.clearOptions);

    return sendResponse(reply, 200, true, "Logout success", null);
  } catch (err: any) {
    return sendResponse(reply, 500, false, "Logout failed", null);
  }
};

// REFRESH (new access token from refresh token)
export const refreshAdminTokenController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const refreshToken = request.cookies.admin_refresh_token;

    const result = await refreshAdminTokenService(request.server, refreshToken);

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

// SESSION STATUS CHECK
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
