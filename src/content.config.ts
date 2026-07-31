import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Lenient by design: legacy posts migrate without holding the build hostage.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      urlPath: z.string().optional(),
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      archive: z.boolean().default(false),
      // Editorial form controls classification and article presentation.
      // Optional so migrated posts can fall back to the existing curation.
      kind: z.enum(['essay', 'fragment', 'note']).optional(),
      aside: z.string().optional(),
      revisions: z.number().optional(),
      // Hand-curated onward links, "post:<id>" or "project:<id>" — see resolveRelated.
      related: z.array(z.string()).optional(),
    })
    .passthrough(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      tags: z.array(z.string()).default([]),
      emoji: z.string().optional(),
      // Which shelf of the projects page this sits on.
      area: z.enum(['field', 'oss', 'reading', 'client', 'tools']).default('tools'),
      // 'live' gets the green dot; other states stay quiet.
      status: z.enum(['live', 'ongoing', 'coming', 'done']).default('done'),
      // Where the thing itself lives, when it is public.
      link: z.string().url().optional(),
      // Overrides the title-derived slug when a title change must not move the URL.
      urlPath: z.string().optional(),
      // Hand-curated onward links, "post:<id>" or "project:<id>" — see resolveRelated.
      related: z.array(z.string()).optional(),
    })
    .passthrough(),
});

export const collections = { posts, projects };
