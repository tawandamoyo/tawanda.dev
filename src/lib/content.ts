import { getCollection, type CollectionEntry } from 'astro:content';
import stats from '../data/reading-stats.json';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;
export type Book = CollectionEntry<'books'>;

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

/** Size of the Kindle archive, written by `npm run reading` — totals only, no titles. */
export const readingStats = {
  ...stats,
  firstYear: Number(stats.first.slice(0, 4)),
  lastYear: Number(stats.last.slice(0, 4)),
};

/** 12085 → "12,085". */
export const num = (n: number) => n.toLocaleString('en-GB');

/**
 * Shelves for the projects page, in the order they appear.
 * Client work last, deliberately — it is the trade that funds the rest.
 */
export const PROJECT_AREAS: {
  key: Project['data']['area'];
  label: string;
  note?: string;
  /** Oldest first: the reading shelf is a progression, and progressions read forwards. */
  chronological?: boolean;
}[] = [
  { key: 'field', label: 'In the field' },
  { key: 'oss', label: 'Standards & open source' },
  {
    key: 'reading',
    label: `Reading infrastructure · ${readingStats.firstYear}–present`,
    note: `${num(readingStats.highlights + readingStats.notes)} highlights and notes from ${readingStats.books} books, ${readingStats.firstYear}–${readingStats.lastYear}.`,
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
 * Resolves hand-curated "post:<id>" / "project:<id>" / "book:<id>" onward links to
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
  for (const book of await getCollection('books')) {
    if (hasBookPage(book)) lookup.set(`book:${book.id}`, { href: `/reading/${book.id}/`, title: book.data.title });
  }
  return ids.map((id) => lookup.get(id)).filter((r): r is { href: string; title: string } => Boolean(r));
}

// ── Reading ────────────────────────────────────────────────────────────────

/** A Kindle book highlighted this recently counts as being read, status or not. */
const READING_WINDOW_DAYS = 60;

/** "Reading now" stays short: pinned books, then marked ones, then the most recently highlighted. */
const READING_NOW_MAX = 3;

export type Shelf = 'reading' | 'reference' | 'read' | 'abandoned';

/** Explicit status wins; otherwise recent highlights mean "reading now"; otherwise off the shelf. */
export function bookShelf(book: Book): Shelf | undefined {
  if (book.data.hidden) return undefined;
  if (book.data.status) return book.data.status;
  const last = book.data.lastHighlight;
  if (last && Date.now() - last.getTime() < READING_WINDOW_DAYS * 86_400_000) return 'reading';
  return undefined;
}

/** A book earns its own page only when there is something of mine on it: notes or chosen highlights. */
export function hasBookPage(book: Book): boolean {
  return !book.data.hidden && (Boolean(book.body?.trim()) || book.data.highlights.length > 0);
}

/** The year a book belongs to on the shelf: when finished, or failing that, when last highlighted. */
export function bookYear(book: Book): number | undefined {
  return (book.data.finished ?? book.data.lastHighlight)?.getFullYear();
}

/** Most recent first: finished date, then last highlight. */
function bookRecency(book: Book): number {
  return (book.data.finished ?? book.data.lastHighlight)?.getTime() ?? 0;
}

let warnedStale = false;

export async function shelvedBooks(): Promise<Map<Shelf, Book[]>> {
  const all = await getCollection('books');
  // A book with no status is only on the shelf while it is being highlighted.
  // Once that window passes it drops off the site, so say which ones need a status.
  if (!warnedStale) {
    warnedStale = true;
    const stale = all.filter((b) => !b.data.hidden && !b.data.status && b.data.lastHighlight && !bookShelf(b));
    if (stale.length > 0) {
      console.warn(
        `[reading] ${stale.length} book(s) left "reading now" and are off the shelf until given a status ` +
          `(read | reference | abandoned | reading) in src/content/books/: ${stale.map((b) => b.id).join(', ')}`,
      );
    }
  }
  const shelves = new Map<Shelf, Book[]>();
  for (const book of all.sort((a, b) => bookRecency(b) - bookRecency(a))) {
    const shelf = bookShelf(book);
    if (!shelf) continue;
    if (!shelves.has(shelf)) shelves.set(shelf, []);
    shelves.get(shelf)!.push(book);
  }
  // Books I have marked as reading lead; ones inferred from recent highlights follow.
  const reading = shelves.get('reading');
  if (reading) {
    const rank = (b: Book) => (b.data.pin ? 2 : 0) + (b.data.status ? 1 : 0);
    reading.sort((a, b) => rank(b) - rank(a));
    shelves.set('reading', reading.slice(0, READING_NOW_MAX));
  }
  return shelves;
}

/** "2019–2021", or one year when it all happened in one. */
export function highlightSpan(book: Book): string | undefined {
  const { firstHighlight: a, lastHighlight: b } = book.data;
  if (!a || !b) return undefined;
  return a.getFullYear() === b.getFullYear() ? `${a.getFullYear()}` : `${a.getFullYear()}–${b.getFullYear()}`;
}

/**
 * Everything that points at a book with "book:<id>", plus what the book points
 * at itself — so a link only has to be written down on one side.
 */
export async function bookLinks(book: Book): Promise<{ href: string; title: string }[]> {
  const key = `book:${book.id}`;
  const [posts, projects] = await Promise.all([everyPost(), allProjects()]);
  const inbound = [
    ...posts.filter((p) => p.data.related?.includes(key)).map((p) => `post:${p.id}`),
    ...projects.filter((p) => p.data.related?.includes(key)).map((p) => `project:${p.id}`),
  ];
  const links = await resolveRelated([...new Set([...(book.data.related ?? []), ...inbound])]);
  return links;
}

/** Book pages that list `key` (e.g. "post:<id>") in their related links. */
export async function booksLinkingTo(key: string): Promise<{ href: string; title: string }[]> {
  const books = await getCollection('books', (b) => hasBookPage(b) && Boolean(b.data.related?.includes(key)));
  return books.map((b) => ({ href: `/reading/${b.id}/`, title: b.data.title }));
}

/** Merge link lists, first occurrence of each href wins. */
export function mergeLinks(...lists: { href: string; title: string }[][]): { href: string; title: string }[] {
  const seen = new Set<string>();
  return lists.flat().filter((l) => !seen.has(l.href) && Boolean(seen.add(l.href)));
}
