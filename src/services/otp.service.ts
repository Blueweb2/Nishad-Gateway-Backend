
const otpStore: Record<string, { otp: string; expires: number }> = {};

export async function generateOTP(email: string) {

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  return otp;
}

export async function verifyOTP(email: string, otp: string) {

  const record = otpStore[email];

  if (!record) return false;

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return false;
  }

  if (record.otp !== otp) return false;

  delete otpStore[email];

  return true;
}