"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/account";
import { RECOVERY_COOKIE, RESET_DONE_COOKIE, RESET_DONE_COOKIE_MAX_AGE, resetPasswordFlow } from "@/lib/password-reset";

export async function resetPassword(password: string, confirm: string): Promise<ActionResult> {
  const supabase = createClient();

  // No revalidatePath here: nothing else on the site changes after a password
  // reset, and the page decides what to show from the cookies (see page.tsx).
  const result = await resetPasswordFlow(
    {
      hasRecoveryCookie: () => cookies().get(RECOVERY_COOKIE)?.value === "1",
      getUserId: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
      updatePassword: async (pw) => (await supabase.auth.updateUser({ password: pw })).error,
      clearRecoveryCookie: () => cookies().delete(RECOVERY_COOKIE),
      markResetDone: () => {
        cookies().set(RESET_DONE_COOKIE, "1", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: RESET_DONE_COOKIE_MAX_AGE,
        });
      },
      signOutOtherSessions: async () => {
        await supabase.auth.signOut({ scope: "others" });
      },
    },
    { password, confirm }
  );

  return result;
}
