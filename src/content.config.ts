import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    status: z.enum(["in_progress", "completed"]),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    featured: z.boolean().default(false),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    order: z.number().int().nonnegative().optional(),
  })
  .superRefine((project, context) => {
    if (project.status === "completed" && !project.endDate) {
      context.addIssue({
        code: "custom",
        message: "endDate is required when status is completed",
        path: ["endDate"],
      });
    }

    if (project.startDate && project.endDate && project.endDate < project.startDate) {
      context.addIssue({
        code: "custom",
        message: "endDate must be on or after startDate",
        path: ["endDate"],
      });
    }
  });

const postSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().trim().min(1)).min(1),
    draft: z.boolean().default(false),
  })
  .superRefine((post, context) => {
    if (post.updatedDate && post.updatedDate < post.pubDate) {
      context.addIssue({
        code: "custom",
        message: "updatedDate must be on or after pubDate",
        path: ["updatedDate"],
      });
    }
  });

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: projectSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: postSchema,
});

export const collections = { projects, blog };
