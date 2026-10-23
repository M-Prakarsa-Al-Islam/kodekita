import { createClient } from "@/lib/supabase/server";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Lupa password", robots: { index: false } };

export default async function LupaPasswordPage({ searchParams }: { searchParams: { error?: string } }) {
  // A signed-in visitor (e.g. coming from /akun) gets a way back to /akun
  // instead of a "Kembali masuk" link to the login page.
  const { data } = await createClient().auth.getUser();

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Lupa password</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Masukkan email akunmu. Kami kirim link untuk membuat password baru.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm linkError={searchParams.error === "link"} signedIn={Boolean(data.user)} />
      </div>
    </section>
  );
}
