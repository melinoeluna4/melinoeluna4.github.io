import { describe, expect, it } from "vitest";
import { tagHref, tagSlug } from "./tag";

describe("tagSlug", () => {
  it("normalises case, spaces and accents", () => {
    expect(tagSlug("Caché")).toBe("cache");
    expect(tagSlug("GitHub Actions")).toBe("github-actions");
    expect(tagSlug("  Aprendizaje  ")).toBe("aprendizaje");
  });

  it("removes punctuation and collapses separators", () => {
    expect(tagSlug("Go / Rust")).toBe("go-rust");
    expect(tagSlug("C++")).toBe("c");
  });

  it("falls back for an empty tag", () => {
    expect(tagSlug("---")).toBe("sin-etiqueta");
  });
});

describe("tagHref", () => {
  it("builds a static tag route with a trailing slash", () => {
    expect(tagHref("Cloudflare")).toBe("/blog/etiqueta/cloudflare/");
  });
});
