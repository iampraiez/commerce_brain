import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'analytics-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated via cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register');

  if (isAuthPage && sessionToken) {
    // Redirect authenticated users away from login/register pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/auth/register'],
};
