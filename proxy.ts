import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  const pathname = req.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Protect customer routes
  const protectedRoutes = ["/checkout", "/orders", "/profile", "/cart", "/wishlist", "/account"];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + pathname, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*", "/profile/:path*", "/cart/:path*", "/wishlist/:path*", "/account/:path*", "/checkout"]
};
