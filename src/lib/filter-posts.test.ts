import { describe, expect, it } from "vitest";
import { filterPosts, matchesPost, normalizeQuery, resultCountLabel } from "./filter-posts";

const posts = [
  {
    title: "Context en Go",
    description: "Cancelar peticiones a tiempo",
    tags: ["Go", "Backend"],
  },
  {
    title: "Caché en Cloudflare Workers",
    description: "Semántica HTTP y respuestas compartidas",
    tags: ["Cloudflare", "Rendimiento"],
  },
  {
    title: "Ownership en Rust",
    description: "Mover, prestar o clonar",
    tags: ["Rust", "Aprendizaje"],
  },
] as const;

describe("matchesPost", () => {
  it("matches a literal query across title, description and tags", () => {
    expect(matchesPost(posts[0], { query: "context", tag: "" })).toBe(true);
    expect(matchesPost(posts[0], { query: "cancelar", tag: "" })).toBe(true);
    expect(matchesPost(posts[0], { query: "backend", tag: "" })).toBe(true);
  });

  it("ignores accents and case", () => {
    expect(matchesPost(posts[1], { query: "cache", tag: "" })).toBe(true);
    expect(matchesPost(posts[1], { query: "CACHÉ", tag: "" })).toBe(true);
  });

  it("requires every query token", () => {
    expect(matchesPost(posts[1], { query: "cache http", tag: "" })).toBe(true);
    expect(matchesPost(posts[1], { query: "cache rust", tag: "" })).toBe(false);
  });

  it("treats regex and Unicode characters literally", () => {
    expect(matchesPost(posts[2], { query: ".*", tag: "" })).toBe(false);
    expect(matchesPost(posts[2], { query: "Rust ✓", tag: "" })).toBe(false);
  });

  it("filters by tag slug", () => {
    expect(matchesPost(posts[0], { query: "", tag: "go" })).toBe(true);
    expect(matchesPost(posts[0], { query: "", tag: "rust" })).toBe(false);
  });

  it("returns all posts when the filter is empty", () => {
    expect(filterPosts(posts, { query: "", tag: "" })).toHaveLength(3);
  });
});

describe("normalizeQuery", () => {
  it("trims and limits the query to 100 characters", () => {
    expect(normalizeQuery("  Go  ")).toBe("go");
    expect(normalizeQuery("a".repeat(200))).toHaveLength(100);
  });
});

describe("resultCountLabel", () => {
  it("uses singular and plural labels", () => {
    expect(resultCountLabel(0)).toBe("0 notas");
    expect(resultCountLabel(1)).toBe("1 nota");
    expect(resultCountLabel(4)).toBe("4 notas");
  });
});
