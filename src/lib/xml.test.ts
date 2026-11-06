import { describe, expect, it } from "vitest";
import { escapeXml } from "./xml";

describe("escapeXml", () => {
  it("escapes the five XML entities", () => {
    expect(escapeXml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;",
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeXml("Go, Rust y Cloudflare")).toBe("Go, Rust y Cloudflare");
  });
});
