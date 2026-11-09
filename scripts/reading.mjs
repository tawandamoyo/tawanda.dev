#!/usr/bin/env node
/**
 * Kindle → reading shelf.
 *
 *   npm run reading [-- path/to/My Clippings.txt]
 *
 * Reads the raw clippings (a path argument, $KINDLE_CLIPPINGS, a plugged-in Kindle,
 * or reading/My Clippings.txt, in that order)
 * and keeps two things in step:
 *
 *   reading/workbench/<slug>.md   PRIVATE, gitignored. Every highlight and note,
 *                                 one checkbox each. Tick a box to publish it.
 *   src/content/books/<slug>.md   PUBLIC, committed. What the site builds from:
 *                                 the human layer (status, aside, notes, related)
 *                                 plus only the highlights you ticked.
 *
 * The importer owns kindleTitles, highlightCount, firstHighlight and lastHighlight.
 * Everything else in a book file is yours and is never overwritten. Books with
 * no kindleTitles (paper, audio) are left alone entirely.
 *
 * To merge two Kindle editions into one book, add the other raw title to the
 * keeper's kindleTitles and delete the duplicate file. To keep a title out of
 * the repo altogether, add a line to reading/skip.txt (substring match).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRIVATE_DIR = path.join(ROOT, 'reading');
const WORKBENCH_DIR = path.join(PRIVATE_DIR, 'workbench');
const SKIP_FILE = path.join(PRIVATE_DIR, 'skip.txt');
const BOOKS_DIR = path.join(ROOT, 'src', 'content', 'books');

const STATS_FILE = path.join(ROOT, 'src', 'data', 'reading-stats.json');
const PRIVATE_COPY = path.join(PRIVATE_DIR, 'My Clippings.txt');

/** Where a plugged-in Kindle mounts, on Linux and macOS. */
const user = process.env.USER ?? '';
const KINDLE_MOUNTS = [
  `/media/${user}/Kindle/documents/My Clippings.txt`,
  `/run/media/${user}/Kindle/documents/My Clippings.txt`,
  '/Volumes/Kindle/documents/My Clippings.txt',
];

/** An explicit path wins; then a plugged-in Kindle (copied into reading/ first); then the private copy. */
function findClippings() {
  const explicit = process.argv[2] ?? process.env.KINDLE_CLIPPINGS;
  if (explicit) return path.resolve(explicit);
  const device = KINDLE_MOUNTS.find((p) => fs.existsSync(p));
  if (device) {
    fs.mkdirSync(PRIVATE_DIR, { recursive: true });
    fs.copyFileSync(device, PRIVATE_COPY);
    console.log(`Copied clippings from the Kindle at ${path.dirname(path.dirname(device))}.`);
  }
  return PRIVATE_COPY;
}

const clippingsPath = findClippings();

// ── parsing ────────────────────────────────────────────────────────────────

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** Kindle writes local time in the device's locale; both English layouts are handled. */
function parseAdded(s) {
  let m = s.match(/(\d{1,2}) (\w+) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})/); // 6 November 2019 13:36:03
  if (m) return stamp(m[3], m[2], m[1], +m[4], m[5], m[6]);
  m = s.match(/(\w+) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ?(AM|PM)/i); // February 3, 2026 7:59:46 PM
  if (m) {
    let h = +m[4] % 12;
    if (m[7].toUpperCase() === 'PM') h += 12;
    return stamp(m[3], m[1], m[2], h, m[5], m[6]);
  }
  return null;
}

function stamp(y, monthName, d, h, mi, s) {
  const mo = MONTHS.indexOf(monthName.toLowerCase());
  if (mo < 0) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${y}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${mi}:${s}`;
}

/** "location 4481-4483" wins over "page 38-38"; both give a numeric range for overlap checks. */
function parsePosition(meta) {
  const loc = meta.match(/location (\d+)(?:-(\d+))?/i);
  if (loc) return { label: `loc ${loc[1]}`, start: +loc[1], end: +(loc[2] ?? loc[1]) };
  const page = meta.match(/page (\d+)(?:-(\d+))?/i);
  if (page) return { label: `p. ${page[1]}`, start: +page[1], end: +(page[2] ?? page[1]) };
  return { label: '', start: 0, end: 0 };
}

function parseClippings(raw) {
  const entries = [];
  for (const block of raw.split('==========')) {
    const lines = block.replace(/﻿/g, '').split(/\r?\n/).map((l) => l.trim());
    while (lines.length && !lines[0]) lines.shift();
    if (lines.length < 2) continue;
    const [rawTitle, meta, ...rest] = lines;
    const kind = meta.match(/^- Your (Highlight|Note|Bookmark)/i)?.[1]?.toLowerCase();
    const added = parseAdded(meta.match(/Added on (.+)$/)?.[1] ?? '');
    if (!kind || kind === 'bookmark' || !added) continue;
    const text = rest.filter(Boolean).join(' ').trim();
    if (!text || /clipping limit/i.test(text)) continue;
    entries.push({ rawTitle: rawTitle.trim(), kind, added, text, ...parsePosition(meta) });
  }
  return entries;
}

// ── titles & authors ───────────────────────────────────────────────────────

function cleanAuthor(raw) {
  const names = raw
    .split(';')
    .map((n) => n.trim().replace(/\s*\([^)]*\)\s*/g, ' ').trim())
    .filter(Boolean)
    .map((n) => {
      const m = n.match(/^([^,]+),\s*([^,]+?)\.?$/); // "Taleb, Nassim Nicholas"
      return m && !/\d/.test(n) ? `${m[2]} ${m[1]}` : n.replace(/,$/, '');
    });
  const unique = [...new Set(names)];
  if (unique.length === 0) return undefined;
  return unique.length > 2 ? `${unique[0]} et al.` : unique.join(' & ');
}

/** "Antifragile: Things that Gain from Disorder (Taleb, Nassim Nicholas)" → title, subtitle, author. */
function splitRawTitle(rawTitle) {
  let t = rawTitle;
  let author;
  // The author is the last balanced parenthetical at the very end.
  if (t.endsWith(')')) {
    let depth = 0;
    for (let i = t.length - 1; i >= 0; i--) {
      if (t[i] === ')') depth++;
      else if (t[i] === '(' && --depth === 0) {
        author = cleanAuthor(t.slice(i + 1, -1));
        t = t.slice(0, i).trim();
        break;
      }
    }
  }
  t = t
    .replace(/\((z-lib\.org|\d{9,13}|[^)]*classics?[^)]*|a touchstone book|plus|illustrated)\)/gi, '')
    .replace(/\[annotated\]/gi, '')
    .replace(/_ /g, ': ')
    .replace(/\s+/g, ' ')
    .trim();
  const [title, ...sub] = t.split(/:\s+/);
  return { title: title.trim(), subtitle: sub.join(': ').trim() || undefined, author };
}

const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

// ── grouping & dedupe ──────────────────────────────────────────────────────

const overlaps = (a, b) => a.start <= b.end && b.start <= a.end;

/**
 * Adjusting a highlight on the Kindle appends a second entry rather than
 * editing the first. Keep the latest version of anything that overlaps and
 * contains (or is contained by) an earlier one.
 */
function dedupe(highlights) {
  const kept = [];
  for (const h of [...highlights].sort((a, b) => a.added.localeCompare(b.added))) {
    const i = kept.findIndex(
      (k) => overlaps(k, h) && (k.text.includes(h.text) || h.text.includes(k.text)),
    );
    if (i >= 0) kept[i] = h;
    else kept.push(h);
  }
  return kept.sort((a, b) => a.start - b.start || a.added.localeCompare(b.added));
}

/** Stable across runs: book + position, with a counter for the rare shared start. */
function assignIds(rawTitleKey, highlights) {
  const seen = new Map();
  for (const h of highlights) {
    const base = `${rawTitleKey}|${h.label}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    h.id = crypto.createHash('sha1').update(`${base}|${n}`).digest('hex').slice(0, 8);
  }
}

function attachNotes(highlights, notes) {
  const orphans = [];
  for (const note of notes) {
    const target =
      highlights.find((h) => h.end === note.start) ?? highlights.find((h) => h.start <= note.start && note.start <= h.end);
    if (target) target.note = target.note ? `${target.note} / ${note.text}` : note.text;
    else orphans.push(note);
  }
  return orphans;
}

// ── frontmatter files ──────────────────────────────────────────────────────

function readMd(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  return { data: yaml.load(m[1]) ?? {}, body: m[2] };
}

const isoDay = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);

/** Human fields first, importer fields after, unknown keys preserved at the end. */
const KEY_ORDER = [
  'title', 'subtitle', 'author', 'status', 'pin', 'finished', 'aside', 'format', 'hidden', 'related',
  'kindleTitles', 'highlightCount', 'firstHighlight', 'lastHighlight', 'highlights',
];

function writeMd(file, data, body) {
  const ordered = {};
  for (const k of [...KEY_ORDER, ...Object.keys(data)]) {
    const v = data[k];
    if (v === undefined || k in ordered) continue;
    if (Array.isArray(v) && v.length === 0 && k !== 'kindleTitles') continue;
    ordered[k] = Array.isArray(v) ? v.map(isoDay) : isoDay(v);
  }
  const front = yaml
    .dump(ordered, { lineWidth: -1, noRefs: true })
    .replace(/^(\w+): '(\d{4}-\d{2}-\d{2})'$/gm, '$1: $2');
  const out = `---\n${front}---\n${body ? `\n${body.replace(/^\n+/, '')}` : ''}`;
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== out) {
    fs.writeFileSync(file, out);
    return true;
  }
  return false;
}

/** Ticks and the shelve flag from an existing workbench file; ticks are null when there is none yet. */
function readWorkbench(file) {
  if (!fs.existsSync(file)) return { ticks: null, shelve: undefined };
  const src = fs.readFileSync(file, 'utf8');
  const ticks = new Set();
  for (const line of src.split('\n')) {
    const m = line.match(/^- \[[xX]\] .*<!-- h:([0-9a-f]{8})/);
    if (m) ticks.add(m[1]);
  }
  const shelve = src.match(/^shelve:\s*([a-z]+)/m)?.[1];
  return { ticks, shelve: shelve && shelve !== 'false' ? shelve : undefined };
}

function writeWorkbench(file, slug, meta, highlights, orphans, ticks, shelvedStatus) {
  const lines = [
    '---',
    yaml.dump({ book: slug, title: meta.title, author: meta.author }, { lineWidth: -1 }).trim(),
    shelvedStatus === undefined
      ? 'shelve: false   # true, or a status: reading | read | abandoned | reference'
      : `shelved: ${shelvedStatus || 'yes, no status yet'}   # edit src/content/books/${slug}.md`,
    '---',
    '',
    `# ${meta.title}${meta.author ? ` — ${meta.author}` : ''}`,
    '',
    `${highlights.length} highlights, ${meta.first} → ${meta.last}. Private: this folder is gitignored.`,
    'Tick [x] to publish a highlight (this also shelves the book), then run `npm run reading`.',
    '',
  ];
  for (const h of highlights) {
    lines.push(`- [${ticks.has(h.id) ? 'x' : ' '}] ${h.text} <!-- h:${h.id} · ${h.label} · ${h.added.slice(0, 10)} -->`);
    if (h.note) lines.push(`    - note: ${h.note}`);
  }
  if (orphans.length) {
    lines.push('', '## Notes without a highlight', '');
    for (const n of orphans) lines.push(`- ${n.text} <!-- ${n.label} · ${n.added.slice(0, 10)} -->`);
  }
  fs.writeFileSync(file, `${lines.join('\n')}\n`);
}

function writeIfChanged(file, content) {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) fs.writeFileSync(file, content);
}

// ── main ───────────────────────────────────────────────────────────────────

if (!fs.existsSync(clippingsPath)) {
  console.error(`No clippings at ${path.relative(ROOT, clippingsPath)}.`);
  console.error('Copy "My Clippings.txt" from the Kindle (documents/) into reading/, or pass a path.');
  process.exit(1);
}

fs.mkdirSync(WORKBENCH_DIR, { recursive: true });
fs.mkdirSync(BOOKS_DIR, { recursive: true });

const skips = fs.existsSync(SKIP_FILE)
  ? fs.readFileSync(SKIP_FILE, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  : [];
const skipped = (rawTitle) => skips.some((s) => rawTitle.toLowerCase().includes(s.toLowerCase()));

// Existing book files, and which raw Kindle titles each one claims.
const books = new Map(); // slug → { data, body }
const claimed = new Map(); // rawTitle → slug
for (const f of fs.readdirSync(BOOKS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
  const slug = f.replace(/\.md$/, '');
  const md = readMd(path.join(BOOKS_DIR, f));
  books.set(slug, md);
  for (const t of md.data.kindleTitles ?? []) claimed.set(t, slug);
}

// Group raw entries by the book file they belong to.
const entries = parseClippings(fs.readFileSync(clippingsPath, 'utf8'));
const groups = new Map(); // slug → { rawTitles:Set, entries:[] }
const takenThisRun = new Map(); // slug → rawTitle that took it
for (const e of entries) {
  if (skipped(e.rawTitle)) continue;
  let slug = claimed.get(e.rawTitle);
  if (!slug) {
    const { title, author } = splitRawTitle(e.rawTitle);
    const candidates = [slugify(title), slugify(`${title} ${author?.split(/\s|&/).filter(Boolean).at(-1) ?? ''}`)];
    slug = candidates.find((c) => c && !books.has(c) && (!takenThisRun.has(c) || takenThisRun.get(c) === e.rawTitle));
    for (let n = 2; !slug; n++) {
      const c = `${candidates[0]}-${n}`;
      if (!books.has(c) && (!takenThisRun.has(c) || takenThisRun.get(c) === e.rawTitle)) slug = c;
    }
    takenThisRun.set(slug, e.rawTitle);
    claimed.set(e.rawTitle, slug);
  }
  if (!groups.has(slug)) groups.set(slug, { rawTitles: new Set(), entries: [] });
  groups.get(slug).rawTitles.add(e.rawTitle);
  groups.get(slug).entries.push(e);
}

/** Books highlighted this recently are shelved automatically, so "reading now" stays live. */
const RECENT_DAYS = 60;
const daysAgo = (day) => (Date.now() - new Date(`${day}T00:00:00Z`).getTime()) / 86_400_000;

let created = 0;
let updated = 0;
let published = 0;
const index = [];
let totalHighlights = 0;
let totalNotes = 0;
for (const [slug, group] of groups) {
  const rawTitles = [...group.rawTitles];
  const highlights = [];
  for (const raw of rawTitles) {
    const own = dedupe(group.entries.filter((e) => e.rawTitle === raw && e.kind === 'highlight'));
    assignIds(raw, own);
    highlights.push(...own);
  }
  const orphans = attachNotes(highlights, group.entries.filter((e) => e.kind === 'note'));
  const dates = group.entries.map((e) => e.added.slice(0, 10)).sort();
  totalHighlights += highlights.length;
  totalNotes += group.entries.filter((e) => e.kind === 'note').length;

  const existing = books.get(slug);
  const data = existing ? { ...existing.data } : { ...splitRawTitle(rawTitles[0]) };
  const body = existing?.body ?? '';
  const wbFile = path.join(WORKBENCH_DIR, `${slug}.md`);
  const wbMeta = { title: data.title, author: data.author, first: dates[0], last: dates.at(-1) };

  // Workbench ticks are the truth once a workbench exists; before that, the repo is.
  const prior = new Map((data.highlights ?? []).map((h) => [h.id, h]));
  const wb = readWorkbench(wbFile);
  const ticks = wb.ticks ?? new Set(prior.keys());

  // The repo is public: a book gets a committed file only once you shelve it.
  const shelve = existing || ticks.size > 0 || wb.shelve || daysAgo(dates.at(-1)) <= RECENT_DAYS;
  index.push({ slug, ...wbMeta, count: highlights.length, shelved: Boolean(shelve), status: data.status });
  if (!shelve) {
    writeWorkbench(wbFile, slug, wbMeta, highlights, orphans, ticks, undefined);
    continue;
  }
  if (!existing && wb.shelve && wb.shelve !== 'true') data.status = wb.shelve;
  index.at(-1).status = data.status;

  data.kindleTitles = [...new Set([...(data.kindleTitles ?? []), ...rawTitles])];
  data.highlightCount = highlights.length;
  data.firstHighlight = dates[0];
  data.lastHighlight = dates.at(-1);
  // A highlight you have edited in the book file (say, to repair a truncation) keeps your text.
  // Entries you added by hand (ids the Kindle never produced) are always kept.
  const known = new Set(highlights.map((h) => h.id));
  data.highlights = [
    ...highlights.filter((h) => ticks.has(h.id)).map((h) => prior.get(h.id) ?? { id: h.id, loc: h.label, text: h.text }),
    ...[...prior.values()].filter((h) => !known.has(h.id)),
  ];
  published += data.highlights.length;

  writeWorkbench(wbFile, slug, wbMeta, highlights, orphans, ticks, data.status ?? '');
  const changed = writeMd(path.join(BOOKS_DIR, `${slug}.md`), data, body);
  if (!existing) created++;
  else if (changed) updated++;
}

index.sort((a, b) => b.count - a.count);
fs.writeFileSync(
  path.join(WORKBENCH_DIR, '_index.md'),
  [
    '# Kindle library',
    '',
    'Every book in the clippings, most highlighted first. Private: this folder is gitignored.',
    'Set `shelve:` in a book\'s file (or tick a highlight) to give it a page on the site.',
    '',
    ...index.map(
      (b) =>
        `- ${b.shelved ? `**[${b.title}](${b.slug}.md)** · ${b.status ?? 'shelved'}` : `[${b.title}](${b.slug}.md)`}` +
        `${b.author ? ` — ${b.author}` : ''} · ${b.count} · ${b.first.slice(0, 4)}–${b.last.slice(0, 4)}`,
    ),
    '',
  ].join('\n'),
);

// Totals only — no titles — so pages can quote the size of the archive without going stale.
const allDays = entries.filter((e) => !skipped(e.rawTitle)).map((e) => e.added.slice(0, 10)).sort();
fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
writeIfChanged(
  STATS_FILE,
  `${JSON.stringify({ books: groups.size, highlights: totalHighlights, notes: totalNotes, first: allDays[0], last: allDays.at(-1) }, null, 2)}\n`,
);

const shelvedCount = index.filter((b) => b.shelved).length;
console.log(`${entries.length} clippings → ${groups.size} books; ${shelvedCount} shelved (${created} new, ${updated} updated), ${published} highlights public.`);
console.log('Browse the rest in reading/workbench/_index.md.');
