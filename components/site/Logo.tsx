import Link from "next/link";

// The PyMula wordmark: "Py" in navy, "Mula" in amber (colours are the
// `brand-py` / `brand-mula` tokens in tailwind.config.ts). The two spans sit
// side by side with no gap so it still reads, copies and is announced as the
// single word "PyMula".
//
// Contrast note: the amber on the light page background is low (about 1.8:1).
// WCAG exempts logotypes from the contrast rules, and the bold size helps, but
// don't use this amber for small body text on a light background.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PyMula, kembali ke beranda"
      className={`font-display text-2xl font-semibold tracking-tight ${className}`}
    >
      <span className="text-brand-py">Py</span>
      <span className="text-brand-mula">Mula</span>
    </Link>
  );
}
