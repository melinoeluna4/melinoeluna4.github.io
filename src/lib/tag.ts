const COMBINING_MARKS = /[\u0300-\u036f]/g;

export function tagSlug(tag: string): string {
  const slug = tag
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "sin-etiqueta";
}

export function tagHref(tag: string): string {
  return `/blog/etiqueta/${tagSlug(tag)}/`;
}
