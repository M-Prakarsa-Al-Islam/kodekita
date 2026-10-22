"use client";

import { useEffect, useRef, useState } from "react";
import { DOWNLOADS_AVAILABLE, REFUND_DAYS } from "@/lib/site-config";

export const END_NOTICE_STORAGE_KEY = "pymula:end-notice:v1";

// Local calendar day, e.g. "2027-08-20". The pop-up comes back once per day.
export function dayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Shown only in the "notice" window before the end date (the layout decides).
// Dismissible, never blocks learning, comes back once a day.
export default function EndNoticeModal({
  endLabel,
  daysLeft,
  now,
}: {
  endLabel: string;
  daysLeft: number;
  now?: Date; // for tests
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let dismissedToday = false;
    try {
      dismissedToday = window.localStorage.getItem(END_NOTICE_STORAGE_KEY) === dayKey(now ?? new Date());
    } catch {
      /* storage blocked: just show it */
    }
    if (!dismissedToday) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(END_NOTICE_STORAGE_KEY, dayKey(now ?? new Date()));
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="end-notice-title"
        aria-describedby="end-notice-body"
        className="w-full max-w-md rounded-lg border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="end-notice-title" className="font-display text-xl font-semibold text-ink">
          PyMula akan berhenti beroperasi
        </h2>
        <div id="end-notice-body" className="mt-3 space-y-3 text-sm text-ink">
          <p>
            Layanan berakhir pada <strong>{endLabel}</strong> ({daysLeft} hari lagi).
          </p>
          <p>
            Setelah tanggal itu situs tidak bisa dibuka, dan akun beserta datanya dihapus. Penjualan chapter
            berbayar sudah ditutup.
            {DOWNLOADS_AVAILABLE
              ? " Unduh materimu sebelum tanggal itu."
              : " Selesaikan belajarmu sebelum tanggal itu."}
          </p>
          <p>
            Pembelian dalam {REFUND_DAYS} hari terakhir bisa di-refund penuh. Rinciannya ada di halaman{" "}
            <a href="/tentang#penutupan" className="font-medium underline">
              Tentang
            </a>
            .
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
