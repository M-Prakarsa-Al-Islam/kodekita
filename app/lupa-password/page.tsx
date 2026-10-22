import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Lupa password" };

export default function LupaPasswordPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Lupa password</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Masukkan email akunmu. Kami kirim link untuk membuat password baru.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm linkError={searchParams.error === "link"} />
      </div>
    </section>
  );
}
