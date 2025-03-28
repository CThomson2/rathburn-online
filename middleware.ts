import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE_NAME } from "@/utils/auth";

/**
 * Protected paths that require authentication
 */
const protectedPaths = [
  "/dashboard",
  "/inventory/drum-stock",
  "/inventory/production",
  "/inventory/finished-goods",
];

/**
 * Paths that don't require authentication
 */
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

/**
 * Middleware function to check if the user is authenticated
 * and redirect to the login page if not.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without authentication
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If the path is not protected, proceed
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for the authentication token
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME);

  // If no token is found, redirect to login with the current path as redirectTo
  if (!authToken) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // If token exists, allow access to protected paths
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that aren't protected
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
