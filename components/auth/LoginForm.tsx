"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { describeAuthError } from "@/lib/auth-messages";
import { safeInternalPath } from "@/lib/route-guard";
import { Button } from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import ResendConfirmation from "@/components/auth/ResendConfirmation";

export default function LoginForm({ cooldownSeconds }: { cooldownSeconds?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUnconfirmed(false);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);

    if (signInError) {
      const problem = describeAuthError(signInError);
      setError(problem?.message ?? "Gagal masuk. Coba lagi.");
      setUnconfirmed(problem?.kind === "unconfirmed");
      return;
    }

    const safeNext = safeInternalPath(searchParams.get("next"), "/dashboard");
    router.push(safeNext);
    router.refresh();
  }

  const confirmError = searchParams.get("confirm_error") === "1";

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Masuk</h1>
      <p className="mt-2 text-sm text-ink-soft">Lanjutkan belajar dari terakhir kali.</p>

      {searchParams.get("confirmed") === "1" && (
        <p role="status" className="mt-6 rounded-md border border-line bg-white/60 px-4 py-3 text-sm text-code">
          Email kamu sudah terkonfirmasi. Silakan masuk dengan email dan password yang kamu daftarkan.
        </p>
      )}
      {searchParams.get("registered") === "1" && (
        <p role="status" className="mt-6 rounded-md border border-line bg-white/60 px-4 py-3 text-sm text-code">
          Pendaftaran berhasil. Cek email dari PyMula untuk mengonfirmasi akunmu, lalu masuk di sini.
        </p>
      )}
      {confirmError && (
        <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Tautan konfirmasi tidak valid atau sudah kedaluwarsa. Ketik emailmu di bawah, lalu kirim ulang email
          konfirmasi.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <a href="/lupa-password" className="text-xs font-medium text-ink-soft underline hover:text-ink">
              Lupa password?
            </a>
          </div>
          <PasswordInput id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {searchParams.get("deleted") === "1" && (
          <p role="status" className="text-sm text-code">
            Akunmu sudah dihapus. Kamu boleh mendaftar lagi kapan saja.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Masuk..." : "Masuk"}
        </Button>
      </form>

      {(unconfirmed || confirmError) && (
        <div className="mt-4 rounded-md border border-line bg-white/60 p-4">
          <p className="mb-3 text-sm text-ink-soft">
            Belum menerima email konfirmasi? Pastikan emailmu sudah diisi di atas, lalu kirim ulang.
          </p>
          <ResendConfirmation email={email.trim()} cooldownSeconds={cooldownSeconds} />
        </div>
      )}

      <p className="mt-6 text-sm text-ink-soft">
        Belum punya akun?{" "}
        <a href="/register" className="font-medium text-ink underline">
          Daftar gratis
        </a>
      </p>
    </section>
  );
}
