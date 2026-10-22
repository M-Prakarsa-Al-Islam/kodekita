"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateName } from "@/app/akun/actions";
import { MAX_NAME_LENGTH, normalizeName, validateName } from "@/lib/account";
import { Button } from "@/components/ui/Button";

export default function ProfileForm({ email, initialName }: { email: string; initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const unchanged = normalizeName(name) === normalizeName(initialName);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const problem = validateName(normalizeName(name));
    if (problem) {
      setMessage({ ok: false, text: problem });
      return;
    }
    setBusy(true);
    try {
      const r = await updateName(name);
      setMessage({ ok: r.ok, text: r.message ?? "" });
      if (r.ok) {
        setName(normalizeName(name));
        router.refresh();
      }
    } catch {
      setMessage({ ok: false, text: "Gagal menyimpan nama. Periksa koneksimu, lalu coba lagi." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="akun-email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="akun-email"
          type="email"
          value={email}
          readOnly
          className="mt-1 w-full rounded-md border border-line bg-ink/5 px-3 py-2 text-sm text-ink-soft"
        />
        <p className="mt-1 text-xs text-ink-soft">Email tidak bisa diubah.</p>
      </div>
      <div>
        <label htmlFor="akun-nama" className="text-sm font-medium text-ink">
          Nama
        </label>
        <input
          id="akun-nama"
          type="text"
          required
          maxLength={MAX_NAME_LENGTH}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy || unchanged}>
          {busy ? "Menyimpan..." : "Simpan nama"}
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
