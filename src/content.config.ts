import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Lenient by design: legacy posts migrate without holding the build hostage.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      // Last substantive revision — feeds dateModified and the sitemap.
      updated: z.coerce.date().optional(),
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

// One file per shelved book. Kindle books are written by `npm run reading`
// (scripts/reading.mjs), which owns only the kindle* and highlight-count/date
// fields; paper and audio books are written by hand. See reading/ (private).
const books = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    author: z.string().optional(),
    // No status = off the shelf, unless highlighted recently (then: reading now).
    // reference = kept close and returned to, rather than read through once.
    status: z.enum(['reading', 'read', 'abandoned', 'reference']).optional(),
    finished: z.coerce.date().optional(),
    // Pinned books lead "reading now", ahead of whatever was highlighted last.
    pin: z.boolean().default(false),
    // One line in my voice, shown beside the title on the shelf.
    aside: z.string().optional(),
    format: z.enum(['kindle', 'paper', 'audio']).optional(),
    hidden: z.boolean().default(false),
    related: z.array(z.string()).optional(),
    kindleTitles: z.array(z.string()).default([]),
    highlightCount: z.number().default(0),
    firstHighlight: z.coerce.date().optional(),
    lastHighlight: z.coerce.date().optional(),
    // Only the highlights ticked for publication — never the whole set.
    highlights: z
      .array(z.object({ id: z.string(), loc: z.string().optional(), text: z.string() }))
      .default([]),
  }),
});

export const collections = { posts, projects, books };
