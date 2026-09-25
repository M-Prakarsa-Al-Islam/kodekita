import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approvePurchase, rejectPurchase } from "./actions";

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
        supabase.storage.from("payment-proofs").createSignedUrl(p.proof_path, 300),
        supabase.from("profiles").select("name").eq("id", p.user_id).single(),
      ]);
      return {
        ...p,
        proofUrl: signed?.signedUrl ?? null,
        submitterName: submitter?.name || p.user_id,
      };
    })
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Verifikasi Pembayaran</h1>
      <p className="mt-2 text-ink-soft">{withDetails.length} menunggu verifikasi.</p>

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

            <div className="mt-4 flex gap-3">
              <form action={approvePurchase}>
                <input type="hidden" name="id" value={p.id} />
                <button className="rounded-md bg-code px-4 py-2 text-sm font-medium text-white hover:bg-code/90">
                  Setujui
                </button>
              </form>
              <form action={rejectPurchase}>
                <input type="hidden" name="id" value={p.id} />
                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Tolak
                </button>
              </form>
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
