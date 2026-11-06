export type ProjectStatus = "in_progress" | "completed";

export type RoadmapStatus = "done" | "learning" | "planned";

export type SkillLevel = "advanced" | "intermediate" | "learning";

export interface ProjectView {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly status: ProjectStatus;
  readonly featured: boolean;
  readonly repoUrl?: string | undefined;
  readonly demoUrl?: string | undefined;
  readonly startDate?: Date | undefined;
  readonly endDate?: Date | undefined;
  readonly order?: number | undefined;
}

export interface PostView {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly pubDate: Date;
  readonly updatedDate?: Date | undefined;
  readonly tags: readonly string[];
  readonly draft: boolean;
}

export interface TagCount {
  readonly name: string;
  readonly slug: string;
  readonly count: number;
}
