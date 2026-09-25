"use client";

// Payment-proof screenshots are often multi-MB PNGs straight off a
// phone. Downscale + re-encode as JPEG in the browser before upload,
// so Supabase Storage only ever stores the compressed version — no
// server round-trip needed for this.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.7;
const SKIP_BELOW_BYTES = 200 * 1024; // already small — not worth touching

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < SKIP_BELOW_BYTES) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Unsupported/corrupt image — let the caller's upload attempt
    // surface the real error instead of failing silently here.
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  // Only keep the compressed version if it's actually smaller — a
  // small/already-JPEG source can occasionally grow after re-encode.
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
