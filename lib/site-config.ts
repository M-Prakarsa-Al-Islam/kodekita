// The facts that appear on several pages, in ONE place, plus the pure functions
// that decide what the site does as its end date approaches. No imports, so the
// middleware, the layout, client components and scripts/test-service.mjs can all
// use it.
//
// HOW THE END OF SERVICE WORKS (owner decisions, 2026-10-22):
//  - SERVICE_END_ISO is the LAST moment the service runs. Planned maximum:
//    1 Oktober 2027 (the domain pymula.live expires 17 Oktober 2027).
//  - From NOTICE_DAYS before that moment the site shows a pop-up notice
//    ("notice" state) and paid chapters stop being sold. There is no permanent
//    countdown banner before that. The owner never has to act for this to happen.
//  - After the moment ("ended" state) every page shows the farewell page and
//    nothing talks to Supabase any more (see app/layout.tsx and middleware.ts).
//  - To stop EARLIER: change SERVICE_END_ISO to a moment at least MIN_NOTICE_DAYS
//    in the future and deploy. See SHUTDOWN.md.

export const SITE_NAME = "PyMula";

// The ONE canonical address of the site. pymula.live redirects to www.pymula.live,
// so every canonical link, sitemap entry and structured-data URL uses the www form.
// (If you ever switch the redirect the other way, change only this line.)
export const SITE_URL = "https://www.pymula.live";

// After the end date the middleware sends every request here (see middleware.ts).
export const ENDED_PATH = "/selesai";

// ---- contact (shown on /tentang, the footer and the farewell page) ----------
export const WHATSAPP_NUMBER_INTL = "6285185203197";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER_INTL}`;
export const WHATSAPP_DISPLAY = "0851-8520-3197";
// Must really receive mail BEFORE deploying (name.com: My Domains -> pymula.live
// -> Email Forwarding). It stops working when the domain expires; WhatsApp stays.
export const CONTACT_EMAIL = "halo@pymula.live";
// Optional. If set, /tentang shows "Pengelola: <name>" (online sellers are asked
// to give their identity; fill this in if you are comfortable with it).
export const OWNER_NAME = "";
// Optional. If set, the farewell page links to a public copy of the materials
// (for example a GitHub repository).
export const LEGACY_URL = "";
// Flip to true only once the per-chapter zip download really exists; the FAQ and
// the end-notice pop-up mention downloads only when this is true.
export const DOWNLOADS_AVAILABLE = false;

// ---- service life ------------------------------------------------------------
export const SERVICE_END_ISO = "2027-10-01T23:59:59+07:00";
export const DOMAIN_EXPIRES_ISO = "2027-10-17T23:59:59+07:00";

export const MIN_NOTICE_DAYS = 30; // the promise made to users
export const NOTICE_DAYS = 45; // the pop-up starts this early (15 days of margin)
export const SALES_CLOSE_DAYS = 45; // paid chapters stop being sold this early
export const REFUND_DAYS = 45; // purchases this close to the end get a full refund
export const REFUND_CLAIM_DAYS_AFTER_END = 30; // refund requests are accepted this long after the end
export const DOMAIN_MARGIN_DAYS = 14; // the end must be at least this long before the domain expires

const DAY_MS = 24 * 60 * 60 * 1000;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

export type ServiceState = "active" | "notice" | "ended";

// Whole days left, rounded UP (10.2 days left -> 11). Zero or negative once over.
export function daysLeft(now: Date, endIso: string = SERVICE_END_ISO): number {
  return Math.ceil((new Date(endIso).getTime() - now.getTime()) / DAY_MS);
}

export function serviceState(now: Date, endIso: string = SERVICE_END_ISO): ServiceState {
  if (now.getTime() > new Date(endIso).getTime()) return "ended";
  return daysLeft(now, endIso) <= NOTICE_DAYS ? "notice" : "active";
}

export function salesOpen(now: Date, endIso: string = SERVICE_END_ISO): boolean {
  return now.getTime() <= new Date(endIso).getTime() && daysLeft(now, endIso) > SALES_CLOSE_DAYS;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// "1 Oktober 2027", always as the calendar date in Jakarta (WIB), whatever the
// time zone of the server or the browser.
export function formatDateId(iso: string): string {
  const d = new Date(new Date(iso).getTime() + WIB_OFFSET_MS);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function dateAfter(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

// Problems with the committed settings (empty list = fine). scripts/test-service.mjs
// fails the build of the repo if this is not empty, so a bad edit is caught.
export function configProblems(): string[] {
  const problems: string[] = [];
  const end = new Date(SERVICE_END_ISO).getTime();
  const domain = new Date(DOMAIN_EXPIRES_ISO).getTime();
  if (Number.isNaN(end)) problems.push("SERVICE_END_ISO is not a valid date");
  if (Number.isNaN(domain)) problems.push("DOMAIN_EXPIRES_ISO is not a valid date");
  if (!Number.isNaN(end) && !Number.isNaN(domain) && end > domain - DOMAIN_MARGIN_DAYS * DAY_MS) {
    problems.push(`the end date must be at least ${DOMAIN_MARGIN_DAYS} days before the domain expires`);
  }
  if (NOTICE_DAYS < MIN_NOTICE_DAYS) problems.push("NOTICE_DAYS is shorter than the promised minimum notice");
  if (SALES_CLOSE_DAYS < REFUND_DAYS) problems.push("sales must close no later than the start of the refund window");
  if (SALES_CLOSE_DAYS > NOTICE_DAYS) problems.push("sales must not close before the notice starts");
  if (!/^https:\/\/[^/\s]+$/.test(SITE_URL)) problems.push("SITE_URL must be https://host with no trailing slash or path");
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER_INTL)) problems.push("WHATSAPP_NUMBER_INTL must be digits only, with country code");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL)) problems.push("CONTACT_EMAIL is not an email address");
  return problems;
}
