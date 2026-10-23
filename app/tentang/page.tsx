import Link from "next/link";
import type { ReactNode } from "react";
import { getCoursePrice, PYTHON_DASAR_COURSE_SLUG } from "@/content/pricing";
import {
  CONTACT_EMAIL,
  DOWNLOADS_AVAILABLE,
  MIN_NOTICE_DAYS,
  NOTICE_DAYS,
  OWNER_NAME,
  REFUND_CLAIM_DAYS_AFTER_END,
  REFUND_DAYS,
  SALES_CLOSE_DAYS,
  SERVICE_END_ISO,
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  dateAfter,
  formatDateId,
} from "@/lib/site-config";

export const metadata = {
  title: "Tentang & FAQ",
  description: "Tentang PyMula: siapa yang mengelola, masa layanan, harga, refund, privasi, dan pertanyaan umum.",
  alternates: { canonical: "/tentang" },
};

const TOC = [
  { id: "apa-itu", label: "Apa itu PyMula" },
  { id: "pengelola", label: "Siapa yang mengelola" },
  { id: "status", label: "Status & masa layanan" },
  { id: "harga", label: "Harga & pembayaran" },
  { id: "refund", label: "Refund" },
  { id: "data", label: "Data & privasi" },
  { id: "penutupan", label: "Jika layanan ditutup" },
  { id: "kontak", label: "Kontak" },
  { id: "faq", label: "FAQ" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-6 border-t border-line pt-8">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-ink">{children}</div>
    </section>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="group border-b border-line py-3">
      <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
        <span className="mr-2 inline-block text-ink-soft transition-transform group-open:rotate-90">›</span>
        {q}
      </summary>
      <div className="mt-2 space-y-2 pl-5 text-sm text-ink-soft">{children}</div>
    </details>
  );
}

export default function TentangPage() {
  const price = getCoursePrice(PYTHON_DASAR_COURSE_SLUG).toLocaleString("id-ID");
  const end = formatDateId(SERVICE_END_ISO);
  const claimUntil = formatDateId(dateAfter(SERVICE_END_ISO, REFUND_CLAIM_DAYS_AFTER_END));

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Tentang {SITE_NAME}</h1>
      <p className="mt-2 text-lg text-ink-soft">
        Belajar Python dalam Bahasa Indonesia, dengan latihan yang langsung dijalankan di browser.
      </p>

      <nav aria-label="Isi halaman" className="mt-8 rounded-lg border border-line bg-white/60 p-5">
        <p className="text-sm font-medium text-ink">Isi halaman ini</p>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {TOC.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="underline hover:text-ink">
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="apa-itu" title="Apa itu PyMula">
        <p>
          {SITE_NAME} adalah platform belajar Python untuk pemula, sepenuhnya dalam Bahasa Indonesia. Setiap
          lesson berisi penjelasan singkat, contoh, lalu latihan berupa kuis atau soal kode yang diperiksa
          otomatis. Kamu menulis dan menjalankan kode Python langsung di browser, tanpa menginstal apa pun.
        </p>
        <p>
          Saat ini tersedia satu kursus, <strong>Python Dasar</strong>, terdiri dari 13 chapter dari nol sampai
          struktur data dasar. Chapter 1–5 gratis. Chapter 6–13 dibuka dengan sekali bayar.
        </p>
        <p>
          Kode yang kamu tulis dijalankan di browsermu sendiri. Draf kodemu disimpan di browser itu, dan yang
          tersimpan di akunmu hanyalah lesson mana saja yang sudah kamu selesaikan.
        </p>
      </Section>

      <Section id="pengelola" title="Siapa yang mengelola">
        <p>
          {SITE_NAME} dibuat dan dikelola sendirian sebagai proyek mahasiswa. Tidak ada tim besar atau
          perusahaan di belakangnya. Karena itu kami terbuka soal batasannya, terutama tentang berapa lama
          layanan ini akan berjalan. Bacalah bagian berikutnya sebelum membeli.
        </p>
        {OWNER_NAME && (
          <p>
            Pengelola: <strong>{OWNER_NAME}</strong>.
          </p>
        )}
      </Section>

      <Section id="status" title="Status & masa layanan">
        <div className="rounded-lg border border-sun bg-sun/10 p-5 text-sm">
          <p className="font-medium">Singkatnya</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              {SITE_NAME} direncanakan berjalan <strong>paling lama sampai {end}</strong>.
            </li>
            <li>Layanan bisa berhenti lebih awal dari tanggal itu.</li>
            <li>
              Kami <strong>tidak menjanjikan “akses selamanya”</strong>. Akses berlaku selama layanan berjalan.
            </li>
            <li>
              Penutupan diumumkan minimal {MIN_NOTICE_DAYS} hari sebelumnya, dan pembelian dalam {REFUND_DAYS} hari
              terakhir bisa di-refund penuh.
            </li>
          </ul>
        </div>
        <p>
          Domain, basis data, dan hosting dibiayai pengelola sendiri. Setelah layanan ditutup, semuanya tidak
          diperpanjang. Tanggal {end} adalah batas maksimal yang kami rencanakan, bukan jaminan: pengelola
          sendirian dan tidak bisa memastikan masih sanggup memeliharanya sampai selama itu.
        </p>
        <p>Pemberitahuan penutupan dilakukan dengan cara berikut:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Pop-up di situs yang muncul otomatis mulai {NOTICE_DAYS} hari sebelum tanggal akhir (janji kami
            minimal {MIN_NOTICE_DAYS} hari, sisanya sebagai cadangan waktu).
          </li>
          <li>Email ke pengguna terdaftar.</li>
          <li>Penjualan chapter berbayar ditutup sejak pemberitahuan dimulai.</li>
        </ul>
        {DOWNLOADS_AVAILABLE ? (
          <p>Selama masa pemberitahuan, kamu bisa mengunduh materi per chapter.</p>
        ) : (
          <p>
            Fitur unduh materi per chapter sedang direncanakan, tetapi <strong>belum tersedia</strong>. Kami akan
            mengumumkannya di situs ini begitu ada.
          </p>
        )}
      </Section>

      <Section id="harga" title="Harga & pembayaran">
        <ul className="list-disc space-y-1 pl-5">
          <li>Chapter 1–5: gratis, cukup mendaftar.</li>
          <li>
            Chapter 6–13: Rp{price}, sekali bayar. Akses berlaku selama layanan berjalan (lihat bagian status di
            atas).
          </li>
          <li>Pembayaran lewat QRIS dari e-wallet atau m-banking apa pun yang mendukungnya.</li>
        </ul>
        <p>
          Setelah membayar, kamu mengunggah bukti pembayaran di halaman pembelian. Pengelola memeriksanya secara
          manual, lalu membuka chapter berbayar untuk akunmu. Selama diperiksa, statusnya “menunggu verifikasi”.
          Kalau terasa lama, hubungi kami lewat WhatsApp.
        </p>
        <p>Setelah pembayaran diverifikasi, kami menghapus bukti pembayaranmu dari sistem.</p>
      </Section>

      <Section id="refund" title="Refund">
        <p>
          <strong>
            Pembelian dalam {REFUND_DAYS} hari terakhir sebelum tanggal penutupan layanan di-refund penuh.
          </strong>{" "}
          Caranya: hubungi kami lewat WhatsApp dengan bukti pembayaran dan waktu pembayarannya.
        </p>
        <p>
          Pada tanggal akhir yang direncanakan ({end}), penjualan sudah ditutup {SALES_CLOSE_DAYS} hari
          sebelumnya, jadi aturan ini terutama berlaku kalau layanan ditutup lebih awal dari rencana. Setelah
          penutupan, permintaan refund tetap diterima lewat WhatsApp sampai {claimUntil}.
        </p>
        <p>
          Untuk kendala pembayaran lainnya, misalnya sudah membayar tetapi chapter belum terbuka, hubungi kami dan
          kami bantu selesaikan.
        </p>
      </Section>

      <Section id="data" title="Data & privasi">
        <p>Yang kami simpan tentangmu:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Email dan nama yang kamu isi saat mendaftar.</li>
          <li>Password, dalam bentuk yang tidak bisa kami baca (hanya hasil enkripsi satu arah).</li>
          <li>Lesson yang sudah kamu selesaikan.</li>
          <li>Catatan pembelian: kursus, jumlah, status, dan tanggal.</li>
        </ul>
        <p>
          Bukti pembayaran dihapus setelah diverifikasi. Kode yang kamu tulis dijalankan dan disimpan di
          browsermu, bukan di server kami.
        </p>
        <p>
          Kamu bisa menghapus akunmu kapan saja di halaman <Link href="/akun" className="underline">Akun</Link>.
          Akun, nama, dan progres belajarmu dihapus. Catatan transaksi tetap disimpan tanpa identitas (kursus,
          jumlah, status, tanggal) untuk pembukuan. Menghapus akun tidak mengembalikan akses chapter berbayar:
          kalau kamu mendaftar ulang, kamu mulai dari awal.
        </p>
        <p>
          Layanan pihak ketiga yang kami pakai: Supabase (akun dan data), Vercel (hosting dan statistik
          kunjungan agregat), dan Brevo (pengiriman email seperti reset password).
        </p>
      </Section>

      <Section id="penutupan" title="Jika layanan ditutup">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Pemberitahuan</strong> minimal {MIN_NOTICE_DAYS} hari sebelumnya lewat pop-up di situs dan
            email. Penjualan chapter berbayar ditutup.
          </li>
          <li>
            <strong>Pada tanggal penutupan</strong>, situs tidak lagi bisa dipakai. Seluruh akun dan data
            pengguna dihapus. Catatan transaksi tanpa identitas disimpan pengelola untuk pembukuan.
          </li>
          <li>
            <strong>Domain pymula.live tidak diperpanjang.</strong> Alamat email di domain itu ikut berhenti.
            Kami berusaha menjaga satu halaman pemberitahuan sederhana tetap bisa dibuka di alamat cadangan
            gratis dari penyedia hosting.
          </li>
          <li>
            <strong>Refund</strong> pembelian dalam {REFUND_DAYS} hari terakhir tetap bisa diajukan lewat
            WhatsApp sampai {claimUntil}.
          </li>
        </ol>
      </Section>

      <Section id="kontak" title="Kontak">
        <p>Pengelola hanya satu orang, jadi balasan tidak selalu instan. Kami membalas secepat yang kami bisa.</p>
        <ul className="space-y-2">
          <li>
            WhatsApp:{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium underline">
              {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
        <p className="text-sm text-ink-soft">
          Email di domain pymula.live berhenti berfungsi bersama domainnya. WhatsApp tetap bisa dihubungi setelah
          penutupan.
        </p>
      </Section>

      <Section id="faq" title="FAQ">
        <div className="-mt-2 border-t border-line">
          <Faq q="Apa bedanya chapter gratis dan berbayar?">
            <p>
              Chapter 1–5 gratis untuk semua yang sudah mendaftar. Chapter 6–13 dibuka dengan sekali bayar Rp
              {price}.
            </p>
          </Faq>
          <Faq q="Apakah saya perlu menginstal Python?">
            <p>Tidak. Kode Python dijalankan di browsermu, jadi cukup membuka situs ini.</p>
          </Faq>
          <Faq q="Berapa lama akses chapter berbayar berlaku?">
            <p>
              Selama PyMula berjalan, direncanakan paling lama sampai {end}. Layanan bisa berhenti lebih awal
              dengan pemberitahuan minimal {MIN_NOTICE_DAYS} hari. Tidak ada akses selamanya.
            </p>
          </Faq>
          <Faq q="Apa yang terjadi kalau PyMula ditutup?">
            <p>
              Kamu diberi tahu minimal {MIN_NOTICE_DAYS} hari sebelumnya. Setelah tanggal penutupan situs tidak
              bisa dipakai dan akun beserta datanya dihapus. Lihat bagian{" "}
              <a href="#penutupan" className="underline">
                Jika layanan ditutup
              </a>
              .
            </p>
          </Faq>
          <Faq q="Saya baru membeli, lalu layanan ditutup. Bagaimana?">
            <p>
              Pembelian dalam {REFUND_DAYS} hari terakhir sebelum penutupan di-refund penuh. Hubungi WhatsApp
              dengan bukti pembayaranmu.
            </p>
          </Faq>
          <Faq q="Bagaimana cara membayar?">
            <p>
              Buka halaman pembelian, scan kode QRIS dengan e-wallet atau m-banking, lalu unggah bukti
              pembayarannya.
            </p>
          </Faq>
          <Faq q="Pembayaran saya belum diverifikasi.">
            <p>
              Verifikasi dilakukan manual oleh pengelola. Kalau sudah lama menunggu, hubungi kami lewat WhatsApp
              dengan menyebut email akunmu.
            </p>
          </Faq>
          <Faq q="Bukti pembayaran saya ditolak.">
            <p>
              Biasanya karena bukti kurang jelas. Kirim ulang bukti yang lebih jelas di halaman pembelian, atau
              hubungi kami lewat WhatsApp.
            </p>
          </Faq>
          <Faq q="Bisakah saya mengunduh materinya?">
            {DOWNLOADS_AVAILABLE ? (
              <p>Bisa, per chapter, dari halaman chapter.</p>
            ) : (
              <p>
                Belum. Unduhan materi per chapter sedang direncanakan dan akan diumumkan di situs ini begitu
                tersedia.
              </p>
            )}
          </Faq>
          <Faq q="Bagaimana data saya diperlakukan?">
            <p>
              Lihat bagian{" "}
              <a href="#data" className="underline">
                Data & privasi
              </a>
              . Singkatnya: kami menyimpan email, nama, progres, dan catatan pembelian; bukti pembayaran dihapus
              setelah diverifikasi; semua data pengguna dihapus saat penutupan.
            </p>
          </Faq>
          <Faq q="Bagaimana menghapus akun?">
            <p>
              Buka halaman <Link href="/akun" className="underline">Akun</Link>, lalu pilih “Hapus akun”. Kamu
              perlu memasukkan password. Kalau masih ada pembayaran yang menunggu verifikasi, akun baru bisa
              dihapus setelah pembayaran itu diproses. Akses chapter berbayar tidak ikut kembali kalau kamu
              mendaftar lagi.
            </p>
          </Faq>
          <Faq q="Saya lupa password.">
            <p>
              Di halaman <Link href="/login" className="underline">masuk</Link>, pilih “Lupa password?”, lalu
              masukkan emailmu. Kami mengirim link untuk membuat password baru. Buka link-nya di browser yang
              sama dengan yang kamu pakai untuk memintanya, dan periksa folder spam kalau email belum terlihat.
            </p>
          </Faq>
          <Faq q="Kodeku hilang setelah saya menutup browser.">
            <p>
              Draf kodemu disimpan di browser pada perangkat itu. Kalau data browser dihapus atau kamu berganti
              perangkat, draf tidak ikut. Lesson yang sudah selesai tetap tersimpan di akunmu.
            </p>
          </Faq>
          <Faq q="Program saya tidak berhenti-berhenti (loop tak berujung).">
            <p>
              Program yang berjalan terlalu lama dihentikan otomatis setelah beberapa detik, dan kamu juga bisa
              menekan tombol “Hentikan”. Periksa kondisi loop-nya, lalu jalankan lagi.
            </p>
          </Faq>
          <Faq q="Browser dan perangkat apa yang didukung?">
            <p>
              Browser modern di desktop maupun HP. Saat pertama kali membuka latihan kode, browser mengunduh
              komponen Python berukuran beberapa megabita, jadi butuh koneksi internet; setelahnya lebih cepat.
            </p>
          </Faq>
          <Faq q="Bagaimana menghubungi pengelola?">
            <p>
              Lewat WhatsApp {WHATSAPP_DISPLAY} atau email {CONTACT_EMAIL}. Lihat bagian{" "}
              <a href="#kontak" className="underline">
                Kontak
              </a>
              .
            </p>
          </Faq>
        </div>
      </Section>
    </article>
  );
}
