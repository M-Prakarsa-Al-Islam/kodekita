import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { guardRedirect } from "@/lib/route-guard";

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

  // Decisions live in lib/route-guard.ts (tested): logged-out visitors are sent
  // to /login from protected pages; logged-in visitors are sent away from
  // /login and /register (to ?next= or "/").
  const redirectTo = guardRedirect(pathname, Boolean(data.user), request.nextUrl.searchParams.get("next"));
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/akun/:path*",
    "/kursus/python-dasar/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
