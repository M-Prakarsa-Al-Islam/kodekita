"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/account";
import { RECOVERY_COOKIE, resetPasswordFlow } from "@/lib/password-reset";

export async function resetPassword(password: string, confirm: string): Promise<ActionResult> {
  const supabase = createClient();

  const result = await resetPasswordFlow(
    {
      hasRecoveryCookie: () => cookies().get(RECOVERY_COOKIE)?.value === "1",
      getUserId: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
      updatePassword: async (pw) => (await supabase.auth.updateUser({ password: pw })).error,
      clearRecoveryCookie: () => cookies().delete(RECOVERY_COOKIE),
      signOutOtherSessions: async () => {
        await supabase.auth.signOut({ scope: "others" });
      },
    },
    { password, confirm }
  );

  if (result.ok) revalidatePath("/", "layout");
  return result;
}
