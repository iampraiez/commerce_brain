import { NextResponse, NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'analytics-session';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected routes (Dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      // Store the intended destination to redirect back after login
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Auth routes (Login/Register) - Redirect to dashboard if already logged in
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
