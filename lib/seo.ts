// SEO facts shared by the sitemap, the home page and the tests. Pure: no Next.js imports.
import { SITE_NAME, SITE_URL } from "./site-config";

// The pages that are meant to appear in Google. Everything else is either behind a
// login, a utility page (login, reset password, ...), or a placeholder, and carries
// `robots: { index: false }` (scripts/test-seo.mjs keeps the two lists consistent).
export const INDEXABLE_PATHS = ["/", "/kursus", "/kursus/python-dasar", "/tentang"];

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// Tells Google the site's name (WebSite) and its logo (Organization). The logo URL
// must be a crawlable image of at least 112x112 px.
export const LOGO_PATH = "/icon-512.png";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: ["Py Mula"],
        inLanguage: "id",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: absoluteUrl(LOGO_PATH),
      },
    ],
  };
}

// JSON for an inline <script type="application/ld+json">. "<" is escaped so the data
// can never close the script tag early.
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
