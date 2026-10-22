import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";

// One list for both menus, so the desktop and the phone menu can never drift apart.
const NAV_LINKS = [
  { href: "/kursus", label: "Kursus" },
  { href: "/proyek", label: "Proyek" },
  { href: "/tentang", label: "Tentang" },
];

export default async function Header() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const loggedIn = Boolean(data.user);

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop menu (md and up) */}
        <nav aria-label="Menu utama" className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">
                Dashboard
              </Link>
              <Link href="/akun" className="text-sm font-medium text-ink-soft hover:text-ink">
                Akun
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
                Masuk
              </Link>
              <LinkButton href="/register" className="text-sm">
                Daftar Gratis
              </LinkButton>
            </>
          )}
        </div>
      </div>

      {/* Phone menu (below md): a second row, no JavaScript needed */}
      <nav aria-label="Menu utama (ponsel)" className="border-t border-line md:hidden">
        <ul className="mx-auto flex max-w-5xl items-center justify-around px-6 text-sm text-ink-soft">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block px-3 py-2.5 hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
