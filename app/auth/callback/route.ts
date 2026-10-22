import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { RECOVERY_COOKIE, RECOVERY_COOKIE_MAX_AGE, resolveCallback } from "@/lib/password-reset";

// Where the "lupa password" email link lands. Turns the link into a session,
// marks it as a password-recovery session, and redirects. The decisions live in
// lib/password-reset.ts (tested); this file only plugs in Supabase and cookies.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const supabase = createClient();

  const path = await resolveCallback(
    {
      code: url.searchParams.get("code"),
      tokenHash: url.searchParams.get("token_hash"),
      type: url.searchParams.get("type"),
      next: url.searchParams.get("next"),
    },
    {
      exchangeCode: async (code) => !(await supabase.auth.exchangeCodeForSession(code)).error,
      verifyRecoveryOtp: async (tokenHash) =>
        !(await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash })).error,
      markRecovery: () => {
        cookies().set(RECOVERY_COOKIE, "1", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: RECOVERY_COOKIE_MAX_AGE,
        });
      },
    }
  );

  return NextResponse.redirect(new URL(path, url.origin));
}
