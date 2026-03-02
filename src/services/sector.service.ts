// sector.service.ts

import { SectorModel } from "../models/sector.model";
import slugify from "../utils/slugify";
import { CreateSectorDTO, UpdateSectorDTO } from "../types/sector.types";

/* ================= CREATE ================= */

export const createSectorService = async (data: CreateSectorDTO) => {
  const slug = slugify(data.title);

  const existing = await SectorModel.findOne({ slug });
  if (existing) {
    throw new Error("Sector with this title already exists");
  }

  const sector = await SectorModel.create({
    ...data,
    slug,
  });

  return sector;
};

/* ================= GET ALL ================= */

export const getAllSectorsService = async (admin = false) => {
  if (admin) {
    return SectorModel.find().sort({ createdAt: -1 });
  }

  return SectorModel.find({ status: "published" }).sort({ order: 1, createdAt: -1 })
};

/* ================= GET BY SLUG ================= */

export const getSectorBySlugService = async (slug: string) => {
  const sector = await SectorModel.findOne({
    slug,
    status: "published",
  });

  if (!sector) {
    throw new Error("Sector not found");
  }

  return sector;
};

/* ================= UPDATE ================= */
export const updateSectorService = async (
  id: string,
  data: UpdateSectorDTO
) => {
  let updatePayload: any = { ...data };

  if (data.title) {
    const newSlug = slugify(data.title);

    const existing = await SectorModel.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });

    if (existing) {
      throw new Error("Another sector with this title already exists");
    }

    updatePayload.slug = newSlug;
  }

  const updated = await SectorModel.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true }
  );

  if (!updated) {
    throw new Error("Sector not found");
  }

  return updated;
};
/* ================= DELETE ================= */

export const deleteSectorService = async (id: string) => {
  const deleted = await SectorModel.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Sector not found");
  }

  return deleted;
};

/* ================= GET BY ID (ADMIN) ================= */

export const getSectorByIdService = async (id: string) => {
  const sector = await SectorModel.findById(id);

  if (!sector) {
    throw new Error("Sector not found");
  }

  return sector;
};