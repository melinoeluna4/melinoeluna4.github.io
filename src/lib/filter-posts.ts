import { tagSlug } from "./tag";

export const MAX_QUERY_LENGTH = 100;

const COMBINING_MARKS = /[\u0300-\u036f]/g;

export interface FilterablePost {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface PostFilter {
  readonly query: string;
  readonly tag: string;
}

export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();
}

export function normalizeQuery(value: string): string {
  return normalizeText(value).trim().slice(0, MAX_QUERY_LENGTH);
}

export function matchesPost(post: FilterablePost, filter: PostFilter): boolean {
  const query = normalizeQuery(filter.query);
  const tag = filter.tag.trim();

  if (tag && !post.tags.some((value) => tagSlug(value) === tag || value === tag)) {
    return false;
  }

  if (!query) {
    return true;
  }

  const haystack = normalizeText([post.title, post.description, ...post.tags].join(" "));

  return query.split(/\s+/).every((token) => haystack.includes(token));
}

export function filterPosts<T extends FilterablePost>(
  posts: readonly T[],
  filter: PostFilter,
): T[] {
  return posts.filter((post) => matchesPost(post, filter));
}

export function resultCountLabel(count: number): string {
  return count === 1 ? "1 nota" : `${count} notas`;
}
