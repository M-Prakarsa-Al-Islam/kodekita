"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStatelessClient } from "@/lib/supabase/stateless";
import {
  PROOF_BUCKET,
  deleteAccountFlow,
  mapPasswordUpdateError,
  normalizeName,
  validateName,
  validatePasswordChange,
  type ActionResult,
  type DeleteDeps,
} from "@/lib/account";

// Every action re-checks who is calling from the session cookie. Nothing here
// trusts a user id sent by the browser.

export async function updateName(rawName: string): Promise<ActionResult> {
  const name = normalizeName(rawName);
  const problem = validateName(name);
  if (problem) return { ok: false, message: problem };

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, message: "Kamu belum masuk." };

  // The name lives in two places: profiles.name (admin pages) and the auth
  // user's metadata (header / dashboard greeting). Keep both in step.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", data.user.id);
  if (profileError) return { ok: false, message: "Gagal menyimpan nama. Coba lagi." };

  const { error: metaError } = await supabase.auth.updateUser({ data: { name } });
  if (metaError) return { ok: false, message: "Gagal menyimpan nama. Coba lagi." };

  revalidatePath("/", "layout");
  return { ok: true, message: "Nama berhasil diubah." };
}

export async function changePassword(
  current: string,
  next: string,
  confirm: string
): Promise<ActionResult> {
  const problem = validatePasswordChange(current, next, confirm);
  if (problem) return { ok: false, message: problem };

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return { ok: false, message: "Kamu belum masuk." };

  // Check the current password on a throw-away client so the real session
  // cookies are not touched by this check.
  const { error: verifyError } = await createStatelessClient().auth.signInWithPassword({
    email: data.user.email,
    password: current,
  });
  if (verifyError) return { ok: false, message: "Password saat ini salah." };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return { ok: false, message: mapPasswordUpdateError(error) };
  }

  // Sign out every OTHER device/browser; this one stays signed in.
  await supabase.auth.signOut({ scope: "others" }).catch(() => {});

  return { ok: true, message: "Password berhasil diubah. Perangkat lain dikeluarkan." };
}

function realDeleteDeps(): DeleteDeps {
  const supabase = createClient();
  const admin = createAdminClient();

  return {
    async getCurrentUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user?.email) return null;
      return { id: data.user.id, email: data.user.email };
    },

    async verifyPassword(email, password) {
      const { error } = await createStatelessClient().auth.signInWithPassword({ email, password });
      return !error;
    },

    async migrationReady() {
      const { data, error } = await admin.rpc("purchases_survive_user_deletion");
      return !error && data === true;
    },

    async isAdmin(userId) {
      const { data, error } = await admin.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
      if (error) throw error;
      return Boolean(data?.is_admin);
    },

    async countPending(userId) {
      const { count, error } = await admin
        .from("purchases")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "pending");
      if (error) throw error;
      return count ?? 0;
    },

    async removeProofFiles(userId) {
      // Proofs live in the learner's own folder: <user id>/<file>. They may
      // already be gone (the owner deletes them by hand), so "nothing to
      // remove" is fine.
      const bucket = admin.storage.from(PROOF_BUCKET);
      const PAGE = 100;
      for (let guard = 0; guard < 50; guard++) {
        const { data, error } = await bucket.list(userId, { limit: PAGE });
        if (error) throw error;
        const files = (data ?? []).filter((f) => f.name);
        if (files.length === 0) return;
        const { error: removeError } = await bucket.remove(files.map((f) => `${userId}/${f.name}`));
        if (removeError) throw removeError;
        if (files.length < PAGE) return;
      }
    },

    async scrubPurchases(userId) {
      // Only the personal parts: the free-text note and the proof path. The
      // row (course, amount, status, dates) stays as an anonymous record once
      // the user link is nulled by the foreign key.
      const { error } = await admin
        .from("purchases")
        .update({ note: null, proof_path: null })
        .eq("user_id", userId);
      if (error) throw error;
    },

    async deleteAuthUser(userId) {
      const { error } = await admin.auth.admin.deleteUser(userId, false); // hard delete: the email is free again
      if (error) throw error;
    },

    log(step, e) {
      console.error(`[hapus-akun] gagal di langkah "${step}":`, e);
    },
  };
}

export async function deleteAccount(password: string, confirmText: string): Promise<ActionResult> {
  let deps: DeleteDeps;
  try {
    deps = realDeleteDeps();
  } catch (e) {
    console.error("[hapus-akun] konfigurasi server:", e);
    return { ok: false, message: "Penghapusan akun belum dikonfigurasi di server. Akunmu tidak diubah." };
  }

  const result = await deleteAccountFlow(deps, { password, confirmText });

  if (result.ok) {
    // The user no longer exists; clear this browser's session cookies.
    try {
      await createClient().auth.signOut();
    } catch {
      /* the session is invalid anyway */
    }
    revalidatePath("/", "layout");
  }
  return result;
}
