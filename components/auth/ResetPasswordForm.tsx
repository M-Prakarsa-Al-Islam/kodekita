"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/reset-password/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/account";
import { Button, LinkButton } from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const problem = validateNewPassword(password, confirm);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      const r = await resetPassword(password, confirm);
      if (!r.ok) {
        setError(r.message);
        return;
      }
      setPassword("");
      setConfirm("");
      setDone(r.message ?? "Password berhasil diubah.");
      router.refresh();
    } catch {
      setError("Gagal mengubah password. Periksa koneksimu, lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p role="status" className="text-sm text-code">
          {done}
        </p>
        <LinkButton href="/">Ke dashboard</LinkButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reset-baru" className="text-sm font-medium text-ink">
          Password baru
        </label>
        <PasswordInput
          id="reset-baru"
          required
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_PASSWORD_LENGTH}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">Minimal {MIN_PASSWORD_LENGTH} karakter.</p>
      </div>
      <div>
        <label htmlFor="reset-ulang" className="text-sm font-medium text-ink">
          Ulangi password baru
        </label>
        <PasswordInput
          id="reset-ulang"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Menyimpan..." : "Simpan password baru"}
      </Button>
    </form>
  );
}
