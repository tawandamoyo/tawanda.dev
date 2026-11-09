import rss from '@astrojs/rss';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { allPosts, postSlug, postMetaDescription } from '../lib/content';

/**
 * Full-text feed: each item carries the whole post as rendered on the site,
 * so it reads in full wherever it's syndicated. Root-relative links and
 * image paths are made absolute — feed readers have no base URL to resolve them.
 */

const absolutize = (html, site) =>
  html
    .replace(/(href|src)="\/(?!\/)/g, `$1="${site}`)
    .replace(/srcset="([^"]*)"/g, (_, set) =>
      `srcset="${set.replace(/(^|,\s*)\/(?!\/)/g, `$1${site}`)}"`,
    );

export async function GET(context) {
  const site = new URL('/', context.site).href;
  const container = await AstroContainer.create();
  const posts = await allPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: postMetaDescription(post),
        content: absolutize(html, site),
        pubDate: post.data.date,
        link: `/${postSlug(post)}/`,
        categories: [...new Set([...post.data.categories, ...post.data.tags])],
      };
    }),
  );

  return rss({
    title: 'Tawanda Moyo',
    description:
      'Essays and notes on AI safety, compute governance, and software, from Harare.',
    site: context.site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      '<language>en</language>',
      `<atom:link href="${site}feed.xml" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items,
  });
}
