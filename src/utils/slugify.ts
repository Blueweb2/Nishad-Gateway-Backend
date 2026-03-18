export default function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD") // 🔥 handles special chars
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}