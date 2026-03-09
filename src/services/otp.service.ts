import { redis } from "../plugins/redis";

export async function generateOTP(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000);

  await redis.set(`otp:${email}`, otp, "EX", 300);

  return otp;
}

export async function verifyOTP(email: string, otp: string) {
  const stored = await redis.get(`otp:${email}`);

  if (!stored) return false;

  return stored === otp;
}