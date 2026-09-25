import Link from "next/link";
import { getCoursePrice, PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import { getLatestPurchase } from "@/lib/purchase-server";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { LinkButton } from "@/components/ui/Button";

// TODO: swap for the real business WhatsApp number before launch.
const WHATSAPP_URL = "https://wa.me/6280000000000";

export default async function BeliPage() {
  const price = getCoursePrice(PYTHON_DASAR_COURSE_SLUG);
  const purchase = await getLatestPurchase(PYTHON_DASAR_COURSE_SLUG);

  if (!purchase) {
    // middleware already guards this route, but stay safe if reached directly.
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-ink-soft">Masuk dulu untuk melanjutkan pembelian.</p>
      </section>
    );
  }

  if (purchase.status === "approved") {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Sudah dibeli</h1>
        <p className="mt-2 text-ink-soft">Chapter 6–13 Python Dasar sudah terbuka untukmu.</p>
        <LinkButton href="/kursus/python-dasar" className="mt-6">
          Lanjut belajar
        </LinkButton>
      </section>
    );
  }

  if (purchase.status === "pending") {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Menunggu verifikasi</h1>
        <p className="mt-2 text-ink-soft">
          Bukti pembayaran kamu sedang kami cek. Biasanya tidak lama.
        </p>
        <p className="mt-6 text-sm text-ink-soft">
          Sudah lama dan belum ada kabar?{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium underline">
            Hubungi kami di WhatsApp
          </a>
          .
        </p>
        <Link href="/kursus/python-dasar" className="mt-6 inline-block text-sm underline">
          Kembali ke daftar chapter
        </Link>
      </section>
    );
  }

  // status === "none" or "rejected"
  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Buka Chapter 6–13</h1>
      <p className="mt-2 text-ink-soft">
        Sekali bayar, akses selamanya. Rp{price.toLocaleString("id-ID")}.
      </p>

      {purchase.status === "rejected" && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Bukti pembayaran sebelumnya belum bisa kami verifikasi. Coba kirim ulang
          dengan bukti yang lebih jelas, atau hubungi kami di WhatsApp.
        </div>
      )}

      <div className="mt-6 rounded-lg border border-line bg-white p-5 text-center">
        <img
          src="/qris-placeholder.svg"
          alt="QRIS pembayaran KodeKita"
          className="mx-auto h-64 w-64"
        />
        <p className="mt-3 text-xs text-ink-soft">
          Scan dengan aplikasi e-wallet atau m-banking apa pun yang mendukung QRIS.
        </p>
      </div>

      <div className="mt-8">
        <PurchaseForm courseSlug={PYTHON_DASAR_COURSE_SLUG} amount={price} />
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        Ada kendala?{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline">
          Hubungi kami di WhatsApp
        </a>
      </p>
    </section>
  );
}
