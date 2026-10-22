// Pure routing decisions shared by middleware.ts, so they can be tested
// (scripts/test-password-reset.mjs) without Next or Supabase.

// A "?next=" value is only followed if it is a plain path inside this site.
// Rejected: absolute URLs, "//host" (protocol-relative), and anything with a
// backslash or control character ("/\evil.com" is read by URL parsers as
// "//evil.com", i.e. another site).
export function safeInternalPath(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.includes("\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(next)) return fallback;
  return next;
}

export const AUTH_PAGES = ["/login", "/register"];

// The chapter LIST (/kursus/python-dasar) is public - logged-out visitors can
// see what's there. Anything nested under it (a chapter or lesson) needs an
// account.
export function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/akun") ||
    pathname.startsWith("/kursus/python-dasar/") ||
    pathname.startsWith("/admin")
  );
}

function isAuthPage(path: string): boolean {
  return AUTH_PAGES.some((p) => path === p || path.startsWith(p + "?") || path.startsWith(p + "/"));
}

// Where to send the visitor instead of showing this page, or null to show it.
//  - logged out on a protected page  -> /login?next=<page>
//  - logged in on /login or /register -> where they were headed (?next=) or "/"
//    (never back to a login/register page, so it cannot loop)
export function guardRedirect(pathname: string, hasUser: boolean, next: string | null): string | null {
  if (!hasUser && isProtectedPath(pathname)) {
    return `/login?next=${encodeURIComponent(pathname)}`;
  }
  if (hasUser && isAuthPage(pathname)) {
    const target = safeInternalPath(next, "/");
    return isAuthPage(target) ? "/" : target;
  }
  return null;
}
