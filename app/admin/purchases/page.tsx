import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approvePurchase, rejectPurchase } from "./actions";
import { REJECT_REASON_MAX, REJECT_REASON_MIN, REJECT_REASON_PRESETS } from "@/lib/reject-reason";

export default async function AdminPurchasesPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .single();

  // 404 rather than a "not authorized" message — no point advertising
  // that this route exists to a logged-in non-admin.
  if (!profile?.is_admin) notFound();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, user_id, course_slug, amount, status, proof_path, note, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const rows = purchases ?? [];

  const withDetails = await Promise.all(
    rows.map(async (p) => {
      const [{ data: signed }, { data: submitter }] = await Promise.all([
        p.proof_path
          ? supabase.storage.from("payment-proofs").createSignedUrl(p.proof_path, 300)
          : Promise.resolve({ data: null }),
        p.user_id
          ? supabase.from("profiles").select("name").eq("id", p.user_id).single()
          : Promise.resolve({ data: null }),
      ]);
      return {
        ...p,
        proofUrl: signed?.signedUrl ?? null,
        submitterName: submitter?.name || p.user_id || "(akun dihapus)",
      };
    })
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Verifikasi Pembayaran</h1>
        <Link href="/admin/statistik" className="text-sm text-ink-soft underline hover:text-ink">
          Statistik
        </Link>
      </div>
      <p className="mt-2 text-ink-soft">{withDetails.length} menunggu verifikasi.</p>

      <datalist id="reject-reason-presets">
        {REJECT_REASON_PRESETS.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <div className="mt-8 space-y-6">
        {withDetails.map((p) => (
          <div key={p.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{p.submitterName}</p>
                <p className="text-sm text-ink-soft">
                  {p.course_slug} · Rp{p.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-ink-soft">
                  {new Date(p.created_at).toLocaleString("id-ID")}
                </p>
                {p.note && <p className="mt-2 text-sm text-ink">Catatan: {p.note}</p>}
              </div>
              {p.proofUrl && (
                <a href={p.proofUrl} target="_blank" rel="noreferrer" className="shrink-0">
                  <img
                    src={p.proofUrl}
                    alt="Bukti pembayaran"
                    className="h-24 w-24 rounded-md border border-line object-cover"
                  />
                </a>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-3">
              <form action={approvePurchase}>
                <input type="hidden" name="id" value={p.id} />
                <button className="rounded-md bg-code px-4 py-2 text-sm font-medium text-white hover:bg-code/90">
                  Setujui
                </button>
              </form>
              {/* Rejecting needs a reason the learner will read, so it opens a small form
                  instead of rejecting on one tap. */}
              <details className="w-full sm:w-auto">
                <summary className="cursor-pointer list-none rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700">
                  Tolak…
                </summary>
                <form action={rejectPurchase} className="mt-3 space-y-2">
                  <input type="hidden" name="id" value={p.id} />
                  <label htmlFor={`reason-${p.id}`} className="block text-xs text-ink-soft">
                    Alasan penolakan (dibaca peserta)
                  </label>
                  <input
                    id={`reason-${p.id}`}
                    name="reason"
                    list="reject-reason-presets"
                    required
                    minLength={REJECT_REASON_MIN}
                    maxLength={REJECT_REASON_MAX}
                    placeholder="Pilih saran atau tulis sendiri"
                    className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink sm:w-80"
                  />
                  <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Kirim penolakan
                  </button>
                </form>
              </details>
            </div>
          </div>
        ))}

        {withDetails.length === 0 && (
          <p className="text-sm text-ink-soft">Tidak ada pembayaran yang menunggu.</p>
        )}
      </div>
    </section>
  );
}
