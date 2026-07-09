import rss from '@astrojs/rss';
import { allPosts, postSlug } from '../lib/content';

export async function GET(context) {
  const posts = await allPosts();
  return rss({
    title: 'Tawanda Moyo',
    description:
      'Essays and notes on AI safety, compute governance, software, and the way — from Harare.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/${postSlug(post)}/`,
    })),
  });
}
