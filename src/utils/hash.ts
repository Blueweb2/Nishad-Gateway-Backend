import bcrypt from "bcryptjs";

export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
