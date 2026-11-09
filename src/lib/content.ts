import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;

/** Slug for a post: explicit urlPath wins, filename otherwise (URLs preserved from the Eleventy site). */
export function postSlug(post: Post): string {
  return (post.data.urlPath ?? post.id).replace(/\/$/, '');
}

/**
 * Home-surface essays, in the order they appear — the serious explorations.
 * Curation is an editorial act: this list is the one place it happens, and
 * the order is editorial too, so it is a ranking rather than a filter.
 *
 * Featuring only. Classification lives in each post's `kind`, so removing an
 * entry here de-features it without silently demoting it to a note.
 */
const HOME_ESSAY_IDS = [
  'real-time-gradual-disempowerment',
  'ai-chatbot-insecure',
  'ecocash-app-ux-teardown',
  'observations-vibe-coding',
  'intelligent-agents',
];

export async function homeEssays(): Promise<Post[]> {
  const all = await getCollection('posts');
  return HOME_ESSAY_IDS
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p));
}

export async function allPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.archive);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Every post, archived included — pages stay up even when delisted. */
export async function everyPost(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function archivedPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => data.archive);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function allProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Shelves for the projects page, in the order they appear.
 * Client work last, deliberately — it is the trade that funds the rest.
 */
export const PROJECT_AREAS: {
  key: Project['data']['area'];
  label: string;
  note?: string;
  /** Closing line under the shelf — for shelves that read as a sequence rather than a list. */
  close?: string;
  /** Oldest first: the reading shelf is a progression, and progressions read forwards. */
  chronological?: boolean;
}[] = [
  { key: 'field', label: 'In the field' },
  { key: 'oss', label: 'Standards & open source' },
  {
    key: 'reading',
    label: 'Reading infrastructure · 2021–present',
    note: 'One corpus, five years: 14,257 highlights and notes from 299 books, 2019–2025.',
    close: 'Extraction → organisation → retrieval.',
    chronological: true,
  },
  { key: 'tools', label: 'Tools & experiments' },
  { key: 'client', label: 'Client work' },
];

export async function projectsByArea(): Promise<Map<string, Project[]>> {
  const all = await allProjects();
  const grouped = new Map<string, Project[]>();
  for (const area of PROJECT_AREAS) {
    const members = all.filter((p) => p.data.area === area.key);
    if (area.chronological) members.reverse();
    if (members.length > 0) grouped.set(area.key, members);
  }
  return grouped;
}

/** Same slugs the Eleventy site derived from project titles — URLs preserved. */
export function projectSlug(project: Project): string {
  if (project.data.urlPath) return project.data.urlPath.replace(/^\/|\/$/g, '');
  return project.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export type PostKind = 'essay' | 'fragment' | 'note';

/** Explicit form wins; migrated homepage essays retain their curated classification. */
export function postKind(post: Post): PostKind {
  return post.data.kind ?? (HOME_ESSAY_IDS.includes(post.id) ? 'essay' : 'note');
}

export function isEssay(post: Post): boolean {
  return postKind(post) === 'essay';
}

/** One-sentence summary for lists and meta tags; legacy posts used either key. */
export function postDescription(post: Post): string | undefined {
  const d = post.data.metaDescription ?? post.data.description;
  return typeof d === 'string' ? d : undefined;
}

/**
 * Meta description for search snippets. Hand-written wins; otherwise the
 * opening of the post itself, so no page falls back to the site-wide line
 * and search engines never see thirty pages claiming the same summary.
 */
export function postMetaDescription(post: Post): string {
  return postDescription(post) ?? excerpt(post.body ?? '');
}

/** Plain-text opening of a markdown body, cut at a word boundary near `max` chars. */
export function excerpt(markdown: string, max = 155): string {
  const text = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s—-]+$/, '')}…`;
}

/**
 * Resolves hand-curated "post:<id>" / "project:<id>" onward links to
 * href + title. Unresolved ids are dropped rather than thrown — a typo in
 * frontmatter shouldn't break the build.
 */
export async function resolveRelated(ids: string[]): Promise<{ href: string; title: string }[]> {
  if (ids.length === 0) return [];
  const [posts, projects] = await Promise.all([everyPost(), allProjects()]);
  const lookup = new Map<string, { href: string; title: string }>();
  for (const post of posts) lookup.set(`post:${post.id}`, { href: `/${postSlug(post)}/`, title: post.data.title });
  for (const project of projects) {
    lookup.set(`project:${project.id}`, { href: `/projects/${projectSlug(project)}/`, title: project.data.title });
  }
  return ids.map((id) => lookup.get(id)).filter((r): r is { href: string; title: string } => Boolean(r));
}
