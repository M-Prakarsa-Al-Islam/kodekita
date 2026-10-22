import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  LINK_ERROR_PATH,
  RECOVERY_COOKIE,
  RESET_DONE_COOKIE,
  RESET_SUCCESS_MESSAGE,
  resetPageView,
} from "@/lib/password-reset";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import ResetSuccess from "@/components/auth/ResetSuccess";

export const metadata = { title: "Password baru" };

export default async function ResetPasswordPage() {
  const jar = cookies();
  const { data } = await createClient().auth.getUser();

  // Decided from the cookies on EVERY render (lib/password-reset.ts, tested):
  //  - "form"    : arrived from a real email link, may set a new password
  //  - "done"    : the reset just succeeded; keep showing the confirmation
  //  - "invalid" : anything else -> ask for a new link
  const view = resetPageView({
    hasRecoveryCookie: jar.get(RECOVERY_COOKIE)?.value === "1",
    hasDoneCookie: jar.get(RESET_DONE_COOKIE)?.value === "1",
    hasUser: Boolean(data.user),
  });
  if (view === "invalid") redirect(LINK_ERROR_PATH);

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      {view === "done" ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-ink">Password sudah diubah</h1>
          <div className="mt-8">
            <ResetSuccess message={RESET_SUCCESS_MESSAGE} />
          </div>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-ink">Buat password baru</h1>
          <p className="mt-2 text-sm text-ink-soft">Untuk akun {data.user?.email}.</p>
          <div className="mt-8">
            <ResetPasswordForm />
          </div>
        </>
      )}
    </section>
  );
}
