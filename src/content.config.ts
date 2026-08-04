import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),
  // `image()` resolves paths relative to the markdown file and returns
  // ImageMetadata, so components can hand it straight to <Image />.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      featured: z.boolean(),
      type: z.string(),
      created: z.union([z.string(), z.date()]).optional(),
      domains: z.array(z.string()).optional(),
      stack: z.array(z.string()).optional(),
      category: z.string(),
      tags: z.array(z.string()),
      image: image(),
      hoverImage: image(),
      // Detail-page hero. Falls back to `image` when omitted.
      thumbnail: image().optional(),
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
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/about',
  }),
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    profileImage: z.string().optional(),
    gifImage: z.string().optional(),
    // Condensed version for the homepage block. The /about page renders the
    // markdown body instead, so the two stay independent.
    homepage: z
      .object({
        label: z.string().optional(),
        heading: z.string(),
        body: z.array(z.string()),
      })
      .optional(),
    // Intro block shown beside the profile photo on /about, above the body.
    // `currentLink.label` must appear verbatim inside `current` — the component
    // splits on it to turn that phrase into a link.
    intro: z
      .object({
        greeting: z.string(),
        summary: z.string(),
        current: z.string().optional(),
        currentLink: z
          .object({
            label: z.string(),
            href: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
});

const intro = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/intro',
  }),
  schema: z.object({
    title: z.string().optional(),
    greeting: z.string().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
    intro: z.string().optional(),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),

    // Homepage "Technical Focus" pillars. Rendered in order, numbered 01..n.
    focus: z
      .array(
        z.object({
          title: z.string(),
          items: z.array(z.string()),
        }),
      )
      .optional(),
    // Homepage closing call-to-action.
    contact: z
      .object({
        headline: z.string(),
        subline: z.string().optional(),
        email: z.string(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        resume: z.string().optional(),
      })
      .optional(),

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
