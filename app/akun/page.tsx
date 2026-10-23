import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLatestPurchase } from "@/lib/purchase-server";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";
import DeleteAccountForm from "@/components/account/DeleteAccountForm";
import SignOutButton from "@/components/site/SignOutButton";

export const metadata = { title: "Akun", robots: { index: false } };

export default async function AkunPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login?next=/akun");

  const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).maybeSingle();
  const name: string = profile?.name ?? (user.user_metadata?.name as string | undefined) ?? "";

  const purchase = await getLatestPurchase("python-dasar");

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Akun</h1>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Profil</h2>
        <div className="mt-4">
          <ProfileForm email={user.email ?? ""} initialName={name} />
        </div>
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Ganti password</h2>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Keluar</h2>
        <p className="mt-2 text-sm text-ink-soft">Keluar dari akun ini di perangkat ini.</p>
        <div className="mt-4">
          <SignOutButton variant="secondary" />
        </div>
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-xl font-semibold text-red-700">Hapus akun</h2>
        <div className="mt-4">
          <DeleteAccountForm
            hasPaidAccess={purchase?.status === "approved"}
            hasPendingPurchase={purchase?.status === "pending"}
          />
        </div>
      </div>
    </section>
  );
}
