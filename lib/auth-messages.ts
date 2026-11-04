import { RESEND_COOLDOWN_SECONDS } from "@/lib/password-reset";

// Supabase's auth errors are English and written for developers ("Email not confirmed").
// A new learner needs to know what to DO. Pure functions, tested in scripts/test-auth-messages.mjs.
export type AuthErrorLike = { message?: string; code?: string; status?: number; name?: string } | null | undefined;

export type AuthProblemKind = "unconfirmed" | "credentials" | "exists" | "weak_password" | "rate_limit" | "bad_email" | "network" | "other";
export type AuthProblem = { kind: AuthProblemKind; message: string };

export function describeAuthError(err: AuthErrorLike): AuthProblem | null {
  if (!err) return null;
  const code = (err.code ?? "").toLowerCase();
  const text = `${err.message ?? ""}`;
  const has = (re: RegExp) => re.test(text);

  if (code === "email_not_confirmed" || has(/email not confirmed/i)) {
    return { kind: "unconfirmed", message: "Email kamu belum dikonfirmasi. Buka email dari PyMula, klik tautan konfirmasinya, lalu coba masuk lagi." };
  }
  if (code === "invalid_credentials" || has(/invalid login credentials/i)) {
    return { kind: "credentials", message: "Email atau password salah. Jika kamu baru mendaftar, pastikan kamu sudah mengklik tautan di email konfirmasi." };
  }
  if (code === "user_already_exists" || code === "email_exists" || has(/already (been )?registered|already exists/i)) {
    return { kind: "exists", message: "Email ini sudah terdaftar. Coba masuk, atau pakai Lupa password jika kamu lupa passwordnya." };
  }
  if (code === "weak_password" || has(/password should be at least|weak and easy to guess|weak password/i)) {
    return { kind: "weak_password", message: "Password terlalu pendek atau terlalu mudah ditebak. Pakai minimal 6 karakter dan hindari password yang umum." };
  }
  if (err.status === 429 || code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || has(/rate.?limit|too many requests|you can only request this after/i)) {
    return { kind: "rate_limit", message: "Terlalu banyak permintaan. Tunggu beberapa saat, lalu coba lagi." };
  }
  if (code === "email_address_invalid" || has(/email address .* is invalid|unable to validate email address/i)) {
    return { kind: "bad_email", message: "Alamat email tidak valid. Periksa penulisannya, lalu coba lagi." };
  }
  if (err.name === "AuthRetryableFetchError" || has(/failed to fetch|network|load failed/i)) {
    return { kind: "network", message: "Tidak bisa terhubung ke server. Periksa koneksimu, lalu coba lagi." };
  }
  return { kind: "other", message: `Terjadi kesalahan. Coba lagi sebentar lagi.${err.message ? ` (${err.message})` : ""}` };
}

// Seconds left before "send again" may be pressed (0 = may press now).
export function cooldownLeft(sentAt: number, now: number, total: number = RESEND_COOLDOWN_SECONDS): number {
  // max(0, ...) because `now` may be a moment older than `sentAt` (a clock sampled just before the send)
  const left = Math.ceil(total - Math.max(0, now - sentAt) / 1000);
  return left > 0 ? left : 0;
}
