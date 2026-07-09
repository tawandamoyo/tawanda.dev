# tawanda.dev — The Clearing (Astro)

Redesign of tawanda.dev as an Astro site. One quiet page that keeps Central
Africa Time: the site's light follows the actual sun over southern Africa
(dawn / day / dusk / night), with a footer toggle to override.

## Run

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
```

## Structure

- `src/styles/global.css` — the design tokens (palette per sun phase, serif/mono type) and all styling.
- `src/layouts/Base.astro` — header, nav, footer, and the sun script.
- `src/content/posts/` — all 59 posts migrated from the Eleventy site (frontmatter untouched; URLs preserved via `urlPath`).
- `src/content/projects/` — projects migrated from the Eleventy site (URLs preserved as `/projects/<title-slug>/`).
- `src/lib/content.ts` — content queries. `HOME_ESSAY_IDS` is the editorial act: the list of "serious explorations" that surface on the homepage. Everything else appears only on `/writing/`.

## Notes

- `parly-watch` was **not** migrated — the old repo's migration PRD flags an
  unresolved political-risk/naming decision before it is published.
- The bookshelf's Kindle-clippings pipeline (`bookshelf.js` in the old repo)
  is not yet ported; `/bookshelf/` carries a static list until it is.
- Homepage "Now" and "Reading" sections are hand-edited in
  `src/pages/index.astro` / `now.astro` for the moment.
