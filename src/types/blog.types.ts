export type SectionType = "HERO" | "CONTENT" | "VISION" | "FEATURES";

export interface BlogSection {
  order: number;
  type: SectionType;
  isActive: boolean;
}
