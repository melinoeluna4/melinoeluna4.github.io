import type { APIRoute } from "astro";
import { site } from "../config";
import { getPosts } from "../lib/posts";
import { absoluteUrl } from "../lib/site-url";
import { escapeXml } from "../lib/xml";

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  const origin = context.site ?? site.url;
  const blogUrl = absoluteUrl("/blog/", origin);
  const feedUrl = absoluteUrl("/rss.xml", origin);
  const latestPost = posts[0];

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}/`, origin);
      const categories = post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("");

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${post.pubDate.toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${site.name} · Blog`)}</title>`,
    `<link>${escapeXml(blogUrl)}</link>`,
    `<description>${escapeXml(site.description)}</description>`,
    "<language>es</language>",
    `<copyright>© ${new Date().getUTCFullYear()} ${escapeXml(site.name)}</copyright>`,
    latestPost ? `<lastBuildDate>${latestPost.pubDate.toUTCString()}</lastBuildDate>` : "",
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
