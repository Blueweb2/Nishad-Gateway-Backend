import { BlogModel } from "../models/blog.model";
import slugify from "../utils/slugify";
import { CreateBlogDTO, UpdateBlogDTO } from "../types/blog.types";
import { deleteCloudinaryImageService } from "./cloudinary.service";

/* ================= READING TIME ================= */

const calculateReadingTimeFromBlocks = (blocks: any[]): number => {
  let totalWords = 0;

  blocks.forEach((block) => {
    if (block.type === "heading" && block.data?.text) {
      totalWords += block.data.text.split(/\s+/).length;
    }

    if (block.type === "paragraph" && block.data?.text) {
      totalWords += block.data.text.split(/\s+/).length;
    }

    if (block.type === "table" && block.data?.rows) {
      block.data.rows.forEach((row: string[]) => {
        row.forEach((cell) => {
          totalWords += cell.split(/\s+/).length;
        });
      });
    }
  });

  return Math.max(1, Math.ceil(totalWords / 200));
};

/* ================= SLUG GENERATOR ================= */

const generateUniqueSlug = async (
  base: string,
  excludeId?: string
): Promise<string> => {
  const baseSlug = slugify(base);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await BlogModel.findOne({
      slug,
      _id: { $ne: excludeId },
    }).lean();

    if (!existing) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

/* ================================================== */
/* ================= BLOG SERVICE =================== */
/* ================================================== */

export class BlogService {

  /* ================= CREATE ================= */

  static async create(data: CreateBlogDTO) {

    if (!data.blocks || data.blocks.length === 0) {
      throw new Error("Blocks are required");
    }

    const slug = await generateUniqueSlug(
      data.slug || data.title
    );

    const readingTime =
      calculateReadingTimeFromBlocks(data.blocks);

    /* ===== FEATURED HANDLING ===== */

    if (data.featuredPosition) {
      // Remove same position from other blogs
      await BlogModel.updateMany(
        { featuredPosition: data.featuredPosition },
        { $set: { featuredPosition: null } }
      );
    }

    const blog = await BlogModel.create({
      ...data,
      slug,
      readingTime,
      featuredPosition: data.featuredPosition ?? null,
      publishedAt:
        data.status === "published" ? new Date() : undefined,
    });

    return blog.toObject();
  }

  /* ================= PUBLIC ================= */

  static async getAllPublished(
    page = 1,
    limit = 10,
    tag?: string
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const filter: any = {
      status: "published",
      isDeleted: false,
    };

    if (tag) {
      filter.tags = tag;
    }

    const [blogs, total] = await Promise.all([
      BlogModel.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),

      BlogModel.countDocuments(filter),
    ]);

    return {
      data: blogs,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  static async getBySlug(slug: string) {
    return BlogModel.findOne({
      slug,
      status: "published",
      isDeleted: false,
    }).lean();
  }

  static async getFeatured() {
    return BlogModel.find({
      featuredPosition: { $ne: null },
      status: "published",
      isDeleted: false,
    })
      .sort({ featuredPosition: 1 })
      .limit(3)
      .lean();
  }


  /* ================= RELATED ================= */

static async getRelatedBySlug(
  slug: string,
  limit: number = 3
) {
  // 1️⃣ Get current blog
  const currentBlog = await BlogModel.findOne({
    slug,
    status: "published",
    isDeleted: false,
  }).lean();

  if (!currentBlog) return [];

  if (!currentBlog.tags || currentBlog.tags.length === 0) {
    return [];
  }

  // 2️⃣ Find related blogs
  return BlogModel.find({
    _id: { $ne: currentBlog._id },
    status: "published",
    isDeleted: false,
    tags: { $in: currentBlog.tags },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

  /* ================= ADMIN ================= */

  static async getAllAdmin() {
    return BlogModel.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    return BlogModel.findOne({
      _id: id,
      isDeleted: false,
    }).lean();
  }

  /* ================= UPDATE ================= */

  static async update(
    id: string,
    data: UpdateBlogDTO
  ) {
    const blog = await BlogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new Error("Blog not found");
    }

    const updatePayload: any = { ...data };

    /* ===== SLUG HANDLING ===== */

    if (data.slug && data.slug !== blog.slug) {
      updatePayload.slug = await generateUniqueSlug(
        data.slug,
        id
      );
    } else if (data.title && data.title !== blog.title) {
      updatePayload.slug = await generateUniqueSlug(
        data.title,
        id
      );
    }

    /* ===== BLOCK UPDATE ===== */

    if (data.blocks) {
      updatePayload.readingTime =
        calculateReadingTimeFromBlocks(data.blocks);
    }

    /* ===== FEATURED HANDLING ===== */

    if (data.featuredPosition !== undefined) {

      // If assigning a position
      if (data.featuredPosition !== null) {

        // Ensure no duplicate position
        await BlogModel.updateMany(
          {
            featuredPosition: data.featuredPosition,
            _id: { $ne: id },
          },
          { $set: { featuredPosition: null } }
        );

        // Optional: enforce max 3 safeguard
        const featuredCount =
          await BlogModel.countDocuments({
            featuredPosition: { $ne: null },
            _id: { $ne: id },
          });

        if (featuredCount >= 3) {
          throw new Error(
            "Maximum 3 featured blogs allowed"
          );
        }
      }

      updatePayload.featuredPosition =
        data.featuredPosition;
    }

    /* ===== PUBLISH DATE ===== */

    if (
      data.status === "published" &&
      !blog.publishedAt
    ) {
      updatePayload.publishedAt = new Date();
    }

    const updatedBlog =
      await BlogModel.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true }
      ).lean();

    if (!updatedBlog) {
      throw new Error("Update failed");
    }

    return updatedBlog;
  }

  /* ================= DELETE (SOFT) ================= */

  static async delete(id: string) {
    const blog = await BlogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new Error("Blog not found");
    }

    /* ===== ASSET RETENTION ===== */
    // Note: Since this is purely a soft delete (isDeleted = true), 
    // Cloudinary images are intentionally NOT deleted to prevent breaking data
    // should the blog ever be recovered.

    /* ===== REMOVE FEATURED ===== */

    blog.featuredPosition = null;

    /* ===== SOFT DELETE ===== */

    blog.isDeleted = true;
    await blog.save();
  }
}