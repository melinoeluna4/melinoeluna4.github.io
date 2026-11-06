import type { CollectionEntry } from "astro:content";
import { getCollection, getEntry } from "astro:content";
import type { PostView, TagCount } from "./content-types";
import { tagSlug } from "./tag";

function comparePosts(left: PostView, right: PostView): number {
  return right.pubDate.getTime() - left.pubDate.getTime();
}

function assertUniqueSlugs(posts: readonly PostView[]): void {
  const seen = new Set<string>();

  for (const post of posts) {
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate slug "${post.slug}" in the blog collection`);
    }

    seen.add(post.slug);
  }
}

export async function getPosts(): Promise<PostView[]> {
  const entries = await getCollection("blog", ({ data }) => !data.draft);

  const posts = entries.map(
    (entry): PostView => ({
      id: entry.id,
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      updatedDate: entry.data.updatedDate,
      tags: [...entry.data.tags],
      draft: entry.data.draft,
    }),
  );

  assertUniqueSlugs(posts);

  return posts.sort(comparePosts);
}

export async function getRecentPosts(limit = 3): Promise<PostView[]> {
  const posts = await getPosts();
  return posts.slice(0, limit);
}

export async function getPostEntry(slug: string): Promise<CollectionEntry<"blog"> | undefined> {
  const entry = await getEntry("blog", slug);

  if (!entry || entry.data.draft) {
    return undefined;
  }

  return entry;
}

export async function getTagIndex(posts?: readonly PostView[]): Promise<TagCount[]> {
  const source = posts ?? (await getPosts());
  const counts = new Map<string, { name: string; count: number }>();

  for (const post of source) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const current = counts.get(slug);

      if (current) {
        current.count += 1;
      } else {
        counts.set(slug, { name: tag, count: 1 });
      }
    }
  }

  return [...counts.entries()]
    .map(([slug, value]) => ({ slug, name: value.name, count: value.count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "es"));
}

export function getPostsByTag(posts: readonly PostView[], slug: string): PostView[] {
  return posts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

export function getRelatedPosts(
  current: PostView,
  posts: readonly PostView[],
  limit = 2,
): PostView[] {
  const currentTags = new Set(current.tags.map((tag) => tagSlug(tag)));

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tagSlug(tag))).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || right.post.pubDate.getTime() - left.post.pubDate.getTime(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
