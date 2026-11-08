import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/content/projects";
import { getCoursePrice } from "@/content/pricing";
import { getLatestPurchase, getRejectReason } from "@/lib/purchase-server";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { LinkButton } from "@/components/ui/Button";
import { projectBase } from "@/lib/project-paths";
import { REFUND_DAYS, SERVICE_END_ISO, WHATSAPP_URL, formatDateId, salesOpen } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: { project: string } }): Promise<Metadata> {
  const project = getProject(params.project);
  return { title: project ? `Beli ${project.title}` : "Beli", robots: { index: false } };
}

// "Bab 3–10" for the chapters that need the purchase (null if all are free).
function paidRange(chapters: { order: number; isFree: boolean }[]): string | null {
  const paid = chapters.filter((c) => !c.isFree).map((c) => c.order);
  if (!paid.length) return null;
  const lo = Math.min(...paid), hi = Math.max(...paid);
  return lo === hi ? `Bab ${lo}` : `Bab ${lo}–${hi}`;
}

export default async function ProjectBeliPage({ params }: { params: { project: string } }) {
  const project = getProject(params.project);
  if (!project) notFound();

  const base = projectBase(project.slug);
  const price = getCoursePrice(project.slug);
  const paid = paidRange(project.chapters) ?? "bab berbayar";
  const purchase = await getLatestPurchase(project.slug);
  const rejectReason = purchase?.status === "rejected" ? await getRejectReason(purchase.id) : null;

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
        <p className="mt-2 text-ink-soft">{paid} {project.title} sudah terbuka untukmu.</p>
        <LinkButton href={base} className="mt-6">Lanjut belajar</LinkButton>
      </section>
    );
  }

  if (purchase.status === "pending") {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Menunggu verifikasi</h1>
        <p className="mt-2 text-ink-soft">Bukti pembayaran kamu sedang kami cek. Biasanya tidak lama.</p>
        <p className="mt-6 text-sm text-ink-soft">
          Sudah lama dan belum ada kabar?{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium underline">
            Hubungi kami di WhatsApp
          </a>
          .
        </p>
        <Link href={base} className="mt-6 inline-block text-sm underline">Kembali ke daftar bab</Link>
      </section>
    );
  }

  // status === "none" or "rejected". Paid chapters stop being sold when the
  // end-of-service notice starts; a payment already submitted is handled above.
  if (!salesOpen(new Date())) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Penjualan sudah ditutup</h1>
        <p className="mt-2 text-ink-soft">
          Bab berbayar tidak dijual lagi karena PyMula akan berhenti beroperasi pada {formatDateId(SERVICE_END_ISO)}.
          Bab gratis tetap bisa kamu pelajari sampai tanggal itu.
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          Sudah transfer sebelumnya dan belum ada kabar?{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium underline">
            Hubungi kami di WhatsApp
          </a>
          .
        </p>
        <LinkButton href={base} className="mt-6">Kembali ke daftar bab</LinkButton>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Buka {paid}</h1>
      <p className="mt-1 text-sm text-ink-soft">{project.title}</p>
      <p className="mt-2 text-ink-soft">Sekali bayar, Rp{price.toLocaleString("id-ID")}.</p>

      <div className="mt-4 rounded-lg border border-sun bg-sun/10 px-4 py-3 text-sm text-ink">
        <p className="font-medium">Baca dulu sebelum membayar</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Akses berlaku selama PyMula berjalan, direncanakan paling lama sampai {formatDateId(SERVICE_END_ISO)}.
            Bukan akses selamanya.
          </li>
          <li>PyMula dikelola sendiri dan bisa berhenti lebih awal. Kami memberi tahu minimal 30 hari sebelumnya.</li>
          <li>Pembelian dalam {REFUND_DAYS} hari terakhir sebelum penutupan bisa di-refund penuh.</li>
          <li>Setiap lesson punya kode awal sendiri; kode yang kamu tulis di lesson sebelumnya tidak dibawa otomatis.</li>
        </ul>
        <p className="mt-2">
          <Link href="/tentang#status" className="font-medium underline">Selengkapnya di halaman Tentang</Link>
        </p>
      </div>

      {purchase.status === "rejected" && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Bukti pembayaran sebelumnya belum bisa kami verifikasi. Coba kirim ulang dengan bukti yang lebih jelas, atau
          hubungi kami di WhatsApp.
          {rejectReason && (
            <p className="mt-2">
              <strong>Alasan dari admin:</strong> {rejectReason}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-line bg-white p-5 text-center">
        <img src="/qris-placeholder.svg" alt="QRIS pembayaran PyMula" className="mx-auto h-64 w-64" />
        <p className="mt-3 text-xs text-ink-soft">
          Scan dengan aplikasi e-wallet atau m-banking apa pun yang mendukung QRIS.
        </p>
      </div>

      <div className="mt-8">
        <PurchaseForm courseSlug={project.slug} amount={price} />
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        Ada kendala?{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline">Hubungi kami di WhatsApp</a>
      </p>
    </section>
  );
}
