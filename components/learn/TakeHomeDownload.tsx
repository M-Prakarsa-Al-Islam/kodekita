"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getBrowserStorage, loadPassed, passedKey } from "@/lib/code-drafts";
import { buildTakeHomeEntries } from "@/lib/take-home";
import { createZip } from "@/lib/zip";
import { Button } from "@/components/ui/Button";

export type TakeHomeProps =
  | { unlocked: false; total: number; remaining: number; nextHref: string | null; nextLabel: string | null }
  | {
      unlocked: true;
      folder: string;
      lastProgressSlug: string;
      lastLessonId: string;
      editableNames: string[];
      modelCode: Record<string, string>; // model answer: only sent once everything is finished
      seed: Record<string, string>;
      readmeOwn: string;
      readmeModel: string;
    };

// The project download box. The SERVER decides whether it is unlocked and only then
// sends the files; this component just builds the zip in the browser.
export default function TakeHomeDownload(props: TakeHomeProps) {
  const [result, setResult] = useState<null | { own: boolean } | "error">(null);

  if (!props.unlocked) {
    const done = props.total - props.remaining;
    return (
      <section className="rounded-lg border border-line bg-white/60 p-5">
        <p className="font-display text-lg font-semibold text-ink">Unduh proyekmu</p>
        <p className="mt-2 text-sm text-ink-soft">
          Unduhan terbuka setelah kamu menyelesaikan <strong>semua lesson yang berisi kode</strong>, supaya yang kamu
          bawa pulang adalah program yang sudah benar-benar jadi.
        </p>
        <p className="mt-3 text-sm text-ink">
          Kamu sudah menyelesaikan {done} dari {props.total} lesson kode. Sisanya: {props.remaining}.
        </p>
        {props.nextHref && (
          <p className="mt-3 text-sm">
            <Link href={props.nextHref} className="font-medium underline">
              Lanjutkan ke lesson kode berikutnya{props.nextLabel ? `: ${props.nextLabel}` : ""}
            </Link>
          </p>
        )}
      </section>
    );
  }

  const u = props;

  async function download() {
    try {
      // Prefer the code the learner had when the last lesson PASSED (saved on this device).
      let mine: Record<string, string> | null = null;
      const storage = getBrowserStorage();
      if (storage) {
        const { data } = await createClient().auth.getSession();
        const userId = data.session?.user.id;
        if (userId) mine = loadPassed(storage, passedKey(userId, u.lastProgressSlug, u.lastLessonId));
      }
      const usable = !!mine && u.editableNames.every((n) => typeof mine![n] === "string" && mine![n].trim() !== "");
      const code = usable ? Object.fromEntries(u.editableNames.map((n) => [n, mine![n]])) : u.modelCode;
      const bytes = createZip(
        buildTakeHomeEntries({ folder: u.folder, code, seed: u.seed, readme: usable ? u.readmeOwn : u.readmeModel })
      );
      const url = URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${u.folder}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setResult({ own: usable });
    } catch {
      setResult("error");
    }
  }

  return (
    <section className="rounded-lg border border-sun bg-sun/10 p-5">
      <p className="font-display text-lg font-semibold text-ink">Unduh proyekmu</p>
      <p className="mt-2 text-sm text-ink">
        Semua lesson kode sudah selesai. Kamu bisa membawa programmu pulang sebagai satu file zip.
      </p>
      <p className="mt-3 text-sm text-ink-soft">Isi zip:</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft">
        {u.editableNames.map((n) => (
          <li key={n}>{n}</li>
        ))}
        {Object.keys(u.seed).map((n) => (
          <li key={n}>{n}</li>
        ))}
        <li>README.md (penjelasan proyek dan cara menjalankannya)</li>
      </ul>
      <p className="mt-3 text-sm text-ink-soft">
        Yang kamu unduh adalah kode dari lesson kode terakhir. Setiap lesson di PyMula dimulai dari kode awal yang
        kami siapkan, jadi program ini adalah hasil kerja bertahap bersama latihan-latihan itu. README di dalam zip
        menjelaskan hal ini dengan jujur.
      </p>
      <Button className="mt-4" onClick={download}>
        Unduh {u.folder}.zip
      </Button>
      {result && result !== "error" && (
        <p className="mt-3 text-sm text-code">
          {result.own
            ? "Zip berisi kode yang kamu tulis dan lulus di lesson terakhir."
            : "Kodemu tidak ditemukan di perangkat ini, jadi zip berisi versi contoh dari kami untuk lesson terakhir. Programnya sama dan lulus pemeriksaan yang sama."}
        </p>
      )}
      {result === "error" && (
        <p className="mt-3 text-sm text-red-700">Unduhan gagal dibuat. Coba lagi, atau hubungi kami lewat WhatsApp.</p>
      )}
    </section>
  );
}
