/**
 * schema.org structured data, as one connected graph. Every page carries the
 * WebSite node; pages add their own nodes and point at the Person by @id
 * rather than restating him, so search engines resolve one entity — this
 * one, not the many other Tawanda Moyos — as the author of everything here.
 */

export const SITE = 'https://tawanda.dev';
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;

export type Node = Record<string, unknown>;

/** The full Person node — emitted on the homepage and About page only. */
export const person: Node = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Tawanda Moyo',
  url: `${SITE}/`,
  jobTitle: 'Software Engineer & Technical Writer',
  description:
    'Software engineer and technical writer in Harare working on AI safety — compute governance, evaluations, and forecasting. Maintainer of the Africa Compute Tracker.',
  homeLocation: { '@type': 'Place', name: 'Harare, Zimbabwe' },
  address: { '@type': 'PostalAddress', addressLocality: 'Harare', addressCountry: 'ZW' },
  nationality: { '@type': 'Country', name: 'Zimbabwe' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Harare Institute of Technology' },
    { '@type': 'CollegeOrUniversity', name: 'University of Zimbabwe' },
  ],
  knowsAbout: [
    'AI safety',
    'AI governance',
    'Compute governance',
    'AI evaluations',
    'Forecasting',
    'Gradual disempowerment',
    'JavaScript',
    'SpiderMonkey',
    'Web standards',
    'Technical writing',
  ],
  sameAs: [
    'https://www.linkedin.com/in/tawanda-moyo',
    'https://github.com/tawandamoyo',
    'https://twitter.com/tbmoyo',
    'https://x.com/tbmoyo',
    'https://www.techzim.co.zw/author/tawandamoyo-2/',
    'https://talkjs.com/resources/author/tawanda/',
  ],
  subjectOf: {
    '@type': 'Dataset',
    name: 'Africa Compute Tracker',
    url: 'https://africacomputetracker.org',
    creator: { '@id': PERSON_ID },
  },
};

/** Lightweight author reference for articles — resolves to the Person by @id. */
export const author: Node = { '@type': 'Person', '@id': PERSON_ID, name: 'Tawanda Moyo', url: `${SITE}/about/` };

export const website: Node = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Tawanda Moyo',
  description: 'Essays, notes, and projects on AI safety, technology, and human agency.',
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
};

/** Breadcrumb trail; `crumbs` are [name, absolute-or-root-relative path] pairs. */
export function breadcrumbs(crumbs: [string, string][]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: new URL(path, SITE).href,
    })),
  };
}
