# The reading shelf

How books get from the Kindle onto `/reading/`. Files starting with `_` are
ignored by the site and by the importer.

## Two kinds of file

- **Workbench** — `reading/workbench/<book>.md`. Private, gitignored. Every
  highlight and note for one Kindle book, each with a checkbox.
  `reading/workbench/_index.md` lists every book, most-highlighted first.
- **Book file** — `src/content/books/<book>.md` (this folder). Public,
  committed. What the site builds from.

Run `npm run reading` after changing a workbench file or plugging in the
Kindle. It reads clippings from, in order: a path argument,
`$KINDLE_CLIPPINGS`, a plugged-in Kindle (copied into `reading/` first), or
`reading/My Clippings.txt`, then brings both kinds of file up to date.

## Getting a book onto the site

A book has no public file until it is shelved. Any one of these shelves it:

- In its workbench file, change `shelve: false` to a status, e.g. `shelve: read`.
- Tick one of its highlights.
- Highlight it on the Kindle — anything highlighted in the last 60 days is
  shelved automatically.

After that, edit the book file, not the workbench.

## Status

Set `status:` in the book file.

| `status:`   | Shown as                                        |
|-------------|-------------------------------------------------|
| `reading`   | Reading now (also on the home and Now pages)    |
| `read`      | Read, grouped by year                           |
| `reference` | Kept close                                      |
| `abandoned` | Put down                                        |

"Reading now" shows at most three books: `pin: true` ones first, then other
`status: reading` books, then the most recently highlighted. To choose the
three, add `pin: true` under their `status: reading`.

With no status, a book is "reading now" only while it has been highlighted
in the last 60 days, counted from when the site is built. After that it
drops off the site, and the build prints a `[reading]` warning naming it.
Give a book a status when you finish it.

## Highlights

1. In the workbench, change `- [ ]` to `- [x]`.
2. Run `npm run reading`.

Ticked highlights are copied into the book file, and the book gets its own
page. Untick and re-run to remove one. To repair a truncated highlight, edit
its text in the book file — your edit is kept on later runs.

## Other fields in the book file

| Field                     | What it does                                                    |
|---------------------------|-----------------------------------------------------------------|
| `aside:`                  | One line in your voice, beside the title on the shelf            |
| `finished: 2026-09-20`    | Year group under Read; otherwise the last-highlight date is used |
| text below the `---`      | Notes; also gives the book its own page                          |
| `related: [post:slow-down]` | Links to a post or project (`project:<id>`); shows on both pages |
| `hidden: true`            | Keeps the file but takes the book off the site                   |
| `format: paper` / `audio` | For books not read on the Kindle                                 |

The importer owns `kindleTitles`, `highlightCount`, `firstHighlight` and
`lastHighlight`; everything else is yours and never overwritten.

## Special cases

- **Keep a book out of the repo entirely** — add part of its title as a line
  in `reading/skip.txt`.
- **Paper or audio books** — create the book file by hand with `title`,
  `author`, `status` and `format`. The importer leaves files without
  `kindleTitles` alone.
- **Two Kindle editions of one book** — add the other raw title to the
  keeper's `kindleTitles` and delete the duplicate file.
