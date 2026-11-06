/**
 * Single source of truth for the site identity, navigation and external
 * profiles. Replace the social URLs and handles with the real accounts before
 * publishing if they differ from the ones below.
 */
export interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly handle: string;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly role: string;
  readonly focus: readonly string[];
  readonly description: string;
  readonly locale: string;
  readonly url: string;
  readonly defaultOgImage: string;
  readonly social: readonly SocialLink[];
  readonly nav: readonly NavItem[];
}

export const site = {
  name: "Melinoe Luna",
  shortName: "ML",
  role: "DevOps Engineer & Backend Developer",
  focus: ["Go", "DevOps", "Rust", "Cloudflare"],
  description:
    "Portfolio y notas técnicas de Melinoe Luna, DevOps Engineer y Backend Developer especializada en Go, Rust y Cloudflare.",
  locale: "es",
  url: "https://melinoeluna4.github.io",
  defaultOgImage: "/og-default.png",
  social: [
    {
      label: "GitHub",
      url: "https://github.com/melinoeluna4",
      handle: "@melinoeluna4",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/melinoeluna4",
      handle: "melinoeluna4",
    },
    {
      label: "Twitter / X",
      url: "https://x.com/melinoeluna4",
      handle: "@melinoeluna4",
    },
  ],
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Proyectos", href: "/proyectos/" },
    { label: "Sobre mí", href: "/sobre-mi/" },
    { label: "Blog", href: "/blog/" },
  ],
} satisfies SiteConfig;
