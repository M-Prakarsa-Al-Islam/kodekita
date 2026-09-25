"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitPurchase } from "@/lib/purchase";
import { Button } from "@/components/ui/Button";

export default function PurchaseForm({
  courseSlug,
  amount,
}: {
  courseSlug: string;
  amount: number;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Unggah dulu screenshot bukti pembayaran.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await submitPurchase({ courseSlug, amount, file, note });
      router.refresh(); // re-runs the server component -> shows "pending" state
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="proof" className="text-sm font-medium text-ink">
          Screenshot bukti pembayaran
        </label>
        <input
          id="proof"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-ink-soft">
          Gambar dikompres otomatis di perangkatmu sebelum diunggah.
        </p>
      </div>

      <div>
        <label htmlFor="note" className="text-sm font-medium text-ink">
          Catatan (opsional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nama pengirim, jika berbeda dari nama akunmu"
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Mengirim..." : "Kirim bukti pembayaran"}
      </Button>
    </form>
  );
}
