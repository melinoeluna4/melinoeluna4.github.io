import type { RoadmapStatus } from "../lib/content-types";

export interface RoadmapItem {
  readonly label: string;
  readonly status: RoadmapStatus;
  readonly note: string;
}

export const roadmapStatusLabels: Record<RoadmapStatus, string> = {
  done: "Completado",
  learning: "En curso",
  planned: "Planeado",
};

export const roadmapStatusIcons: Record<RoadmapStatus, string> = {
  done: "✓",
  learning: "→",
  planned: "○",
};

export const roadmap = [
  {
    label: "Fundamentos de Go",
    status: "done",
    note: "Sintaxis, interfaces, tests y manejo explícito de errores.",
  },
  {
    label: "SQL y modelado de datos",
    status: "done",
    note: "Esquemas normalizados, consultas y migraciones pequeñas.",
  },
  {
    label: "Docker y despliegues",
    status: "done",
    note: "Imágenes reproducibles, compose y pipelines de CI.",
  },
  {
    label: "Concurrencia en Go",
    status: "learning",
    note: "Context, goroutines y canales aplicados a servicios reales.",
  },
  {
    label: "Rust y ownership",
    status: "learning",
    note: "Modelo de memoria, Result y límites entre módulos.",
  },
  {
    label: "Cloudflare Workers",
    status: "learning",
    note: "APIs en el edge, caché y almacenamiento con KV y D1.",
  },
  {
    label: "Observabilidad",
    status: "planned",
    note: "Logs estructurados, métricas y trazas en servicios pequeños.",
  },
  {
    label: "Terraform",
    status: "planned",
    note: "Infraestructura declarativa y entornos reproducibles.",
  },
  {
    label: "Kubernetes",
    status: "planned",
    note: "Despliegues, recursos y diagnóstico de cargas de trabajo.",
  },
] as const satisfies readonly RoadmapItem[];
