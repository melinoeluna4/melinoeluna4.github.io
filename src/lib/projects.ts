import { getCollection } from "astro:content";
import type { ProjectView } from "./content-types";

function assertUniqueSlugs(collection: string, projects: readonly ProjectView[]): void {
  const seen = new Set<string>();

  for (const project of projects) {
    if (seen.has(project.slug)) {
      throw new Error(`Duplicate slug "${project.slug}" in the ${collection} collection`);
    }

    seen.add(project.slug);
  }
}

function compareProjects(left: ProjectView, right: ProjectView): number {
  const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.order ?? Number.POSITIVE_INFINITY;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const leftStart = left.startDate?.getTime() ?? 0;
  const rightStart = right.startDate?.getTime() ?? 0;

  if (leftStart !== rightStart) {
    return rightStart - leftStart;
  }

  return left.title.localeCompare(right.title, "es");
}

export async function getProjects(): Promise<ProjectView[]> {
  const entries = await getCollection("projects");

  const projects = entries.map(
    (entry): ProjectView => ({
      id: entry.id,
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      tags: [...entry.data.tags],
      status: entry.data.status,
      featured: entry.data.featured,
      repoUrl: entry.data.repoUrl,
      demoUrl: entry.data.demoUrl,
      startDate: entry.data.startDate,
      endDate: entry.data.endDate,
      order: entry.data.order,
    }),
  );

  assertUniqueSlugs("projects", projects);

  return projects.sort(compareProjects);
}

export async function getFeaturedProjects(limit = 4): Promise<ProjectView[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured).slice(0, limit);
}

export async function getProjectCount(): Promise<number> {
  const entries = await getCollection("projects");
  return entries.length;
}
