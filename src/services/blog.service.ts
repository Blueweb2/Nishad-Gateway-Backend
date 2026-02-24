// services/blog.service.ts

import { BlogModel } from "../models/blog.model";
import slugify from "../utils/slugify";
import DOMPurify from "isomorphic-dompurify";
import { CreateBlogDTO, UpdateBlogDTO } from "../types/blog.types";

/* ================= SANITIZER ================= */

const sanitizeHTML = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "p", "strong", "em",
      "ul", "ol", "li", "a", "img",
      "table", "thead", "tbody", "tr", "td", "th",
      "blockquote"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data:image\/))/i,
  });

/* ================= READING TIME ================= */

const calculateReadingTime = (html: string): number => {
  const plainText = html.replace(/<[^>]*>/g, "");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/* ================= SLUG GENERATOR ================= */

const generateUniqueSlug = async (
  title: string,
  excludeId?: string
): Promise<string> => {
  const baseSlug = slugify(title);
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
    const slug = await generateUniqueSlug(data.title);

    const cleanContent = sanitizeHTML(data.content);
    const cleanExcerpt = sanitizeHTML(data.excerpt);

    const readingTime = calculateReadingTime(cleanContent);

    const blog = await BlogModel.create({
      ...data,
      slug,
      content: cleanContent,
      excerpt: cleanExcerpt,
      readingTime,
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

static async update(
  id: string,
  data: UpdateBlogDTO
) {
  const blog = await BlogModel.findById(id);

  if (!blog || blog.isDeleted) {
    throw new Error("Blog not found");
  }

  const updatePayload: Partial<
    UpdateBlogDTO & {
      slug: string;
      readingTime: number;
      publishedAt: Date;
    }
  > = { ...data };

  /* ===== SLUG HANDLING ===== */

  // 1️⃣ Manual slug update
  if (data.slug && data.slug !== blog.slug) {
    updatePayload.slug = await generateUniqueSlug(
      data.slug,
      id
    );
  }

  // 2️⃣ Auto regenerate slug if title changed
  else if (data.title && data.title !== blog.title) {
    updatePayload.slug = await generateUniqueSlug(
      data.title,
      id
    );
  }

  /* ===== SANITIZE CONTENT ===== */

  if (data.content) {
    const cleanContent = sanitizeHTML(data.content);
    updatePayload.content = cleanContent;
    updatePayload.readingTime =
      calculateReadingTime(cleanContent);
  }

  if (data.excerpt) {
    updatePayload.excerpt = sanitizeHTML(data.excerpt);
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

  /* ================= DELETE (SOFT DELETE) ================= */

  static async delete(id: string) {
    const blog = await BlogModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).lean();

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  }
}