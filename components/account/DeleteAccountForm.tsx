"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/akun/actions";
import { DELETE_CONFIRM_WORD } from "@/lib/account";
import { createClient } from "@/lib/supabase/client";
import { clearAllDrafts, getBrowserStorage } from "@/lib/code-drafts";
import PasswordInput from "@/components/ui/PasswordInput";

export default function DeleteAccountForm({
  hasPaidAccess,
  hasPendingPurchase,
}: {
  hasPaidAccess: boolean;
  hasPendingPurchase: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = password.length > 0 && confirmText.trim() === DELETE_CONFIRM_WORD;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setError(null);
    setBusy(true);
    try {
      const r = await deleteAccount(password, confirmText);
      if (!r.ok) {
        setError(r.message);
        return;
      }
      // The account is gone: clear this browser's session and saved lesson code.
      try {
        await createClient().auth.signOut();
      } catch {
        /* already invalid */
      }
      const storage = getBrowserStorage();
      if (storage) clearAllDrafts(storage);
      router.replace("/login?deleted=1");
      router.refresh();
    } catch {
      setError("Gagal menghapus akun. Periksa koneksimu, lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-red-300 bg-red-50/50 p-5">
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink">Menghapus akun bersifat permanen.</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-600 hover:text-white"
          >
            Hapus akun...
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-sm text-ink">
            <p className="font-medium">Yang akan terjadi:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Akunmu, nama, dan seluruh progres belajarmu dihapus permanen.</li>
              <li>
                Kamu boleh mendaftar lagi dengan email yang sama, tetapi akan mulai dari awal. Progres tidak
                bisa dikembalikan.
              </li>
              {hasPaidAccess && (
                <li className="font-medium text-red-700">
                  Akses chapter berbayarmu hilang permanen. Mendaftar ulang tidak mengembalikannya; kamu harus
                  membeli lagi.
                </li>
              )}
              <li>
                Bukti pembayaranmu dihapus. Yang tersisa hanya catatan transaksi tanpa identitas (kursus,
                jumlah, status, tanggal) untuk pembukuan.
              </li>
            </ul>
            {hasPendingPurchase && (
              <p role="alert" className="font-medium text-red-700">
                Kamu punya pembayaran yang menunggu verifikasi. Akun baru bisa dihapus setelah pembayaran itu
                disetujui atau ditolak.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="hapus-password" className="text-sm font-medium text-ink">
              Password
            </label>
            <PasswordInput
              id="hapus-password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-soft">
              Lupa password?{" "}
              <a href="/lupa-password" className="font-medium text-ink underline">
                Atur ulang lewat email
              </a>
            </p>
          </div>
          <div>
            <label htmlFor="hapus-konfirmasi" className="text-sm font-medium text-ink">
              Ketik {DELETE_CONFIRM_WORD} untuk mengonfirmasi
            </label>
            <input
              id="hapus-konfirmasi"
              type="text"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!ready || busy}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Menghapus..." : "Hapus akun saya permanen"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setPassword("");
                setConfirmText("");
                setError(null);
              }}
              className="text-sm text-ink-soft underline hover:text-ink disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
