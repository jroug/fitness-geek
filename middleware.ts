import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/users/enter",
  "/users/join",
  "/users/logout"
]);

function isPublicPath(pathname: string) {
  // exact matches
  if (PUBLIC_PATHS.has(pathname)) return true;

  // Magic login API routes
  if (pathname.startsWith("/users/magic-login/")) return true;

    // Public API routes
  if (pathname.startsWith("/api")) return true;

  // allow Next internals + common static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  ) {
    return true;
  }

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log('middleware executed for path:', pathname);
  
  // 1) allow public pages
  if (isPublicPath(pathname)) return NextResponse.next();
console.log('middleware executed for path:', pathname);
  // 2) check auth cookie
  const token = req.cookies.get("token")?.value;
  // console.log('token:', token);
  
  // 3) if not logged in => redirect to /
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run on all routes except Next static/image assets
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};