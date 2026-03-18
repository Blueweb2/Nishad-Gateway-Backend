import { FastifyInstance } from "fastify";
import { Admin } from "../models/Admin.model";
import { createAdminTokens, getCookieOptions } from "./token.service";
import { comparePassword } from "../utils/hash";
import { createError } from "../utils/errors";
import { CookieSerializeOptions } from "@fastify/cookie";

// LOGIN
export const loginAdminService = async (
  app: FastifyInstance,
  email: string,
  password: string
) => {
const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw createError(401, "Admin not found");
  }

  const isMatch = await comparePassword(password, admin.password);

  if (!isMatch) {
    throw createError(401, "Invalid password");
  }
  if (!admin.password) {
  throw createError(500, "Password not found in DB");
}

  const { accessToken, refreshToken } = createAdminTokens(app, admin);

  return {
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role, // ✅ FIXED
    },
    accessToken,
    refreshToken,
    accessCookie: getCookieOptions("access"),
    refreshCookie: getCookieOptions("refresh"),
  };
};

// LOGOUT
export const logoutAdminService = () => {
  const clearOptions: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  return { clearOptions };
};

// REFRESH TOKEN
export const refreshAdminTokenService = async (
  app: FastifyInstance,
  refreshToken?: string
) => {
  if (!refreshToken) {
    throw createError(401, "No refresh token");
  }

  let decoded: any;

  try {
    decoded = app.jwt.verify(refreshToken);
  } catch {
    throw createError(401, "Invalid refresh token");
  }

  if (decoded?.type !== "refresh") {
    throw createError(401, "Invalid refresh token");
  }

  const accessToken = app.jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, // ✅ FIXED
      type: "access",
    },
    { expiresIn: "50m" }
  );

  return {
    accessToken,
    cookie: getCookieOptions("access"),
  };
};

// SESSION CHECK
export const adminMeService = async (
  app: FastifyInstance,
  accessToken?: string
) => {
  if (!accessToken) {
    throw createError(401, "Not logged in");
  }

  let user: any;

  try {
    user = app.jwt.verify(accessToken);
  } catch {
    throw createError(401, "Invalid token");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role, // ✅ dynamic role
  };
};
