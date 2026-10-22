import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LINK_ERROR_PATH, RECOVERY_COOKIE } from "@/lib/password-reset";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Password baru" };

export default async function ResetPasswordPage() {
  // Only reachable right after a real email link (see lib/password-reset.ts).
  const hasCookie = cookies().get(RECOVERY_COOKIE)?.value === "1";
  const { data } = await createClient().auth.getUser();
  if (!hasCookie || !data.user) redirect(LINK_ERROR_PATH);

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Buat password baru</h1>
      <p className="mt-2 text-sm text-ink-soft">Untuk akun {data.user.email}.</p>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </section>
  );
}
