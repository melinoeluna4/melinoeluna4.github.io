import type { ProjectStatus } from "./content-types";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  in_progress: "In Progress",
  completed: "Completed",
};

export const projectStatusIcons: Record<ProjectStatus, string> = {
  in_progress: "◷",
  completed: "✓",
};
