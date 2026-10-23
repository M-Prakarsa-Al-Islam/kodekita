import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS, absoluteUrl } from "@/lib/seo";
import { serviceState } from "@/lib/site-config";

// Depends on the clock (after the end date only the home page remains), so it must
// be computed on every request, not once at build time.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = serviceState(new Date()) === "ended" ? ["/"] : INDEXABLE_PATHS;
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
