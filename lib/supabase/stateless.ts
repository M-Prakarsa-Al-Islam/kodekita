import { createClient } from "@supabase/supabase-js";

// An anon-key client that stores nothing (no cookies, no session). Used only
// to CHECK a password (signInWithPassword) without touching the visitor's real
// session cookies.
export function createStatelessClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );
}
