import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const siteOrigin = "https://melinoeluna4.github.io";
const publicPages = [
  "/",
  "/proyectos/",
  "/proyectos/envcheck/",
  "/sobre-mi/",
  "/blog/",
  "/blog/go-context-en-produccion/",
];

async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target),
  }));

  expect(violations).toEqual([]);
}

async function expectSeo(page: Page, type: "website" | "article"): Promise<void> {
  const title = await page.title();
  expect(title.trim().length).toBeGreaterThan(0);

  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description?.trim().length ?? 0).toBeGreaterThan(0);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBeTruthy();
  expect(canonical?.startsWith(siteOrigin)).toBe(true);

  for (const property of ["og:title", "og:description", "og:type", "og:url", "og:image"]) {
    const content = await page.locator(`meta[property="${property}"]`).getAttribute("content");
    expect(content?.trim().length ?? 0, `${property} is empty`).toBeGreaterThan(0);
  }

  const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
  expect(ogType).toBe(type);

  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
  expect(ogUrl).toBe(canonical);

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toContain("/og-default.png");

  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
  expect(twitterCard).toBe("summary_large_image");
}

test.describe("home", () => {
  test("renders the hero, featured work and social links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Melinoe Luna" })).toBeVisible();
    await expect(
      page.getByText("DevOps Engineer & Backend Developer", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".project-card")).toHaveCount(4);
    await expect(page.locator(".post-row")).toHaveCount(3);

    const github = page.getByRole("link", { name: /GitHub de Melinoe Luna/ }).first();
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
    await expect(github).toHaveAttribute("rel", /noreferrer/);
  });

  test("uses one header, main, footer and a single h1", async ({ page }) => {
    for (const path of publicPages) {
      await page.goto(path);
      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });

  test("the skip link is the first keyboard target", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#contenido")).toBeFocused();
  });

  test("the theme toggle persists before and after reload", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /Cambiar a tema/i });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  });

  test("follows prefers-color-scheme when there is no stored preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("the mobile navigation works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 800 },
    });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Melinoe Luna" })).toBeVisible();

    const menu = page.locator("details.mobile-menu");
    await menu.locator("summary").click();
    await menu.getByRole("link", { name: "Proyectos" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Proyectos" })).toBeVisible();
    await context.close();
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const scrollBehavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(scrollBehavior).toBe("auto");

    const duration = await page
      .locator(".btn--primary")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(duration).not.toBe("0.15s");
  });

  test("passes axe in light and dark themes", async ({ page }) => {
    await page.goto("/");
    await expectNoAxeViolations(page);

    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expectNoAxeViolations(page);
  });
});

test.describe("projects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/proyectos/");
  });

  test("lists every project with a text status and visible tags", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Proyectos" })).toBeVisible();
    await expect(page.locator(".project-card")).toHaveCount(5);
    await expect(page.locator(".status--in-progress")).toHaveCount(1);
    await expect(page.locator(".status--completed")).toHaveCount(4);
    await expect(page.locator(".status--in-progress").first()).toContainText("In Progress");
    await expect(page.locator(".status--completed").first()).toContainText("Completed");
    await expect(page.getByText("SHA-256", { exact: true })).toBeVisible();
    await expect(page.getByText("Configuración", { exact: true })).toBeVisible();
    await expect(page.locator('a[href=""]')).toHaveCount(0);
  });

  test("only renders repository and demo links that exist", async ({ page }) => {
    const envcheckCard = page.locator(".project-card").filter({ hasText: "envcheck" });
    await expect(envcheckCard.getByRole("link", { name: /Ver ficha/ })).toHaveCount(1);
    await expect(envcheckCard.getByRole("link", { name: /Repositorio/ })).toHaveCount(1);
    await expect(envcheckCard.getByRole("link", { name: /Demo/ })).toHaveCount(0);

    const edgeCard = page.locator(".project-card").filter({ hasText: "Edge Notes" });
    await expect(edgeCard.getByRole("link", { name: /Repositorio/ })).toHaveCount(1);
    await expect(edgeCard.getByRole("link", { name: /Demo/ })).toHaveCount(1);

    const repoLink = edgeCard.getByRole("link", { name: /Repositorio/ });
    await expect(repoLink).toHaveAttribute("target", "_blank");
    await expect(repoLink).toHaveAttribute("rel", /noopener/);
    await expect(repoLink).toHaveAttribute("rel", /noreferrer/);
  });

  test("passes axe", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
});

test.describe("project detail", () => {
  test("renders the mini presentation and links", async ({ page }) => {
    await page.goto("/proyectos/envcheck/");

    await expect(page.getByRole("heading", { level: 1, name: "envcheck" })).toBeVisible();
    await expect(page.locator(".prose")).toContainText("Qué resuelve");
    await expect(page.getByRole("link", { name: /Repositorio/ })).toHaveAttribute(
      "href",
      "https://github.com/melinoeluna4/envcheck",
    );
    await expect(page.getByRole("link", { name: "Volver a proyectos" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Sigue explorando" })).toBeVisible();
  });

  test("passes axe", async ({ page }) => {
    await page.goto("/proyectos/envcheck/");
    await expectNoAxeViolations(page);
  });
});

test.describe("about", () => {
  test("shows history, education, roadmap and skills", async ({ page }) => {
    await page.goto("/sobre-mi/");

    await expect(page.getByRole("heading", { level: 1, name: "Sobre mí" })).toBeVisible();
    await expect(page.getByText("Historia", { exact: true })).toBeVisible();
    await expect(page.getByText("Formación", { exact: true })).toBeVisible();
    await expect(page.getByText("Roadmap", { exact: true })).toBeVisible();
    await expect(page.getByText("Skills", { exact: true })).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Grado en Ingeniería Informática" }),
    ).toBeVisible();
    await expect(page.getByText("Fundamentos de Go", { exact: true })).toBeVisible();
    await expect(
      page.locator(".timeline__status").filter({ hasText: "Completado" }).first(),
    ).toBeVisible();
    await expect(
      page.locator(".timeline__status").filter({ hasText: "En curso" }).first(),
    ).toBeVisible();
  });

  test("groups skills by visible level headings", async ({ page }) => {
    await page.goto("/sobre-mi/");

    for (const level of ["Avanzado", "Intermedio", "Aprendiendo"]) {
      await expect(page.getByRole("heading", { level: 3, name: level })).toBeVisible();
    }

    await expect(page.locator(".skill")).toHaveCount(22);
  });

  test("passes axe", async ({ page }) => {
    await page.goto("/sobre-mi/");
    await expectNoAxeViolations(page);
  });
});

test.describe("blog", () => {
  test("lists published posts newest-first and excludes drafts", async ({ page }) => {
    await page.goto("/blog/");

    await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
    await expect(page.locator(".post-row")).toHaveCount(4);

    const titles = (await page.locator(".post-row__title a").allTextContents()).map((title) =>
      title.trim(),
    );

    expect(titles).toHaveLength(4);
    expect(titles[0]).toContain("Context en Go");
    expect(titles[1]).toContain("Caché en Cloudflare");
    expect(titles[3]).toContain("Content collections");
    expect(titles.join(" ")).not.toContain("Kubernetes no es la respuesta");
  });

  test("shows tag counts and links to static tag pages", async ({ page }) => {
    await page.goto("/blog/");

    await expect(page.locator(".tag-index__item")).toHaveCount(10);

    const learningTag = page.locator(".tag-index__item").filter({ hasText: "Aprendizaje" });
    await expect(learningTag).toContainText("2");

    const cloudflareTag = page.locator(".tag-index__item").filter({ hasText: "Cloudflare" });
    await cloudflareTag.click();
    await expect(page.getByRole("heading", { level: 1, name: "Cloudflare" })).toBeVisible();
    await expect(page.locator(".post-row")).toHaveCount(1);
    await expect(page.locator('.tag-index__item[aria-current="page"]')).toContainText("Cloudflare");
  });

  test("filters live, updates the URL and announces the result count", async ({ page }) => {
    await page.goto("/blog/");

    const count = page.locator("#post-count");
    await expect(count).toHaveAttribute("aria-live", "polite");
    await expect(count).toContainText("4 notas");

    await page.locator("#blog-query").fill("rust");
    await expect(count).toContainText("1 nota");
    await expect(page.locator("[data-post-item]:visible")).toHaveCount(1);
    await expect(page).toHaveURL(/q=rust/);

    await page.locator("#blog-query").fill("");
    await page.locator("#blog-tag").selectOption("aprendizaje");
    await expect(count).toContainText("2 notas");
    await expect(page.locator("[data-post-item]:visible")).toHaveCount(2);
    await expect(page).toHaveURL(/tag=aprendizaje/);

    await page.locator("#blog-tag").selectOption("");
    await page.locator("#blog-query").fill("zzzz");
    await expect(count).toContainText("0 notas");
    await expect(page.locator("#filter-empty")).toBeVisible();

    await page.locator("#blog-clear").click();
    await expect(count).toContainText("4 notas");
    await expect(page.locator("[data-post-item]:visible")).toHaveCount(4);
    await expect(page).toHaveURL(/\/blog\/$/);
  });

  test("the static tag page works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/blog/etiqueta/rust/");
    await expect(page.getByRole("heading", { level: 1, name: "Rust" })).toBeVisible();
    await expect(page.locator(".post-row")).toHaveCount(1);
    await expect(page.getByText("Ownership en Rust", { exact: false })).toBeVisible();

    await context.close();
  });

  test("passes axe", async ({ page }) => {
    await page.goto("/blog/");
    await expectNoAxeViolations(page);
  });
});

test.describe("post", () => {
  test("renders highlighted code, dates and article metadata", async ({ page }) => {
    await page.goto("/blog/go-context-en-produccion/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Context en Go: cancelar antes de que duela",
      }),
    ).toBeVisible();
    await expect(page.getByText(/Actualizado el/).first()).toBeVisible();
    await expect(page.locator(".prose .astro-code").first()).toBeVisible();

    const codeBlock = page.locator(".prose .astro-code").first();
    const overflowX = await codeBlock.evaluate((element) => getComputedStyle(element).overflowX);
    expect(overflowX).toBe("auto");

    const published = await page
      .locator('meta[property="article:published_time"]')
      .getAttribute("content");
    const modified = await page
      .locator('meta[property="article:modified_time"]')
      .getAttribute("content");
    expect(published).toBeTruthy();
    expect(modified).toBeTruthy();
    expect(await page.locator('meta[property="article:tag"]').count()).toBe(3);
  });

  test("omits the updated date when the post has none", async ({ page }) => {
    await page.goto("/blog/cloudflare-workers-cache/");
    await expect(page.getByText(/Actualizado el/)).toHaveCount(0);
  });

  test("a draft and an unknown slug return the styled 404", async ({ page }) => {
    const draftResponse = await page.goto("/blog/kubernetes-no-es-la-respuesta/");
    expect(draftResponse?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Esta página no existe" }),
    ).toBeVisible();

    const unknownResponse = await page.goto("/ruta-que-no-existe/");
    expect(unknownResponse?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Esta página no existe" }),
    ).toBeVisible();
  });

  test("passes axe", async ({ page }) => {
    await page.goto("/blog/go-context-en-produccion/");
    await expectNoAxeViolations(page);
  });
});

test.describe("SEO and feeds", () => {
  for (const { path, type } of [
    { path: "/", type: "website" as const },
    { path: "/proyectos/", type: "website" as const },
    { path: "/proyectos/envcheck/", type: "website" as const },
    { path: "/sobre-mi/", type: "website" as const },
    { path: "/blog/", type: "website" as const },
    { path: "/blog/go-context-en-produccion/", type: "article" as const },
  ]) {
    test(`emits complete metadata on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expectSeo(page, type);
    });
  }

  test("server-renders the primary content without JavaScript", async ({ request }) => {
    const response = await request.get("/");
    const html = await response.text();

    expect(html).toContain("Melinoe Luna");
    expect(html).toContain("Proyectos destacados");
    expect(html).toContain("envcheck");
    expect(html).toContain("Context en Go");
  });

  test("publishes a valid RSS feed without drafts", async ({ request }) => {
    const response = await request.get("/rss.xml");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("https://melinoeluna4.github.io/blog/go-context-en-produccion/");
    expect(body).not.toContain("Kubernetes no es la respuesta");
  });

  test("publishes a sitemap with posts and tag pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(body).toContain("https://melinoeluna4.github.io/");
    expect(body).toContain("https://melinoeluna4.github.io/proyectos/");
    expect(body).toContain("https://melinoeluna4.github.io/proyectos/envcheck/");
    expect(body).toContain("https://melinoeluna4.github.io/blog/go-context-en-produccion/");
    expect(body).toContain("https://melinoeluna4.github.io/blog/etiqueta/go/");
    expect(body).not.toContain("kubernetes-no-es-la-respuesta");
  });

  test("points robots.txt at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("Sitemap: https://melinoeluna4.github.io/sitemap.xml");
  });
});

for (const width of [320, 360]) {
  test(`no horizontal page scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of publicPages) {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    }
  });
}
