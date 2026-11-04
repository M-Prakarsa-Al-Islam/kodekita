"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { describeAuthError } from "@/lib/auth-messages";
import { buildSignupRedirect } from "@/lib/password-reset";
import { Button } from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import CheckEmailNotice from "@/components/auth/CheckEmailNotice";

export default function RegisterForm({ cooldownSeconds }: { cooldownSeconds?: number }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Set once the account is created and a confirmation email is on its way.
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name }, emailRedirectTo: buildSignupRedirect(window.location.origin) },
    });

    setLoading(false);

    if (signUpError) {
      setError(describeAuthError(signUpError)?.message ?? "Pendaftaran gagal. Coba lagi.");
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      // Email confirmation is on: there is no session until the learner clicks the link in the email.
      // Show what to do next here (the password is not kept in memory any longer than needed).
      setPassword("");
      setSentTo(cleanEmail);
    }
  }

  if (sentTo) {
    return <CheckEmailNotice email={sentTo} onChangeEmail={() => setSentTo(null)} cooldownSeconds={cooldownSeconds} />;
  }

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Buat akun</h1>
      <p className="mt-2 text-sm text-ink-soft">Mulai dari Chapter 1 sekarang.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Nama
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Pakai email yang bisa kamu buka sekarang. Kami mengirim tautan konfirmasi ke sana.
          </p>
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <PasswordInput
            id="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Membuat akun..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <a href="/login" className="font-medium text-ink underline">
          Masuk
        </a>
      </p>
    </section>
  );
}
