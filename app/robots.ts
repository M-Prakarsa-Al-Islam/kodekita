import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Everything is crawlable except the owner's admin pages and the auth callback.
// Utility pages (login, account, ...) are NOT blocked here on purpose: they carry a
// noindex tag, and Google can only obey a noindex tag on a page it is allowed to fetch.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/auth/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
