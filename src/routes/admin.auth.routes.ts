import { FastifyInstance } from "fastify";
import crypto from "crypto";

import AdminToken from "../models/AdminToken.model";
import { createAdminTokens } from "../utils/createAdminTokens";
import { adminAuth } from "../middlewares/adminAuth";
import { Admin } from "../models/Admin.model";

const hashToken = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex");

export default async function adminAuthRoutes(app: FastifyInstance) {
    // ✅ LOGIN
    app.post("/admin/login", async (req, reply) => {
        const { email, password } = req.body as any;

        const admin = await Admin.findOne({ email });
        if (!admin) return reply.code(401).send({ message: "Invalid credentials" });

        // TODO: bcrypt password check
        // if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = await createAdminTokens(app, admin, {
            userAgent: req.headers["user-agent"],
            ip: req.ip,
        });

        reply.setCookie("adminRefreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/admin/refresh",
        });

        return reply.send({ accessToken });
    });

    // ✅ REFRESH (Rotation)
    app.post("/admin/refresh", async (req, reply) => {
        const refreshToken = req.cookies.adminRefreshToken;

        if (!refreshToken) {
            return reply.code(401).send({ message: "No refresh token" });
        }

        try {
            const payload = app.jwt.verify(refreshToken) as any;

            if (payload.type !== "refresh") {
                return reply.code(401).send({ message: "Invalid refresh token type" });
            }

            const tokenHash = hashToken(refreshToken);

            const stored = await AdminToken.findOne({
                adminId: payload.id,
                tokenHash,
                isRevoked: false,
                expiresAt: { $gt: new Date() },
            });

            // 🔥 stolen token / reuse detection
            if (!stored) {
                await AdminToken.updateMany(
                    { adminId: payload.id },
                    { $set: { isRevoked: true } }
                );

                reply.clearCookie("adminRefreshToken", { path: "/api/admin/refresh" });

                return reply
                    .code(401)
                    .send({ message: "Refresh token reuse detected" });
            }

            // rotate: revoke old
            stored.isRevoked = true;
            await stored.save();

            const admin = await Admin.findById(payload.id);
            if (!admin) return reply.code(401).send({ message: "Admin not found" });

            const { accessToken, refreshToken: newRefreshToken } =
                await createAdminTokens(app, admin, {
                    userAgent: req.headers["user-agent"],
                    ip: req.ip,
                });

            reply.setCookie("adminRefreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/api/admin/refresh",
            });

            return reply.send({ accessToken });
        } catch {
            reply.clearCookie("adminRefreshToken", { path: "/api/admin/refresh" });
            return reply.code(401).send({ message: "Refresh token expired/invalid" });
        }
    });

    // ✅ LOGOUT
    app.post("/admin/logout", async (req, reply) => {
        const refreshToken = req.cookies.adminRefreshToken;

        if (refreshToken) {
            await AdminToken.updateOne(
                { tokenHash: hashToken(refreshToken) },
                { $set: { isRevoked: true } }
            );
        }

        reply.clearCookie("adminRefreshToken", { path: "/api/admin/refresh" });
        return reply.send({ message: "Logged out" });
    });

    // ✅ PROTECTED TEST
    app.get("/admin/me", { preHandler: [adminAuth] }, async (req) => {
        return { user: req.user };
    });
}