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
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {TOC.map((t, index) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-ink transition-colors hover:bg-sun/10 hover:underline"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun/20 text-xs font-medium">
                  {index + 1}
                </span>
                <span>{t.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="apa-itu" title="Apa itu PyMula">
        <p>
          {SITE_NAME} adalah platform belajar Python untuk pemula, sepenuhnya dalam Bahasa Indonesia. Setiap
          lesson berisi penjelasan singkat, contoh, lalu latihan berupa kuis atau soal kode yang diperiksa
          otomatis. Kamu bisa menulis dan menjalankan kode Python langsung di browser tanpa perlu menginstal
          Python di perangkatmu.
        </p>
        <p>
          Saat ini tersedia satu kursus, <strong>Python Dasar</strong>, terdiri dari 13 chapter mulai dari, 
          pengenalan Python hingga struktur data dasar. Chapter 1–5 gratis. Chapter 1–5 gratis, sedangkan Chapter 6–13 dapat diakses
          dengan satu kali pembayaran.
        </p>
        <p>
          Kode yang kamu tulis dijalankan di browser pada perangkatmu. Draf kode disimpan di browser tersebut,
          sedangkan progres belajar, termasuk pelajaran yang sudah kamu selesaikan, tersimpan di akunmu.
        </p>
      </Section>

      <Section id="pengelola" title="Siapa yang mengelola">
        <p>
           {SITE_NAME} dikembangkan sebagai proyek mahasiswa. Karena layanan ini dikelola dengan sumber daya yang
          terbatas, kami berusaha menjelaskan batasan dan masa layanan secara terbuka. Sebelum membeli chapter
          berbayar, silakan baca informasi masa layanan dan kebijakan pengembalian dana di bawah.
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
              Penutupan diumumkan minimal {MIN_NOTICE_DAYS} hari sebelumnya. Pembelian dalam {REFUND_DAYS} hari
              terakhir sebelum penutupan berhak mendapat pengembalian dana penuh.
            </li>
          </ul>
        </div>
        <p>
          Domain, basis data, dan hosting dibiayai pengelola sendiri. Setelah layanan ditutup, layanan pendukung tersebut tidak akan diperpanjang.
          Tanggal {end} adalah batas
          maksimal yang direncanakan, bukan jaminan bahwa layanan pasti tersedia sampai tanggal tersebut.
          PyMula dapat ditutup lebih awal apabila layanan tidak lagi dapat dipertahankan.
        </p>
        <p>Pemberitahuan penutupan dilakukan dengan cara berikut:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Pop-up di situs direncanakan muncul {NOTICE_DAYS} hari sebelum tanggal akhir yang direncanakan. Ini
            memberi cadangan waktu di atas pemberitahuan minimum {MIN_NOTICE_DAYS} hari.
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
            Chapter 6–13: Rp{price}, sekali bayar. Akses berlaku selama layanan tersedia (lihat bagian status di
            atas).
          </li>
          <li>Pembayaran dilakukan melalui QRIS menggunakan e-wallet atau mobile banking yang mendukung QRIS.</li>
        </ul>
        <p>
          Setelah membayar, unggah bukti pembayaran melalui halaman pembelian. Bukti tersebut akan diperiksa secara
          manual oleh pengelola, dan chapter berbayar akan dibuka untuk akunmu setelah pembayaran terverifikasi. Proses verifikasi
          dilakukan maksimal 1 × 24 jam sejak bukti pembayaran dikirim. Jika statusnya belum berubah setelah 24 jam,
          hubungi kami melalui WhatsApp.
        </p>
        <p>Setelah pembayaran diverifikasi, kami menghapus bukti pembayaranmu dari sistem.</p>
      </Section>

      <Section id="refund" title="Refund">
        <p>
          <strong>
            Pembelian yang dilakukan dalam {REFUND_DAYS} hari terakhir sebelum tanggal penutupan layanan berhak
            mendapatkan pengembalian dana penuh.
          </strong>{" "}
          Caranya: hubungi kami lewat WhatsApp dengan bukti pembayaran dan waktu pembayarannya.
        </p>
        <p>
          Penjualan chapter berbayar ditutup {SALES_CLOSE_DAYS} hari sebelum tanggal akhir yang direncanakan
          ({end}). Karena itu, ketentuan refund ini terutama berlaku jika layanan berakhir lebih awal. Pengajuan
          refund yang memenuhi ketentuan tetap dapat disampaikan melalui WhatsApp sampai {claimUntil}.
        </p>
        <p>
          Untuk kendala pembayaran lainnya, misalnya sudah membayar tetapi chapter belum terbuka, hubungi kami dan
          akan kami bantu selesaikan.
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
          jumlah, status, tanggal) untuk pembukuan. Penghapusan akun tidak mengembalikan akses
          chapter berbayar; jika kamu mendaftar lagi, kamu harus memulai progres dari awal.
        </p>
        <p>
          Layanan pihak ketiga yang digunakan PyMula meliputi Supabase (akun dan data), Vercel (hosting dan statistik
          kunjungan agregat), dan Brevo (pengiriman email seperti reset password).
        </p>
      </Section>

      <Section id="penutupan" title="Jika layanan ditutup">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Pemberitahuan:</strong> pengguna akan diberi tahu setidaknya {MIN_NOTICE_DAYS} hari sebelumnya
            melalui pop-up di situs. Penjualan chapter berbayar ditutup.
          </li>
          <li>
            <strong>Pada tanggal penutupan</strong>, situs tidak lagi dapat digunakan. Seluruh akun dan data
            pengguna dihapus. Catatan transaksi tanpa identitas disimpan untuk pembukuan.
          </li>
          <li>
            <strong>Domain pymula.live tidak diperpanjang.</strong> Alamat email dengan domain tersebut juga akan
            berhenti berfungsi. Pengguna tetap bisa menghubungi pengelola lewat WhatsApp setelah penutupan.
          </li>
          <li>
            <strong>Refund</strong> pembelian dalam {REFUND_DAYS} hari terakhir tetap bisa diajukan lewat
            WhatsApp sampai {claimUntil}.
          </li>
        </ol>
      </Section>

      <Section id="kontak" title="Kontak">
        <p>Karena PyMula dikelola dengan sumber daya yang terbatas, balasan mungkin tidak selalu langsung. Kami akan
          berusaha membalas secepat mungkin.</p>
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
          Email dengan domain pymula.live akan berhenti berfungsi ketika domain tersebut tidak lagi aktif. WhatsApp tetap bisa dihubungi setelah
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
              Akses berlaku selama PyMula tersedia, dengan tanggal akhir yang direncanakan paling lambat {end}.
              Layanan dapat berakhir lebih awal dengan pemberitahuan setidaknya {MIN_NOTICE_DAYS} hari sebelumnya.
              Akses tidak berlaku selamanya.
            </p>
          </Faq>
          <Faq q="Apa yang terjadi kalau PyMula ditutup?">
            <p>
              Pengguna akan diberi tahu setidaknya {MIN_NOTICE_DAYS} hari sebelumnya. Setelah tanggal penutupan,
              situs tidak lagi dapat digunakan dan akun beserta data pengguna dihapus. Lihat bagian{" "}
              <a href="#penutupan" className="underline">
                Jika layanan ditutup
              </a>
              .
            </p>
          </Faq>
          <Faq q="Saya baru membeli, lalu layanan ditutup. Bagaimana?">
            <p>
              Pembelian yang dilakukan dalam {REFUND_DAYS} hari terakhir sebelum penutupan berhak mendapat
              pengembalian dana penuh sesuai ketentuan. Hubungi kami melalui WhatsApp dengan bukti pembayaran.
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
              Verifikasi dilakukan secara manual dan diproses maksimal 1 × 24 jam sejak bukti pembayaran dikirim.
              Jika status belum berubah setelah 24 jam, hubungi kami melalui WhatsApp dan sertakan email akunmu.
            </p>
          </Faq>
          <Faq q="Bukti pembayaran saya ditolak.">
            <p>
              Kamu bisa mengunggah ulang bukti yang lebih jelas melalui halaman pembelian. Jika kamu merasa bukti
              sudah benar atau masih mengalami kendala, hubungi kami melalui WhatsApp.
            </p>
          </Faq>
          <Faq q="Bisakah saya mengunduh materinya?">
            {DOWNLOADS_AVAILABLE ? (
              <p>Bisa. Materi dapat diunduh per chapter dari halaman chapter.</p>
            ) : (
              <p>
                Belum tersedia. Fitur unduh materi per chapter masih direncanakan; informasi akan diperbarui di
                situs jika fitur tersebut sudah tersedia.
              </p>
            )}
          </Faq>
          <Faq q="Bagaimana data saya diperlakukan?">
            <p>
              Lihat bagian{" "}
              <a href="#data" className="underline">
                Data & privasi
              </a>
              . Singkatnya, kami menyimpan email, nama, progres belajar, dan catatan pembelian. Bukti pembayaran
              dihapus setelah verifikasi, sedangkan akun dan data pengguna direncanakan dihapus saat layanan
              ditutup. Catatan transaksi tanpa identitas tetap disimpan untuk pembukuan.
            </p>
          </Faq>
          <Faq q="Bagaimana menghapus akun?">
            <p>
              Buka halaman <Link href="/akun" className="underline">Akun</Link>, lalu pilih “Hapus akun” dan masukkan
              password. Jika masih ada pembayaran yang menunggu verifikasi, akun baru dapat dihapus setelah
              pembayaran tersebut diproses. Jika mendaftar lagi, akses chapter berbayar tidak akan dipulihkan.
            </p>
          </Faq>
          <Faq q="Saya lupa password.">
            <p>
              Di halaman <Link href="/login" className="underline">masuk</Link>, pilih “Lupa password?”, lalu
              masukkan emailmu. Kami akan mengirim tautan untuk membuat password baru. Buka tautan tersebut 
              dan periksa folder spam jika email belum masuk.
            </p>
          </Faq>
          <Faq q="Kodeku hilang setelah saya menutup browser.">
            <p>
              Draf kode disimpan di browser pada perangkat yang kamu gunakan. Jika data browser dihapus atau kamu
              berganti perangkat, draf tersebut tidak ikut berpindah. Progres pelajaran yang sudah selesai tetap
              tersimpan di akunmu.
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
              PyMula ditujukan untuk browser modern di desktop maupun handphone. Saat pertama kali membuka latihan
              kode, browser perlu mengunduh komponen Python berukuran beberapa megabita, sehingga koneksi internet
              diperlukan. Setelah komponen dimuat, akses berikutnya dapat terasa lebih cepat.
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
