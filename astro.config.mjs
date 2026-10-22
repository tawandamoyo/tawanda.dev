import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

/**
 * Last-modified dates for the sitemap, read straight from post frontmatter
 * (`updated` wins over `date`). Content collections aren't available in the
 * config, and a regex over a few dozen small files is cheaper than a parser.
 */
function postDates() {
  const dir = './src/content/posts';
  const dates = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const fm = readFileSync(`${dir}/${file}`, 'utf8').split(/^---$/m)[1] ?? '';
    const field = (k) => fm.match(new RegExp(`^${k}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1]?.trim();
    const slug = (field('urlPath') ?? file.replace(/\.md$/, '')).replace(/^\/|\/$/g, '');
    const when = new Date(field('updated') ?? field('date'));
    if (!Number.isNaN(when.getTime())) dates.set(`https://tawanda.dev/${slug}/`, when);
  }
  return dates;
}
const lastmod = postDates();

export default defineConfig({
  site: 'https://tawanda.dev',
  trailingSlash: 'ignore',
  // ~12 KB of CSS: inlining saves a render-blocking round trip on every first visit.
  build: { inlineStylesheets: 'always' },
  // Self-hosted Latin subsets with metric-matched fallbacks: the same type on
  // every device, no third-party request, and no layout shift when it swaps in.
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Source Serif 4',
        cssVariable: '--font-serif',
        weights: [400, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
        fallbacks: ['Georgia', 'serif'],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'JetBrains Mono',
        cssVariable: '--font-mono',
        weights: [400],
        styles: ['normal'],
        subsets: ['latin'],
        fallbacks: ['monospace'],
      },
    ],
  },
  integrations: [
    sitemap({
      serialize(item) {
        const when = lastmod.get(item.url);
        if (when) item.lastmod = when.toISOString();
        return item;
      },
    }),
  ],
});
