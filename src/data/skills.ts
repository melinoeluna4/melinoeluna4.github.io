import type { SkillLevel } from "../lib/content-types";

export interface Skill {
  readonly name: string;
  readonly category: string;
  readonly level: SkillLevel;
}

export interface SkillLevelMeta {
  readonly id: SkillLevel;
  readonly label: string;
  readonly description: string;
}

export const skillLevels = [
  {
    id: "advanced",
    label: "Avanzado",
    description: "Lo uso con criterio propio y puedo explicar sus decisiones.",
  },
  {
    id: "intermediate",
    label: "Intermedio",
    description: "Lo he usado en proyectos y sigo profundizando.",
  },
  {
    id: "learning",
    label: "Aprendiendo",
    description: "Está en mi roadmap activo y practico con ejercicios y prototipos.",
  },
] as const satisfies readonly SkillLevelMeta[];

export const skills = [
  { name: "Go", category: "Backend", level: "advanced" },
  { name: "CLI tools", category: "Backend", level: "advanced" },
  { name: "Testing en Go", category: "Backend", level: "advanced" },
  { name: "Documentación técnica", category: "Herramientas", level: "advanced" },
  { name: "Docker", category: "Infraestructura", level: "advanced" },
  { name: "Linux", category: "Infraestructura", level: "advanced" },
  { name: "Git", category: "Herramientas", level: "advanced" },
  { name: "SQL", category: "Datos", level: "advanced" },
  { name: "Rust", category: "Backend", level: "intermediate" },
  { name: "TypeScript", category: "Frontend", level: "intermediate" },
  { name: "Astro", category: "Frontend", level: "intermediate" },
  { name: "Tailwind CSS", category: "Frontend", level: "intermediate" },
  { name: "Cloudflare Workers", category: "Cloud", level: "intermediate" },
  { name: "Cloudflare Pages", category: "Cloud", level: "intermediate" },
  { name: "Cloudflare KV", category: "Cloud", level: "intermediate" },
  { name: "Cloudflare D1", category: "Datos", level: "intermediate" },
  { name: "GitHub Actions", category: "CI/CD", level: "intermediate" },
  { name: "APIs REST", category: "Backend", level: "intermediate" },
  { name: "Kubernetes", category: "Infraestructura", level: "learning" },
  { name: "Terraform", category: "Infraestructura", level: "learning" },
  { name: "Cloudflare R2", category: "Cloud", level: "learning" },
  { name: "htmx", category: "Frontend", level: "learning" },
  { name: "Observabilidad", category: "Infraestructura", level: "learning" },
] as const satisfies readonly Skill[];
