import type { APIRoute } from 'astro';
import {
  everyPost,
  allProjects,
  postSlug,
  projectSlug,
  postKind,
} from '../../lib/content';
import { ogImage, type OgCard } from '../../lib/og';

/**
 * Per-page Open Graph cards, rendered at build time to
 * /og/site.png, /og/posts/<slug>.png and /og/projects/<slug>.png.
 * Wired up in Base.astro via the `ogImage` prop.
 */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longDate = (d: Date) =>
  `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

export async function getStaticPaths() {
  const [posts, projects] = await Promise.all([everyPost(), allProjects()]);

  const site = {
    params: { slug: 'site' },
    props: { title: 'Tawanda Moyo', kicker: 'Essays · notes · projects' },
  };

  const postCards = posts.map((post) => ({
    params: { slug: `posts/${postSlug(post)}` },
    props: {
      title: post.data.title,
      kicker: `${cap(postKind(post))} · ${longDate(post.data.date)}`,
    },
  }));

  const projectCards = projects.map((project) => ({
    params: { slug: `projects/${projectSlug(project)}` },
    props: {
      title: project.data.title,
      kicker: `Project · ${longDate(project.data.date)}`,
    },
  }));

  return [site, ...postCards, ...projectCards];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await ogImage(props as OgCard);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
