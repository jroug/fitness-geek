const PUBLIC_PATHS = new Set([
  "/",
  "/users/enter",
  "/users/join",
  "/users/logout",
]);

export function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;

  // Magic login API routes
  if (pathname.startsWith("/users/magic-login/")) return true;

  // Public API routes
  if (pathname.startsWith("/api")) return true;

  // Allow Next internals + common static files
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
