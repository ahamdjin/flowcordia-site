import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const flowcordiaDocs = new Set([
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
]);

export function middleware(request: NextRequest) {
  if (flowcordiaDocs.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/docs', request.url), 308);
}

export const config = {
  matcher: ['/docs/:path*'],
};
