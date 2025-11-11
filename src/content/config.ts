import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    order: z.number(),
    category: z.string(),
    image: z.string(),
    hoverImage: z.string().optional(),
    info: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    //optional
    type: z.string().optional(),
    date: z.date().optional(),
    role: z.string().optional(),
    timeline: z.string().optional(),
    completed: z.string().optional(),
    credit: z.string().optional(),
    creditLink: z.string().optional(),
    tools: z.array(z.string()).optional(),
    activities: (z.string()).optional(),
  }),
});

export const collections = { projects };
