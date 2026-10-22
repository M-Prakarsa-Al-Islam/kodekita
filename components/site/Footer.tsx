import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-ink-soft">
        <p>{SITE_NAME}, belajar coding secara mandiri, dalam Bahasa Indonesia.</p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/tentang" className="underline hover:text-ink">
            Tentang & FAQ
          </Link>
          <Link href="/tentang#refund" className="underline hover:text-ink">
            Refund
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline hover:text-ink">
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-ink">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}.</p>
      </div>
    </footer>
  );
}
