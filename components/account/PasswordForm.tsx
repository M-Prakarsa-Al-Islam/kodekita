"use client";

import { useState } from "react";
import { changePassword } from "@/app/akun/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, validatePasswordChange } from "@/lib/account";
import { Button } from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

export default function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const problem = validatePasswordChange(current, next, confirm);
    if (problem) {
      setMessage({ ok: false, text: problem });
      return;
    }
    setBusy(true);
    try {
      const r = await changePassword(current, next, confirm);
      setMessage({ ok: r.ok, text: r.message ?? "" });
      if (r.ok) {
        setCurrent("");
        setNext("");
        setConfirm("");
      }
    } catch {
      setMessage({ ok: false, text: "Gagal mengubah password. Periksa koneksimu, lalu coba lagi." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pw-sekarang" className="text-sm font-medium text-ink">
          Password saat ini
        </label>
        <PasswordInput
          id="pw-sekarang"
          required
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Lupa password saat ini?{" "}
          <a href="/lupa-password" className="font-medium text-ink underline">
            Atur ulang lewat email
          </a>
        </p>
      </div>
      <div>
        <label htmlFor="pw-baru" className="text-sm font-medium text-ink">
          Password baru
        </label>
        <PasswordInput
          id="pw-baru"
          required
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_PASSWORD_LENGTH}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">Minimal {MIN_PASSWORD_LENGTH} karakter.</p>
      </div>
      <div>
        <label htmlFor="pw-ulang" className="text-sm font-medium text-ink">
          Ulangi password baru
        </label>
        <PasswordInput
          id="pw-ulang"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Menyimpan..." : "Ganti password"}
        </Button>
        {message && (
          <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "text-code" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
