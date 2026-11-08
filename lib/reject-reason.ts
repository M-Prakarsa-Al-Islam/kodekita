// The reason an admin gives when rejecting a payment, shown to the learner so they know
// what to fix. Kept pure so the rules are unit-tested (scripts/test-reject-reason.mjs).

export const REJECT_REASON_MIN = 3;
export const REJECT_REASON_MAX = 300; // matches the CHECK in supabase/schema_phase6_reject_reason.sql

// Suggestions for the admin's input (a <datalist>): tapping one beats typing on a phone.
// The admin may still write anything.
export const REJECT_REASON_PRESETS = [
  "Nominal pembayaran tidak sesuai harga kursus",
  "Bukti pembayaran tidak jelas atau terpotong",
  "Pembayaran belum kami terima",
  "Bukti pembayaran bukan untuk QRIS PyMula",
  "Bukti pembayaran sudah pernah dipakai",
];

// Trims and tidies the text. Returns null when it is not usable (too short or too long).
export function cleanRejectReason(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.replace(/\s+/g, " ").trim();
  if (text.length < REJECT_REASON_MIN || text.length > REJECT_REASON_MAX) return null;
  return text;
}
