import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Only protect admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/upload') || 
                      request.nextUrl.pathname.startsWith('/account');

  if (isAdminRoute && !session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Configure which paths need authentication
export const config = {
  matcher: [
    '/upload/:path*',
    '/account/:path*'
  ],
}; 