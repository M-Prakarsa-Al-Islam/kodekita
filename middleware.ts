import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // The chapter LIST (/kursus/python-dasar) is public — logged-out
  // visitors can see what's there, with a reminder to log in. Anything
  // nested under it (an actual chapter or lesson) requires an account.
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/kursus/python-dasar/") ||
    pathname.startsWith("/admin");

  if (isProtected && !data.user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/kursus/python-dasar/:path*", "/admin/:path*"],
};
