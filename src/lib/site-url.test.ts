import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./site-url";

describe("absoluteUrl", () => {
  it("resolves a path against the configured origin", () => {
    expect(absoluteUrl("/blog/", "https://melinoeluna4.github.io")).toBe(
      "https://melinoeluna4.github.io/blog/",
    );
  });

  it("accepts a URL instance", () => {
    expect(absoluteUrl("/rss.xml", new URL("https://example.com"))).toBe(
      "https://example.com/rss.xml",
    );
  });

  it("keeps a pathname that already has a trailing slash", () => {
    expect(absoluteUrl("/proyectos/", "https://example.com")).toBe(
      "https://example.com/proyectos/",
    );
  });
});
