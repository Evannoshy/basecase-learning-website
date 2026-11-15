import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/markdown') && !accept.includes('text/html')) {
    const rewriteUrl = new URL('/api/markdown', request.url);
    rewriteUrl.searchParams.set('path', request.nextUrl.pathname);
    return NextResponse.rewrite(rewriteUrl);
  }

  const response = NextResponse.next();
  const existingVary = response.headers.get('vary');
  if (!existingVary) {
    response.headers.set('Vary', 'Accept');
  } else if (!existingVary.toLowerCase().includes('accept')) {
    response.headers.set('Vary', `${existingVary}, Accept`);
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/|images/|favicon\\.svg|icon\\.svg|robots\\.txt|sitemap\\.xml|llms\\.txt|google.*\\.html|[0-9a-f]{32}\\.txt|api/).*)',
  ],
};
