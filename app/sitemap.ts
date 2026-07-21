import type { MetadataRoute } from 'next';

const BASE_URL = 'https://flowcordia.com';

const ROUTES = [
  '',
  '/docs',
  '/docs/getting-started',
  '/docs/studio',
  '/docs/workflow-model',
  '/docs/source',
  '/docs/typed-functions',
  '/docs/git-proposals',
  '/docs/preview-deployments',
  '/docs/runs',
  '/docs/security',
  '/docs/self-hosting',
  '/docs/capability-status',
  '/self-hosting',
  '/architecture',
  '/roadmap',
  '/changelog',
  '/community',
  '/security',
  '/contributing',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency:
      route === '/changelog' || route === '/roadmap' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/docs' ? 0.9 : 0.7,
  }));
}
