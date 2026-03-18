export type BlogStatus = "draft" | "published";

/* ================= BLOCK TYPES ================= */

export type HeadingBlock = {
  type: "heading";
  data: {
    level: 1 | 2 | 3;
    text: string;
  };
};

export type ParagraphBlock = {
  type: "paragraph";
  data: {
    text: string;
  };
};

export type ImageBlock = {
  type: "image";
  data: {
    url: string;
    alt: string;
    caption?: string;
  };
};

export type GalleryBlock = {
  type: "gallery";
  data: {
    images: {
      url: string;
      alt?: string;
      caption?: string;
    }[];
  };
};

export type TableBlock = {
  type: "table";
  data: {
    headers: string[];
    rows: string[][];
  };
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
  slug?: string; //  Optional (auto-generated)
  excerpt: string;

  blocks: BlogBlock[];

  coverImage: {
    url: string;
    alt: string;
  };

  tags?: string[];
  status?: BlogStatus;

  // Featured support
  featuredPosition?: 1 | 2 | 3 | null;

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