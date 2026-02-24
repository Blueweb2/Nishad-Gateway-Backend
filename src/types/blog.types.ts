export type BlogStatus = "draft" | "published";

export interface CreateBlogDTO {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags?: string[];
  status?: BlogStatus;
}

export interface UpdateBlogDTO
  extends Partial<CreateBlogDTO> {
  slug?: string;
  publishedAt?: Date;
}