import { slugSchema } from "./common.slug";

/* ======================================================
   CREATE BLOG POST (ADMIN)
====================================================== */

export const createCityBlogPostSchema = {
  type: "object",
  required: ["title", "slug", "content"],
  properties: {
    title: { type: "string", minLength: 3 },
    slug: slugSchema,
    excerpt: { type: "string", maxLength: 300 },
    content: { type: "string", minLength: 10 },

    coverImage: { type: "string" },
    gallery: {
      type: "array",
      items: { type: "string" },
    },

    metaTitle: { type: "string", maxLength: 70 },
    metaDescription: { type: "string", maxLength: 160 },
    metaKeywords: {
      type: "array",
      items: { type: "string" },
    },
    canonicalUrl: { type: "string" },
    ogImage: { type: "string" },

    isPublished: { type: "boolean" },
  },
};

/* ======================================================
   UPDATE BLOG POST (ADMIN)
====================================================== */

export const updateCityBlogPostSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 3 },
    slug: slugSchema,
    excerpt: { type: "string", maxLength: 300 },
    content: { type: "string", minLength: 10 },

    coverImage: { type: "string" },
    gallery: {
      type: "array",
      items: { type: "string" },
    },

    metaTitle: { type: "string", maxLength: 70 },
    metaDescription: { type: "string", maxLength: 160 },
    metaKeywords: {
      type: "array",
      items: { type: "string" },
    },
    canonicalUrl: { type: "string" },
    ogImage: { type: "string" },

    isPublished: { type: "boolean" },
  },
};

/* ======================================================
   PARAMS: PUBLIC BLOG DETAIL
   /cities/:citySlug/:categorySlug/:blogSlug
====================================================== */

export const publicCityBlogPostParamsSchema = {
  type: "object",
  required: ["citySlug", "categorySlug", "blogSlug"],
  properties: {
    citySlug: slugSchema,
    categorySlug: slugSchema,
    blogSlug: slugSchema,
  },
};
