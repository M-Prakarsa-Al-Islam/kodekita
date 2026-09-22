import { redirect } from "next/navigation";

// The dashboard now lives at "/" (it renders differently for signed-in
// users). This route is kept only so old links/bookmarks still work.
export default function DashboardRedirect() {
  redirect("/");
}
