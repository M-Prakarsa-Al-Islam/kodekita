"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  RESEND_COOLDOWN_SECONDS,
  RESET_SENT_MESSAGE,
  buildResetRedirect,
  isValidEmail,
  mapResetError,
} from "@/lib/password-reset";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordForm({
  linkError = false,
  cooldownSeconds = RESEND_COOLDOWN_SECONDS,
}: {
  linkError?: boolean;
  cooldownSeconds?: number;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(0);

  // Count the cooldown down once a second.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || wait > 0) return;
    setError(null);
    if (!isValidEmail(email)) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    setBusy(true);
    try {
      const { error: sendError } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: buildResetRedirect(window.location.origin),
      });
      const message = mapResetError(sendError);
      if (message) {
        setError(message);
        setSent(false);
        return;
      }
      // Same answer whether or not the email has an account (no account probing).
      setSent(true);
      setWait(cooldownSeconds);
    } catch {
      setError("Gagal mengirim link. Periksa koneksimu, lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {linkError && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Link tidak valid atau sudah kedaluwarsa. Minta link baru di bawah.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lupa-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="lupa-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {sent && (
          <p role="status" className="text-sm text-code">
            {RESET_SENT_MESSAGE}
          </p>
        )}

        <Button type="submit" disabled={busy || wait > 0} className="w-full">
          {busy ? "Mengirim..." : wait > 0 ? `Kirim ulang dalam ${wait} dtk` : sent ? "Kirim ulang link" : "Kirim link reset"}
        </Button>
      </form>

      <p className="text-sm text-ink-soft">
        Ingat password-nya?{" "}
        <a href="/login" className="font-medium text-ink underline">
          Kembali masuk
        </a>
      </p>
    </div>
  );
}
