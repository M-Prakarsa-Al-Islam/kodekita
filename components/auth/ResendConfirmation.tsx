"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cooldownLeft, describeAuthError } from "@/lib/auth-messages";
import { RESEND_COOLDOWN_SECONDS, buildSignupRedirect } from "@/lib/password-reset";

// "Send the confirmation email again", with a pause between sends (Supabase limits how often
// an email may be sent, and repeated presses would only hit that limit).
export default function ResendConfirmation({
  email,
  startCooldown = false,
  cooldownSeconds = RESEND_COOLDOWN_SECONDS,
}: {
  email: string;
  startCooldown?: boolean; // true right after sign-up, because an email was just sent
  cooldownSeconds?: number;
}) {
  const [sentAt, setSentAt] = useState<number | null>(startCooldown ? Date.now() : null);
  const [now, setNow] = useState(() => Date.now());
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const left = sentAt === null ? 0 : cooldownLeft(sentAt, now, cooldownSeconds);
  const counting = left > 0;

  useEffect(() => {
    if (!counting) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [counting]);

  function restartCooldown() {
    const t = Date.now();
    setSentAt(t);
    setNow(t);
  }

  async function resend() {
    setSending(true);
    setStatus(null);
    const { error } = await createClient().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: buildSignupRedirect(window.location.origin) },
    });
    setSending(false);
    if (error) {
      const problem = describeAuthError(error);
      setStatus({ ok: false, text: problem?.message ?? "Gagal mengirim ulang. Coba lagi." });
      if (problem?.kind === "rate_limit") restartCooldown(); // make them wait instead of pressing again
      return;
    }
    restartCooldown();
    setStatus({ ok: true, text: `Email konfirmasi dikirim ulang ke ${email}. Cek kotak masuk dan folder spam.` });
  }

  return (
    <div>
      <Button type="button" variant="secondary" disabled={sending || counting || !email} onClick={resend}>
        {sending ? "Mengirim..." : counting ? `Kirim ulang email (${left} dtk)` : "Kirim ulang email konfirmasi"}
      </Button>
      {status && (
        <p role="status" className={`mt-2 text-sm ${status.ok ? "text-code" : "text-red-600"}`}>
          {status.text}
        </p>
      )}
    </div>
  );
}
