// Pure logic for "lupa password": no Supabase / Next imports, so
// scripts/test-password-reset.mjs runs this exact code with fakes.
//
// Flow: /lupa-password (enter email) -> Supabase emails a link -> the link
// opens /auth/callback (code exchange or token_hash check) -> we set a short
// "recovery" cookie and send the learner to /reset-password -> new password.
// The cookie matters: a recovery session is a normal signed-in session, and
// /reset-password changes the password WITHOUT asking for the old one, so it
// must only work right after a real email link, never for an ordinary session.

import { validateNewPassword, mapPasswordUpdateError, type ActionResult } from "./account";

export const FORGOT_PAGE_PATH = "/lupa-password";
export const RESET_PAGE_PATH = "/reset-password";
export const CALLBACK_PATH = "/auth/callback";
export const LINK_ERROR_PATH = `${FORGOT_PAGE_PATH}?error=link`;
export const RECOVERY_COOKIE = "pymula_recovery";
export const RECOVERY_COOKIE_MAX_AGE = 15 * 60; // seconds
// Set after a SUCCESSFUL reset so /reset-password keeps showing the success
// message (instead of bouncing to "link tidak valid") however often the page
// re-renders. Purely a display flag; it grants nothing.
export const RESET_DONE_COOKIE = "pymula_reset_done";
export const RESET_DONE_COOKIE_MAX_AGE = 10 * 60; // seconds
export const RESEND_COOLDOWN_SECONDS = 60;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Where Supabase sends the learner after the email link. This exact URL must be
// in Supabase -> Authentication -> URL Configuration -> Redirect URLs.
export function buildResetRedirect(origin: string): string {
  return `${origin.replace(/\/+$/, "")}${CALLBACK_PATH}?next=${encodeURIComponent(RESET_PAGE_PATH)}`;
}

// Only these in-site paths can be the target after the callback. Anything
// else (absolute URLs, //evil.com, backslash tricks) falls back to "/".
const ALLOWED_NEXT = new Set([RESET_PAGE_PATH]);
export function safeNext(next: string | null | undefined): string {
  return next && ALLOWED_NEXT.has(next) ? next : "/";
}

export function mapResetError(err: { message?: string; code?: string; status?: number } | null | undefined): string | null {
  if (!err) return null;
  const text = `${err.code ?? ""} ${err.message ?? ""}`;
  if (err.status === 429 || /rate.?limit|too many|over_email_send_rate_limit/i.test(text)) {
    return "Terlalu banyak permintaan. Tunggu beberapa saat, lalu coba lagi.";
  }
  return "Gagal mengirim link. Periksa koneksimu, lalu coba lagi.";
}

export const RESET_SENT_MESSAGE =
  "Jika email itu terdaftar, kami sudah mengirim link untuk mengatur ulang password. " +
  "Cek kotak masuk dan folder spam, lalu buka link-nya di browser yang sama dengan yang kamu pakai sekarang.";

// ---- /auth/callback ---------------------------------------------------------
export type CallbackParams = {
  code?: string | null;
  tokenHash?: string | null;
  type?: string | null;
  next?: string | null;
};
export type CallbackDeps = {
  exchangeCode(code: string): Promise<boolean>;
  verifyRecoveryOtp(tokenHash: string): Promise<boolean>;
  markRecovery(): void | Promise<void>;
};

// Returns the in-site path to redirect to. Never throws.
export async function resolveCallback(params: CallbackParams, deps: CallbackDeps): Promise<string> {
  try {
    if (params.tokenHash) {
      // Cross-device friendly link (needs the email template change in README).
      if (params.type !== "recovery") return LINK_ERROR_PATH;
      if (!(await deps.verifyRecoveryOtp(params.tokenHash))) return LINK_ERROR_PATH;
      await deps.markRecovery();
      return RESET_PAGE_PATH;
    }
    if (params.code) {
      if (!(await deps.exchangeCode(params.code))) return LINK_ERROR_PATH;
      const next = safeNext(params.next);
      if (next === RESET_PAGE_PATH) await deps.markRecovery();
      return next;
    }
  } catch {
    /* fall through */
  }
  return LINK_ERROR_PATH;
}

// ---- /reset-password (the server action's logic) ------------------------------
// What /reset-password should show. Order matters: a fresh recovery link always
// wins (even if an old "done" flag is still around); after a successful reset the
// recovery cookie is gone, so the done flag keeps the success message on screen.
export type ResetPageView = "form" | "done" | "invalid";
export function resetPageView(s: { hasRecoveryCookie: boolean; hasDoneCookie: boolean; hasUser: boolean }): ResetPageView {
  if (s.hasRecoveryCookie && s.hasUser) return "form";
  if (s.hasDoneCookie) return "done";
  return "invalid";
}

export const RESET_SUCCESS_MESSAGE = "Password berhasil diubah. Kamu sudah masuk dengan password baru.";

export type ResetDeps = {
  hasRecoveryCookie(): boolean;
  getUserId(): Promise<string | null>;
  updatePassword(password: string): Promise<{ message?: string; code?: string } | null>; // null = ok
  clearRecoveryCookie(): void;
  markResetDone(): void;
  signOutOtherSessions(): Promise<void>;
};

const EXPIRED = "Link reset sudah kedaluwarsa atau tidak valid. Minta link baru.";

export async function resetPasswordFlow(
  deps: ResetDeps,
  input: { password: string; confirm: string }
): Promise<ActionResult> {
  const problem = validateNewPassword(input.password, input.confirm);
  if (problem) return { ok: false, message: problem };

  if (!deps.hasRecoveryCookie()) return { ok: false, message: EXPIRED };
  if (!(await deps.getUserId())) return { ok: false, message: EXPIRED };

  const error = await deps.updatePassword(input.password);
  if (error) return { ok: false, message: mapPasswordUpdateError(error) }; // cookie kept: the learner can retry

  deps.clearRecoveryCookie();
  deps.markResetDone();
  try {
    await deps.signOutOtherSessions();
  } catch {
    /* best effort */
  }
  return { ok: true, message: RESET_SUCCESS_MESSAGE };
}
