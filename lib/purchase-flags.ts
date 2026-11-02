// What the account page must warn about, looking at the learner's purchases of
// EVERY course and project (not only Python Dasar). Pure, so it is unit tested.
export type PurchaseLike = { status: string } | null | undefined;

export function purchaseFlags(latestPerCourse: PurchaseLike[]): { hasPaidAccess: boolean; hasPendingPurchase: boolean } {
  return {
    hasPaidAccess: latestPerCourse.some((p) => p?.status === "approved"),
    hasPendingPurchase: latestPerCourse.some((p) => p?.status === "pending"),
  };
}
