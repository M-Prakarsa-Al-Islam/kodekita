"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clearAllDrafts, getBrowserStorage } from "@/lib/code-drafts";
import { Button } from "@/components/ui/Button";

export default function SignOutButton() {
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
    <Button variant="ghost" onClick={handleSignOut}>
      Keluar
    </Button>
  );
}
