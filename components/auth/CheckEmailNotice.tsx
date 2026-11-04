"use client";

import { Button, LinkButton } from "@/components/ui/Button";
import ResendConfirmation from "@/components/auth/ResendConfirmation";
import { WHATSAPP_URL } from "@/lib/site-config";

// Shown right after a new learner registers, instead of silently sending them to the login form.
// What they must do next (open the email, click the link) is the most likely place to get stuck,
// so it is spelled out, with the usual reasons an email does not arrive.
export default function CheckEmailNotice({
  email,
  onChangeEmail,
  cooldownSeconds,
}: {
  email: string;
  onChangeEmail: () => void;
  cooldownSeconds?: number;
}) {
  return (
    <section className="mx-auto max-w-md px-6 py-16" aria-labelledby="check-email-title">
      <h1 id="check-email-title" className="font-display text-2xl font-semibold text-ink">
        Pendaftaran berhasil! Sekarang cek email kamu
      </h1>
      <p className="mt-3 text-ink-soft">
        Kami sudah mengirim email konfirmasi dari PyMula ke <strong className="break-all text-ink">{email}</strong>.
        Akunmu baru aktif setelah kamu mengklik tautan di dalam email itu.
      </p>

      <ol className="mt-5 list-decimal space-y-2 pl-5 text-ink-soft">
        <li>Buka email dari PyMula di kotak masukmu.</li>
        <li>Klik tautan konfirmasi di dalamnya.</li>
        <li>Setelah itu kamu bisa langsung mulai belajar. Jika kamu belum otomatis masuk, pakai tombol Masuk di bawah.</li>
      </ol>

      <div className="mt-6 rounded-lg border border-line bg-white/60 p-4">
        <p className="font-medium text-ink">Belum ada emailnya?</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>Tunggu beberapa menit. Kadang email datang terlambat.</li>
          <li>Periksa folder Spam, Junk, atau Promosi.</li>
          <li>Pastikan alamat di atas benar. Salah ketik? Pakai tombol Ganti email.</li>
          <li>Pernah mendaftar dengan email ini? Coba Masuk, atau pakai Lupa password.</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-3">
        <ResendConfirmation email={email} startCooldown cooldownSeconds={cooldownSeconds} />
        <Button type="button" variant="ghost" onClick={onChangeEmail}>
          Ganti email
        </Button>
      </div>

      <p className="mt-8 text-sm text-ink-soft">Sudah mengklik tautan di emailnya?</p>
      <LinkButton href="/login" className="mt-2">
        Masuk
      </LinkButton>

      <p className="mt-8 text-xs text-ink-soft">
        Masih belum ada setelah 10 menit?{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline">
          Hubungi kami di WhatsApp
        </a>
        .
      </p>
    </section>
  );
}
