import type { APIRoute } from "astro";
import { site } from "../config";
import { getPosts, getTagIndex } from "../lib/posts";
import { absoluteUrl } from "../lib/site-url";
import { escapeXml } from "../lib/xml";

interface SitemapEntry {
  readonly path: string;
  readonly lastmod?: string;
}

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  const tags = await getTagIndex(posts);
  const origin = context.site ?? site.url;

  const entries: SitemapEntry[] = [
    { path: "/" },
    { path: "/proyectos/" },
    { path: "/sobre-mi/" },
    { path: "/blog/" },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}/`,
      lastmod: (post.updatedDate ?? post.pubDate).toISOString().slice(0, 10),
    })),
    ...tags.map((tag) => ({
      path: `/blog/etiqueta/${tag.slug}/`,
    })),
  ];

  const urls = entries
    .map((entry) =>
      [
        "<url>",
        `<loc>${escapeXml(absoluteUrl(entry.path, origin))}</loc>`,
        entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : "",
        "</url>",
      ].join(""),
    )
    .join("");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
