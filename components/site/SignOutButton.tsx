"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clearAllDrafts, getBrowserStorage } from "@/lib/code-drafts";
import { Button } from "@/components/ui/Button";

export default function SignOutButton({ variant = "ghost" }: { variant?: "primary" | "secondary" | "ghost" }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    // Shared computers: don't leave this learner's lesson code behind.
    const storage = getBrowserStorage();
    if (storage) clearAllDrafts(storage);
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant={variant} onClick={handleSignOut}>
      Keluar
    </Button>
  );
}
