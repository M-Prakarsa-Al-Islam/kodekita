import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS and can delete auth users. SERVER ONLY.
// - The key comes from SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix, so it
//   is never sent to the browser). Set it in .env.local and in Vercel.
// - `server-only` makes the build fail if a client component ever imports this.
// - Use it only inside server actions that first check who the caller is.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diatur di environment server.");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
