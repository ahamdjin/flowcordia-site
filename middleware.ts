import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NAVIGATION } from './app/docs/navigation';
import { APP_DOC_PATHS } from './lib/app-doc-guides';

const flowcordiaDocs = new Set([
  ...NAVIGATION.flatMap((group) => group.children.map((item) => item.href)),
  ...APP_DOC_PATHS.map((path) => '/docs/' + path),
]);

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/docs/v3/troubleshooting') {
    return NextResponse.rewrite(new URL('/docs/troubleshooting', request.url));
  }
  if (flowcordiaDocs.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL('/documentation-not-found', request.url));
}

export const config = {
  matcher: ['/docs/:path*'],
};
