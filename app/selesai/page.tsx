import { notFound } from "next/navigation";
import { serviceState } from "@/lib/site-config";

export const metadata = { title: "Layanan berakhir" };

// Only reachable after the end date: the middleware rewrites every request here
// and the layout draws the farewell page, so this page itself renders nothing.
// Before the end date it does not exist.
export default function SelesaiPage() {
  if (serviceState(new Date()) !== "ended") notFound();
  return null;
}
