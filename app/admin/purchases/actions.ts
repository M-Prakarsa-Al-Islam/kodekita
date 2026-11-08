"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { cleanRejectReason } from "@/lib/reject-reason";

// Uses the caller's own authenticated Supabase session (cookies), not
// a service-role key — the `purchases` RLS update policy only allows
// the row change when public.is_admin() is true for that session, so
// a non-admin's request is rejected at the database level even if
// this check were somehow bypassed.
async function requireAdmin() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Belum masuk.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Bukan admin.");

  return supabase;
}

export async function approvePurchase(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;

  await supabase
    .from("purchases")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/purchases");
}

export async function rejectPurchase(formData: FormData) {
  const supabase = await requireAdmin();
  const id = formData.get("id") as string;

  // The learner reads this to know what to fix, so it is required. The form enforces the
  // same limits in the browser; this is the check that cannot be bypassed.
  const reason = cleanRejectReason(formData.get("reason"));
  if (!reason) return;

  await supabase
    .from("purchases")
    .update({ status: "rejected", reject_reason: reason, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending"); // a double submit must not overwrite a decision already made

  revalidatePath("/admin/purchases");
}
