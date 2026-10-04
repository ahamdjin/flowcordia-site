import type { MetadataRoute } from 'next';
import { NAVIGATION } from './docs/navigation';
import { APP_DOC_PATHS } from '@/lib/app-doc-guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    ...NAVIGATION.flatMap((group) => group.children.map((item) => item.href)),
  ];
  return Array.from(
    new Set([...routes, ...APP_DOC_PATHS.map((path) => '/docs/' + path)])
  ).map((route) => ({ url: 'https://flowcordia.com' + route }));
}
