import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string().optional(),
    featured: z.boolean(),
    type: z.string(),
    created: z.union([z.string(), z.date()]).optional(),
    domains: z.array(z.string()).optional(),
    stack: z.array(z.string()).optional(),
    category: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    hoverImage: z.string().optional(),
    info: z.string(),
    description: z.string(),
    //project details
    role: z.string(),
    timeline: z.string(),
    completed: z.string(),
    credit: z.string(),
    creditLink: z.string().optional(),
    tools: z.array(z.string()),
    focus: z.array(z.string()),
    activities: z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    profileImage: z.string().optional(),
    gifImage: z.string().optional(),
  }),
});

const intro = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    greeting: z.string().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
    intro: z.string().optional(),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),

    previously: z
      .array(
        z.object({
          company: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    studies: z
      .object({
        institution: z.string(),
        url: z.string(),
      })
      .optional(),
  }),
});

export const collections = { projects, about, intro };
