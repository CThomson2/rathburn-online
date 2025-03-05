import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE_NAME, verifyToken } from "@/utils/auth";

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
 * Authentication-related paths
 */
const authPaths = ["/login", "/register", "/auth/login", "/auth/register"];

/**
 * API paths that don't need protection
 */
const publicApiPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/health",
  "/api/public",
];

/**
 * Middleware function to check if the user is authenticated
 * and redirect appropriately.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internal paths and static files without authentication
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/robots.txt")
  ) {
    return NextResponse.next();
  }

  // Allow public API endpoints
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  // Check if token exists and is valid
  const isAuthenticated = authToken ? verifyToken(authToken) !== null : false;

  // Handle auth paths - redirect to dashboard if already authenticated
  if (authPaths.some((path) => pathname.includes(path))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If the path is protected and user is not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // For API routes that aren't public, check authentication
  if (pathname.startsWith("/api") && !isAuthenticated) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  // Default: allow access
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
     * 3. /public (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /robots.txt, etc.
     */
    "/((?!_next/|_static/|_vercel/|favicon.ico|robots.txt).*)",
  ],
};
