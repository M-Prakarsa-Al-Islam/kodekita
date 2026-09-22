import { createClient } from "@/lib/supabase/server";
import MarketingHome from "@/components/home/MarketingHome";
import DashboardHome from "@/components/home/DashboardHome";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const name = data.user.user_metadata?.name ?? data.user.email ?? "kamu";
    return <DashboardHome name={name} />;
  }

  return <MarketingHome />;
}
