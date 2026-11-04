import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MarketingHome from "@/components/home/MarketingHome";
import DashboardHome from "@/components/home/DashboardHome";
import { jsonLdString, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage({ searchParams }: { searchParams?: { confirmed?: string } }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const name = data.user.user_metadata?.name ?? data.user.email ?? "kamu";
    // The sign-up confirmation link lands here (lib/password-reset.ts, SIGNUP_DONE_PATH).
    return <DashboardHome name={name} justConfirmed={searchParams?.confirmed === "1"} />;
  }

  return (
    <>
      {/* Site name + logo for Google (schema.org WebSite / Organization) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd()) }} />
      <MarketingHome />
    </>
  );
}
