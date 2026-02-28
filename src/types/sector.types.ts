export type SectorStatus = "draft" | "published";

export type SectorBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string }
  | { type: "list"; items: string[] };

export interface CreateSectorDTO {
  title: string;
  excerpt: string;
  blocks: SectorBlock[];

  coverImage: {
    url: string;
    alt: string;
    publicId?: string;
  };

  order?: number;
  status?: SectorStatus;

  /* SEO */
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

export interface UpdateSectorDTO
  extends Partial<CreateSectorDTO> {}