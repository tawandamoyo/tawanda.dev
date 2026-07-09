import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tawanda.dev',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
