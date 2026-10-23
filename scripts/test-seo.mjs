// Guards what Google sees: favicon rules, robots.txt, sitemap, canonical links,
// noindex on utility pages, structured data, link-preview image. Static checks over
// the source and the files in /public; no browser, no network.
// Run: node scripts/test-seo.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const exists = (f) => fs.existsSync(path.join(root, f));
function load(file, shims = {}) {
  const js = ts.transpileModule(read(file), { compilerOptions: { module: "CommonJS", target: "ES2020" } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((id) => (id in shims ? shims[id] : require(id)), mod, mod.exports);
  return mod.exports;
}
const C = load("lib/site-config.ts");
const S = load("lib/seo.ts", { "./site-config": C });

let failures = 0, count = 0;
function check(name, actual, expected) {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(actual)}`}`);
}

// ---- image helpers -----------------------------------------------------------------------
const pngSize = (f) => { const b = fs.readFileSync(path.join(root, f)); return b.slice(0, 8).toString("hex") === "89504e470d0a1a0a" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };
function icoSizes(f) {
  const b = fs.readFileSync(path.join(root, f));
  if (b.readUInt16LE(0) !== 0 || b.readUInt16LE(2) !== 1) return null;
  return Array.from({ length: b.readUInt16LE(4) }, (_, i) => b[6 + i * 16] || 256);
}

// ---- the canonical address ---------------------------------------------------------------------
check("the site address is https and uses www (the apex redirects to www)", [C.SITE_URL.startsWith("https://www."), new URL(C.SITE_URL).origin === C.SITE_URL], [true, true]);
check("the committed settings still have no problems", C.configProblems(), []);

// ---- favicon: Google's rules ---------------------------------------------------------------------------
const layout = read("app/layout.tsx");
const declared = [...layout.matchAll(/\{ url: "(\/[^"]+)"(?:, sizes: "(\d+)x\d+")?/g)].map((m) => ({ url: m[1], size: m[2] ? Number(m[2]) : null }));
const urls = declared.map((d) => d.url);
check("the layout declares a favicon.ico, an SVG icon, PNG icons and an apple-touch-icon", ["/favicon.ico", "/icon.svg", "/icon-96.png", "/icon-192.png", "/apple-touch-icon.png"].every((u) => urls.includes(u)), true);
check("every declared icon file exists in /public (no 404)", declared.filter((d) => !exists("public" + d.url)).map((d) => d.url), []);
for (const d of declared.filter((x) => x.url.endsWith(".png") && x.size)) {
  const dim = pngSize("public" + d.url);
  check(`${d.url} really is ${d.size}x${d.size}`, dim, [d.size, d.size]);
  check(`${d.url} is a multiple of 48 px (Google's favicon rule)`, d.size % 48, 0);
}
check("favicon.ico is a real ICO and contains a 48 px image", (icoSizes("public/favicon.ico") || []).includes(48), true);
const svg = read("public/icon.svg");
check("icon.svg is a square (1:1) vector", /viewBox="0 0 (\d+) (\d+)"/.test(svg) && svg.match(/viewBox="0 0 (\d+) (\d+)"/)[1] === svg.match(/viewBox="0 0 (\d+) (\d+)"/)[2], true);
check("the 512 px icon (used as the Organization logo) is at least 112 px", pngSize("public/icon-512.png")[0] >= 112, true);

// ---- link preview image -----------------------------------------------------------------------------------
check("the link-preview image is 1200x630 and referenced by Open Graph and Twitter", [pngSize("public/og-image.png"), (layout.match(/\/og-image\.png/g) || []).length >= 2], [[1200, 630], true]);
check("the layout sets metadataBase, the title template and the site name", /metadataBase: new URL\(SITE_URL\)/.test(layout) && /template: "%s \| PyMula"/.test(layout) && /siteName: SITE_NAME/.test(layout), true);
const ogBlock = layout.slice(layout.indexOf("openGraph: {"), layout.indexOf("twitter: {"));
check("the layout does not set a site-wide og:url (it would be inherited by every page)", /\n\s{4}url:/.test(ogBlock), false);

// ---- robots.txt ---------------------------------------------------------------------------------------------
const robots = read("app/robots.ts");
const disallow = [...(robots.match(/disallow: \[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
check("robots.txt allows the site and blocks only /admin and /auth/", [/allow: "\/"/.test(robots), disallow], [true, ["/admin", "/auth/"]]);
check("robots.txt points at the sitemap on the canonical address", /sitemap: `\$\{SITE_URL\}\/sitemap\.xml`/.test(robots), true);
check("robots.txt does not block the favicon or other images Google needs", ["/favicon.ico", "/icon.svg", "/icon-96.png", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/og-image.png", "/"].filter((u) => disallow.some((d) => u.startsWith(d) && d !== "/")), []);

// ---- noindex / sitemap consistency ------------------------------------------------------------------------------
function noindexAt(routeDir) {
  // true if this route's page, or a layout above it, says robots: { index: false }
  const parts = routeDir.split("/").filter(Boolean);
  for (let i = parts.length; i >= 0; i--) {
    const dir = path.join("app", ...parts.slice(0, i));
    const isSelf = i === parts.length;
    const files = isSelf ? ["page.tsx", "layout.tsx"] : ["layout.tsx"];
    for (const f of files) if (exists(path.join(dir, f)) && /index:\s*false/.test(read(path.join(dir, f)))) return true;
  }
  return false;
}
const pageExists = (route) => exists(path.join("app", ...route.split("/").filter(Boolean), "page.tsx"));

check("the sitemap lists exactly the intended public pages", S.INDEXABLE_PATHS, ["/", "/kursus", "/kursus/python-dasar", "/tentang"]);
check("every page in the sitemap exists", S.INDEXABLE_PATHS.filter((p) => !pageExists(p)), []);
check("no page in the sitemap is marked noindex", S.INDEXABLE_PATHS.filter(noindexAt), []);
check("every page in the sitemap has its own canonical link", S.INDEXABLE_PATHS.filter((p) => !new RegExp(`canonical: "${p.replace(/\//g, "\\/")}"`).test(read(path.join("app", ...p.split("/").filter(Boolean), "page.tsx")))), []);
check("all sitemap URLs are absolute https www URLs", S.INDEXABLE_PATHS.map(S.absoluteUrl).every((u) => /^https:\/\/www\.[^/]+(\/|$)/.test(u)), true);
const sitemap = read("app/sitemap.ts");
check("the sitemap is built from INDEXABLE_PATHS, is dynamic, and shrinks to the home page after the end date", /INDEXABLE_PATHS/.test(sitemap) && /force-dynamic/.test(sitemap) && /"ended" \? \["\/"\]/.test(sitemap), true);

const UTILITY = ["/login", "/register", "/lupa-password", "/reset-password", "/akun", "/admin/purchases", "/proyek", "/selesai", "/kursus/python-dasar/beli", "/kursus/python-dasar/[slug]", "/kursus/python-dasar/[slug]/[lessonId]"];
check("utility, login-only and placeholder pages are all marked noindex", UTILITY.filter((p) => !noindexAt(p)), []);

// ---- structured data -----------------------------------------------------------------------------------------------
const ld = S.websiteJsonLd();
const site = ld["@graph"].find((x) => x["@type"] === "WebSite");
const org = ld["@graph"].find((x) => x["@type"] === "Organization");
check("structured data names the site PyMula at the canonical home URL", [site.name, site.url], ["PyMula", C.SITE_URL + "/"]);
check("structured data gives the Organization a logo that exists and is at least 112 px", [org.logo === C.SITE_URL + S.LOGO_PATH, exists("public" + S.LOGO_PATH), pngSize("public" + S.LOGO_PATH)[0] >= 112], [true, true, true]);
check("the JSON for the script tag cannot close the tag early", S.jsonLdString({ x: "</script><b>" }).includes("</"), false);
check("the JSON for the script tag still parses back to the same data", JSON.stringify(JSON.parse(S.jsonLdString(ld))) === JSON.stringify(ld), true);
const home = read("app/page.tsx");
check("the home page puts the structured data in the page for logged-out visitors (what Googlebot sees)", /application\/ld\+json/.test(home) && /websiteJsonLd\(\)/.test(home) && home.indexOf("application/ld+json") > home.indexOf("data.user"), true);
check("the home page has a canonical link", /canonical: "\/"/.test(home), true);

console.log(`\n${count - failures}/${count} seo test-cases behaved as expected.`);
process.exit(failures ? 1 : 0);
