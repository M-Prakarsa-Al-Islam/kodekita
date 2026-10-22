import Logo from "./Logo";
import {
  LEGACY_URL,
  REFUND_CLAIM_DAYS_AFTER_END,
  REFUND_DAYS,
  SERVICE_END_ISO,
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  dateAfter,
  formatDateId,
} from "@/lib/site-config";

// What every page shows once the service has ended. It must NOT touch Supabase
// (the project is deleted by then) or anything else that needs a server: it is
// plain text, so it keeps working on the free Vercel address after the domain
// has expired. scripts/test-service.mjs checks that it imports no Supabase code.
export default function Farewell() {
  const end = formatDateId(SERVICE_END_ISO);
  const claimUntil = formatDateId(dateAfter(SERVICE_END_ISO, REFUND_CLAIM_DAYS_AFTER_END));

  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-ink">{SITE_NAME} sudah berhenti beroperasi</h1>
        <p className="mt-4 text-ink">
          Terima kasih sudah belajar bersama {SITE_NAME}. Layanan ini berakhir pada {end}. Situs, akun, dan
          datanya sudah tidak tersedia, dan seluruh akun serta data pengguna dihapus saat penutupan.
        </p>

        <div className="mt-8 rounded-lg border border-line bg-white/60 p-5 text-sm text-ink">
          <p className="font-display text-base font-semibold">Refund</p>
          <p className="mt-2">
            Pembelian dalam {REFUND_DAYS} hari terakhir sebelum {end} bisa di-refund penuh. Ajukan lewat
            WhatsApp sebelum {claimUntil}. Sertakan bukti pembayaran dan waktu pembayarannya.
          </p>
          <p className="mt-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-md bg-ink px-4 py-2 font-medium text-paper hover:opacity-90"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </p>
        </div>

        {LEGACY_URL && (
          <p className="mt-6 text-sm text-ink">
            Materi pelajaran masih bisa kamu baca di{" "}
            <a href={LEGACY_URL} className="font-medium underline">
              {LEGACY_URL}
            </a>
            .
          </p>
        )}

        <p className="mt-10 text-xs text-ink-soft">
          © {SITE_NAME}. Alamat email di domain pymula.live ikut berhenti bersama domainnya; WhatsApp di atas tetap
          bisa dihubungi.
        </p>
      </main>
    </>
  );
}
