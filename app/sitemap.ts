import type { MetadataRoute } from 'next';
import { NAVIGATION } from './docs/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    ...NAVIGATION.flatMap((group) => group.children.map((item) => item.href)),
  ];
  return routes.map((route) => ({ url: 'https://flowcordia.com' + route }));
}
