import { describe, expect, it } from "vitest";
import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("marks the home only on the exact root", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/proyectos/", "/")).toBe(false);
  });

  it("ignores trailing slashes", () => {
    expect(isActivePath("/proyectos", "/proyectos/")).toBe(true);
    expect(isActivePath("/blog/", "/blog")).toBe(true);
  });

  it("keeps a section active on its child routes", () => {
    expect(isActivePath("/blog/go-context-en-produccion/", "/blog/")).toBe(true);
    expect(isActivePath("/blog/etiqueta/go/", "/blog/")).toBe(true);
    expect(isActivePath("/proyectos/atlas/", "/proyectos/")).toBe(true);
  });

  it("does not match a sibling prefix", () => {
    expect(isActivePath("/proyectos-archivados/", "/proyectos/")).toBe(false);
  });
});
