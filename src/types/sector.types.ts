// sector.types.ts

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
  };
  status?: SectorStatus;
}

export interface UpdateSectorDTO extends Partial<CreateSectorDTO> {}