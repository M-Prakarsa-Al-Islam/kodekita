import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const name = data.user.user_metadata?.name ?? data.user.email;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Halo, {name}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Kursus dan progress akan muncul di sini pada Phase 2.
      </p>

      <div className="mt-8">
        <SignOutButton />
      </div>
    </section>
  );
}
