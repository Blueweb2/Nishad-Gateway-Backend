import sharp from "sharp";
import path from "path";
import fs from "fs";

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

export const saveWebpImageService = async (
  buffer: Buffer,
  folder: string,
  prefix: string
) => {
  const uploadDir = path.join(process.cwd(), "uploads", folder);
  ensureDir(uploadDir);

  const fileName = `${prefix}-${Date.now()}.webp`;
  const outputPath = path.join(uploadDir, fileName);

  await sharp(buffer).webp({ quality: 80 }).toFile(outputPath);

  return `/uploads/${folder}/${fileName}`;
};
