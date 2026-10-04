import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NAVIGATION } from './app/docs/navigation';

const flowcordiaDocs = new Set(
  NAVIGATION.flatMap((group) => group.children.map((item) => item.href))
);

export function middleware(request: NextRequest) {
  if (flowcordiaDocs.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/docs', request.url), 308);
}

export const config = {
  matcher: ['/docs/:path*'],
};
