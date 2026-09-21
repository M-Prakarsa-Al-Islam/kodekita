import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          KodeKita
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          <Link href="/kursus" className="hover:text-ink">
            Kursus
          </Link>
          <Link href="/proyek" className="hover:text-ink">
            Proyek
          </Link>
          <Link href="/tentang" className="hover:text-ink">
            Tentang
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
            Masuk
          </Link>
          <LinkButton href="/register" className="text-sm">
            Daftar Gratis
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
