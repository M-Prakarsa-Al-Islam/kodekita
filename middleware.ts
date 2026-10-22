import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { guardRedirect, needsSession } from "@/lib/route-guard";
import { ENDED_PATH, serviceState } from "@/lib/site-config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // After the end date the Supabase project is gone. Send EVERY request to the
  // farewell route BEFORE the real page runs: merely not displaying a page is not
  // enough, because Next.js would still execute it (and call Supabase) on the server.
  if (serviceState(new Date()) === "ended") {
    return pathname === ENDED_PATH
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(ENDED_PATH, request.url));
  }

  // Most pages need nothing from the session here: let them through untouched.
  if (!needsSession(pathname)) return NextResponse.next();

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
  // Every path except Next.js internals and files with an extension (images, fonts, ...).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
