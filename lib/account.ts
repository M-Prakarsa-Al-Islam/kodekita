// Pure logic for the account page ("/akun"): input rules and the ORDER of the
// delete-account steps. No Supabase or Next imports here, so
// scripts/test-account.mjs can run this exact code with fake dependencies.
// The real dependencies are wired in app/akun/actions.ts.

export const MIN_PASSWORD_LENGTH = 6; // same as the register form
export const MAX_PASSWORD_LENGTH = 72; // Supabase / bcrypt limit
export const MAX_NAME_LENGTH = 60;
export const DELETE_CONFIRM_WORD = "HAPUS";
export const PROOF_BUCKET = "payment-proofs";

export type ActionResult = { ok: true; message?: string } | { ok: false; message: string };

// "  Budi   Santoso " -> "Budi Santoso"; control characters become spaces.
export function normalizeName(raw: string): string {
  return String(raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Returns an error message, or null when the (already normalised) name is fine.
export function validateName(name: string): string | null {
  if (name.length === 0) return "Nama tidak boleh kosong.";
  if (name.length > MAX_NAME_LENGTH) return `Nama maksimal ${MAX_NAME_LENGTH} karakter.`;
  return null;
}

// Rules for the NEW password only (also used by the forgot-password reset,
// where there is no "current password").
export function validateNewPassword(next: string, confirm: string): string | null {
  if (next.length < MIN_PASSWORD_LENGTH) return `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  if (next.length > MAX_PASSWORD_LENGTH) return `Password baru maksimal ${MAX_PASSWORD_LENGTH} karakter.`;
  if (next !== confirm) return "Konfirmasi password tidak cocok.";
  return null;
}

export function validatePasswordChange(current: string, next: string, confirm: string): string | null {
  if (!current) return "Isi password saat ini.";
  const problem = validateNewPassword(next, confirm);
  if (problem) return problem;
  if (next === current) return "Password baru harus berbeda dari password saat ini.";
  return null;
}

// Supabase's updateUser errors are in English; show the learner Indonesian.
export function mapPasswordUpdateError(err: { message?: string; code?: string } | null | undefined): string {
  const text = `${err?.code ?? ""} ${err?.message ?? ""}`;
  if (/same_password|different from the old password/i.test(text)) {
    return "Password baru harus berbeda dari password lama.";
  }
  if (/weak_password|weak|at least \d+ characters|too short/i.test(text)) {
    return "Password terlalu lemah. Pakai kombinasi yang lebih sulit ditebak.";
  }
  return "Gagal mengubah password. Coba lagi.";
}

export function validateDeleteInput(password: string, confirmText: string): string | null {
  if (!password) return "Isi password untuk menghapus akun.";
  if (confirmText.trim() !== DELETE_CONFIRM_WORD) return `Ketik ${DELETE_CONFIRM_WORD} untuk mengonfirmasi.`;
  return null;
}

// ---------------------------------------------------------------------------
// Delete account. The order matters; every step before the last is harmless if
// a later step fails, so the learner can simply press the button again:
//   1. checks that change nothing (login, input, password, migration applied,
//      not an admin, no payment waiting for review)
//   2. remove the learner's payment-proof files from storage
//   3. clear note + proof path on their purchases (the row itself, the user
//      link and the access stay, so a failure after this loses nothing)
//   4. delete the auth user LAST. The FK (schema_phase5_account.sql) turns
//      purchases.user_id into NULL, the profile and the lesson progress cascade.
// ---------------------------------------------------------------------------
export type DeleteDeps = {
  getCurrentUser(): Promise<{ id: string; email: string } | null>;
  verifyPassword(email: string, password: string): Promise<boolean>;
  migrationReady(): Promise<boolean>;
  isAdmin(userId: string): Promise<boolean>;
  countPending(userId: string): Promise<number>;
  removeProofFiles(userId: string): Promise<void>;
  scrubPurchases(userId: string): Promise<void>;
  deleteAuthUser(userId: string): Promise<void>;
  log?(step: string, error: unknown): void;
};

const GENERIC_ERROR = "Terjadi kesalahan di server. Akunmu belum dihapus; coba lagi sebentar lagi.";

export async function deleteAccountFlow(
  deps: DeleteDeps,
  input: { password: string; confirmText: string }
): Promise<ActionResult> {
  const inputError = validateDeleteInput(input.password, input.confirmText);
  if (inputError) return { ok: false, message: inputError };

  let step = "start";
  try {
    step = "getCurrentUser";
    const user = await deps.getCurrentUser();
    if (!user) return { ok: false, message: "Kamu belum masuk." };

    step = "verifyPassword";
    if (!(await deps.verifyPassword(user.email, input.password))) {
      return { ok: false, message: "Password salah." };
    }

    step = "migrationReady";
    if (!(await deps.migrationReady())) {
      return {
        ok: false,
        message: "Penghapusan akun belum siap di server (migrasi database belum dijalankan). Akunmu tidak diubah.",
      };
    }

    step = "isAdmin";
    if (await deps.isAdmin(user.id)) {
      return { ok: false, message: "Akun admin tidak bisa dihapus dari halaman ini." };
    }

    step = "countPending";
    if ((await deps.countPending(user.id)) > 0) {
      return {
        ok: false,
        message:
          "Kamu masih punya pembayaran yang menunggu verifikasi. Tunggu sampai disetujui atau ditolak, baru hapus akun.",
      };
    }

    step = "removeProofFiles";
    await deps.removeProofFiles(user.id);

    step = "scrubPurchases";
    await deps.scrubPurchases(user.id);

    step = "deleteAuthUser";
    await deps.deleteAuthUser(user.id);

    return { ok: true };
  } catch (e) {
    deps.log?.(step, e);
    return { ok: false, message: GENERIC_ERROR };
  }
}
