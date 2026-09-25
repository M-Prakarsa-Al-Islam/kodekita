import { createClient } from "@/lib/supabase/server";

export type PurchaseStatus = "none" | "pending" | "approved" | "rejected";

export type Purchase = {
  id: string;
  status: PurchaseStatus;
  createdAt: string;
  reviewedAt: string | null;
};

// Returns null if nobody is signed in (guest), otherwise the most
// recent purchase for that course — or a synthetic "none" record if
// the user has never attempted one. Ordered by created_at so a retry
// after a rejection correctly shows as the new pending/approved state.
export async function getLatestPurchase(courseSlug: string): Promise<Purchase | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("purchases")
    .select("id, status, created_at, reviewed_at")
    .eq("user_id", userData.user.id)
    .eq("course_slug", courseSlug)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { id: "", status: "none", createdAt: "", reviewedAt: null };
  }

  return {
    id: data.id,
    status: data.status as PurchaseStatus,
    createdAt: data.created_at,
    reviewedAt: data.reviewed_at,
  };
}

// Used for gating paid chapters — treats guests and non-approved
// purchases the same way (no access).
export async function hasApprovedPurchase(courseSlug: string): Promise<boolean> {
  const purchase = await getLatestPurchase(courseSlug);
  return purchase?.status === "approved";
}
