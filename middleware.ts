import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicPath } from "@/lib/isPublicPath";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log('middleware executed for path:', pathname);
  
  // 1) allow public pages
  if (isPublicPath(pathname)) return NextResponse.next();

  // 2) only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // 3) check auth cookie
  const token = req.cookies.get("token")?.value;
  // console.log('token:', token);
  
  // 4) if not logged in => redirect to /
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
