import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { getProjectLessons } from "@/content/projects";
import { getCoursePrice } from "@/content/pricing";
import type { ProjectContent } from "@/content/types";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { summarizeProgress } from "@/lib/progress-summary";
import { projectBase, projectBuyPath, projectLessonPath } from "@/lib/project-paths";
import { salesOpen } from "@/lib/site-config";

// One project's progress on the signed-in home page (same idea as the Python Dasar card).
export default async function ProjectCard({ project, completed }: { project: ProjectContent; completed: Set<string> }) {
  const purchased = await hasApprovedPurchase(project.slug);
  const summary = summarizeProgress(getProjectLessons(project), completed, purchased);
  const started = summary.scopeDone > 0;
  const canBuy = salesOpen(new Date());

  return (
    <div className="mt-6 rounded-lg border border-line bg-white/60 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-lg font-semibold text-ink">{project.title}</p>
        <p className="text-sm text-ink-soft">{summary.percent}%</p>
      </div>
      <ProgressBar value={summary.scopeDone} max={summary.scopeTotal} label={`Progres ${project.title}`} className="mt-3" />
      <p className="mt-2 text-sm text-ink-soft">
        {summary.scopeDone}/{summary.scopeTotal} lesson selesai
        {!purchased && " (bab gratis)"}
      </p>

      {summary.next ? (
        <LinkButton
          href={projectLessonPath(project.slug, summary.next.chapterUrlSlug, summary.next.lessonId)}
          className="mt-4"
        >
          {started ? "Lanjutkan" : "Mulai"} — Bab {summary.next.chapterOrder}: {summary.next.lessonTitle}
        </LinkButton>
      ) : summary.lockedNext ? (
        <>
          <p className="mt-4 text-sm text-code">Semua bab gratis sudah kamu selesaikan. Kerja bagus!</p>
          {canBuy && (
            <LinkButton href={projectBuyPath(project.slug)} className="mt-3">
              Buka bab berikutnya (Rp{getCoursePrice(project.slug).toLocaleString("id-ID")})
            </LinkButton>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-code">Semua lesson yang tersedia sudah selesai.</p>
      )}

      <p className="mt-4 text-sm">
        <Link href={projectBase(project.slug)} className="underline">
          Lihat semua bab
        </Link>
      </p>
    </div>
  );
}
