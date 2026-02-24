export type BlogStatus = "draft" | "published";

/* ================= BLOCK TYPES ================= */

export type HeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type ImageBlock = {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
};

export type GalleryBlock = {
  type: "gallery";
  images: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type BlogBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | GalleryBlock
  | TableBlock;

/* ================= DTO ================= */

export interface CreateBlogDTO {
  title: string;
  slug: string;
  excerpt: string;

  blocks: BlogBlock[];

  coverImage: {
    url: string;
    alt: string;
  };

  tags?: string[];
  status?: BlogStatus;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface UpdateBlogDTO
  extends Partial<CreateBlogDTO> {
  publishedAt?: Date;
}