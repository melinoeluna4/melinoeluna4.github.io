export interface EducationItem {
  readonly title: string;
  readonly school: string;
  readonly period: string;
  readonly description: string;
}

export interface Principle {
  readonly title: string;
  readonly description: string;
}

export interface AboutContent {
  readonly intro: readonly string[];
  readonly location: string;
  readonly availability: string;
  readonly education: readonly EducationItem[];
  readonly principles: readonly Principle[];
}

/**
 * Sample biography for the first public build. Edit this file (or move the
 * copy into a collection later) to replace it with Melinoe's own words.
 */
export const about = {
  intro: [
    "Soy Melinoe Luna, DevOps Engineer y Backend Developer. Tengo 20 años y acabo de terminar mi formación en ingeniería informática.",
    "Me interesa la parte del software que hace que todo lo demás funcione: APIs pequeñas, despliegues reproducibles, observabilidad y sistemas que fallan de forma predecible. Trabajo sobre todo con Go, Rust y el ecosistema de Cloudflare.",
    "Este sitio es mi cuaderno público: proyectos, notas técnicas y el roadmap de lo que estoy aprendiendo. Si algo no está claro, el código suele estar en GitHub.",
  ],
  location: "España · remoto",
  availability: "Abierta a oportunidades junior, prácticas y proyectos de automatización.",
  education: [
    {
      title: "Grado en Ingeniería Informática",
      school: "Universidad · España",
      period: "2022 — 2026",
      description:
        "Ingeniería del software, sistemas distribuidos, bases de datos y fundamentos de redes.",
    },
    {
      title: "Bachillerato Tecnológico",
      school: "IES · España",
      period: "2020 — 2022",
      description: "Base en matemáticas, física y programación.",
    },
  ],
  principles: [
    {
      title: "Menos superficie, menos fallos",
      description:
        "Prefiero una solución pequeña y observable antes que una plataforma que nadie entiende.",
    },
    {
      title: "Si no se puede medir, no está terminado",
      description:
        "Un cambio incluye una forma de comprobarlo: tests, métricas o un build que falla cuando toca.",
    },
    {
      title: "La documentación es parte del sistema",
      description:
        "Un README honesto ahorra más tiempo que una explicación que solo vive en una cabeza.",
    },
    {
      title: "Automatiza lo que repites dos veces",
      description:
        "Los pipelines, los entornos y las tareas repetibles son parte del producto, no un extra.",
    },
  ],
} satisfies AboutContent;
