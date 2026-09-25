"use client";

import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image-compress";

export async function submitPurchase({
  courseSlug,
  amount,
  file,
  note,
}: {
  courseSlug: string;
  amount: number;
  file: File;
  note?: string;
}) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Kamu harus masuk dulu.");
  }

  const compressed = await compressImage(file);

  // Path is prefixed with the user's own id — the storage RLS policy
  // relies on this to scope uploads to "your own folder only".
  const path = `${userData.user.id}/${courseSlug}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(path, compressed, { contentType: compressed.type, upsert: false });

  if (uploadError) {
    throw new Error(`Gagal mengunggah bukti pembayaran: ${uploadError.message}`);
  }

  const { error: insertError } = await supabase.from("purchases").insert({
    user_id: userData.user.id,
    course_slug: courseSlug,
    amount,
    proof_path: path,
    note: note || null,
  });

  if (insertError) {
    throw new Error(`Gagal menyimpan data pembelian: ${insertError.message}`);
  }
}
