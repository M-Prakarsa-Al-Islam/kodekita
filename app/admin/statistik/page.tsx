import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadStats } from "@/lib/admin-stats-server";
import type { CourseStats, Stats } from "@/lib/admin-stats";

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function Bar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full min-w-[4rem] overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full bg-code" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </div>
  );
}

function SignupChart({ daily }: { daily: Stats["users"]["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex h-28 items-end gap-1" role="img" aria-label="Pendaftaran per hari, 14 hari terakhir">
      {daily.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.date}: ${d.count}`}>
          <span className="text-[10px] text-ink-soft">{d.count > 0 ? d.count : ""}</span>
          <div className="w-full rounded-t bg-sun" style={{ height: `${(d.count / max) * 70 + (d.count > 0 ? 4 : 1)}px` }} />
          <span className="text-[10px] text-ink-soft">{d.date.slice(8)}</span>
        </div>
      ))}
    </div>
  );
}

function CourseSection({ c }: { c: CourseStats }) {
  const never = c.lessons.filter((l) => l.done === 0);
  const lowest = [...c.lessons]
    .filter((l) => l.done > 0)
    .sort((a, b) => a.percentOfStarted - b.percentOfStarted || a.chapterTitle.localeCompare(b.chapterTitle))
    .slice(0, 8);
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-ink">{c.title}</h2>
      <p className="text-sm text-ink-soft">{c.lessonCount} pelajaran</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="Pembeli" value={c.buyers} hint={`${c.approved} disetujui · ${c.pending} menunggu · ${c.rejected} ditolak`} />
        <Card label="Pendapatan" value={rupiah(c.revenue)} />
        <Card label="Mulai belajar" value={c.started} hint={`rata-rata ${c.avgLessonsDone} pelajaran selesai`} />
        <Card label="Tamat kursus" value={c.completed} hint={`${c.completionPercent}% dari yang mulai`} />
      </div>
      {c.waitingToBuy > 0 && (
        <p className="mt-3 text-sm text-ink-soft">
          <strong className="text-ink">{c.waitingToBuy}</strong> peserta sudah menyelesaikan semua pelajaran gratis tetapi belum membeli.
        </p>
      )}

      <h3 className="mt-8 text-sm font-semibold text-ink">Per bab</h3>
      <div className="mt-2 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Bab</th>
              <th className="px-3 py-2 font-medium">Mulai</th>
              <th className="px-3 py-2 font-medium">Selesai</th>
              <th className="px-3 py-2 font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {c.chapters.map((ch) => {
              const p = ch.started === 0 ? 0 : Math.round((ch.completed / ch.started) * 100);
              return (
                <tr key={ch.chapterSlug} className="border-t border-line">
                  <td className="px-3 py-2 text-ink">{ch.chapterTitle}</td>
                  <td className="px-3 py-2">{ch.started}</td>
                  <td className="px-3 py-2">{ch.completed}</td>
                  <td className="w-28 px-3 py-2"><Bar percent={p} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {c.stuckAt.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold text-ink">Tempat peserta berhenti</h3>
          <p className="text-xs text-ink-soft">Pelajaran berikutnya yang belum selesai bagi peserta yang sudah mulai tetapi belum tamat.</p>
          <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-white text-sm">
            {c.stuckAt.map((s) => (
              <li key={`${s.chapterTitle}-${s.lessonId}`} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="text-ink">{s.chapterTitle} · {s.lessonId} {s.lessonTitle}</span>
                <span className="shrink-0 text-ink-soft">{s.count} orang</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {lowest.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold text-ink">Pelajaran paling jarang diselesaikan</h3>
          <p className="text-xs text-ink-soft">Persentase dari peserta yang sudah mulai kursus ini.</p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full text-left text-sm">
              <tbody>
                {lowest.map((l) => (
                  <tr key={`${l.chapterSlug}-${l.lessonId}`} className="border-t border-line first:border-t-0">
                    <td className="px-3 py-2 text-ink">{l.chapterTitle} · {l.lessonId} {l.lessonTitle}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{l.done} ({l.percentOfStarted}%)</td>
                    <td className="w-28 px-3 py-2"><Bar percent={l.percentOfStarted} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3 className="mt-8 text-sm font-semibold text-ink">Pelajaran yang belum diselesaikan siapa pun</h3>
      {never.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft">Tidak ada: setiap pelajaran sudah pernah diselesaikan.</p>
      ) : (
        <details className="mt-2 rounded-lg border border-line bg-white text-sm">
          <summary className="cursor-pointer px-3 py-2 text-ink">{never.length} pelajaran</summary>
          <ul className="divide-y divide-line border-t border-line">
            {never.map((l) => (
              <li key={`${l.chapterSlug}-${l.lessonId}`} className="px-3 py-2 text-ink">
                {l.chapterTitle} · {l.lessonId} {l.lessonTitle}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

export default async function AdminStatsPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) notFound();

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).single();
  // 404 for everybody who is not an admin, like /admin/purchases.
  if (!profile?.is_admin) notFound();

  let stats: Stats | null = null;
  let problem: string | null = null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    problem = "SUPABASE_SERVICE_ROLE_KEY belum diatur di environment server (lokal dan Vercel).";
  } else {
    try {
      stats = await loadStats();
    } catch (e) {
      problem = e instanceof Error ? e.message : "Gagal memuat statistik.";
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Statistik</h1>
        <Link href="/admin/purchases" className="text-sm text-ink-soft underline hover:text-ink">
          Verifikasi pembayaran
        </Link>
      </div>

      {problem || !stats ? (
        <p className="mt-6 rounded-lg border border-line bg-white p-4 text-sm text-ink">{problem}</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft">Dihitung saat halaman dibuka. Tanggal memakai waktu Jakarta (WIB).</p>

          <h2 className="mt-8 font-display text-xl font-semibold text-ink">Pengguna</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card label="Total terdaftar" value={stats.users.total} />
            <Card label="Daftar 7 hari" value={stats.users.last7} />
            <Card label="Daftar 30 hari" value={stats.users.last30} />
            <Card label="Aktif 7 hari" value={stats.users.active7} hint="menyelesaikan minimal 1 pelajaran" />
            <Card label="Belum mulai" value={stats.users.neverStarted} hint="belum menyelesaikan pelajaran apa pun" />
          </div>
          <div className="mt-4 rounded-lg border border-line bg-white p-4">
            <p className="mb-3 text-xs text-ink-soft">Pendaftaran per hari (14 hari terakhir)</p>
            <SignupChart daily={stats.users.daily} />
          </div>

          <h2 className="mt-12 font-display text-xl font-semibold text-ink">Penjualan (semua kursus)</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card label="Pendapatan" value={rupiah(stats.sales.revenue)} />
            <Card label="Pembeli unik" value={stats.sales.uniqueBuyers} hint={`${stats.sales.conversionPercent}% dari pengguna`} />
            <Card label="Pembelian disetujui" value={stats.sales.approved} />
            <Card label="Menunggu verifikasi" value={stats.sales.pending} />
            <Card label="Ditolak" value={stats.sales.rejected} />
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Pembelian dari akun yang sudah dihapus tetap masuk pendapatan, tetapi tidak dihitung sebagai pembeli unik.
          </p>

          {stats.courses.map((c) => (
            <CourseSection key={c.slug} c={c} />
          ))}
        </>
      )}
    </section>
  );
}
