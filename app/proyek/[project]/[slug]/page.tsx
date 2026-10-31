import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectChapter } from "@/content/projects";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import { projectBase, projectBuyPath, projectLessonPath, projectProgressSlug } from "@/lib/project-paths";

// Entry route of a chapter: sends the learner to the first lesson they have not
// finished (or lesson 1). Same behaviour as the chapter entry route of the Python Dasar course.
export default async function ProjectChapterEntryPage({ params }: { params: { project: string; slug: string } }) {
  const project = getProject(params.project);
  if (!project) notFound();
  const chapter = getProjectChapter(project, params.slug);
  if (!chapter) notFound();

  if (chapter.status === "todo") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm text-ink-soft">Bab {chapter.order}</p>
        <h1 className="font-display text-2xl font-semibold text-ink">{chapter.title}</h1>
        <p className="mt-4 text-ink-soft">Bab ini belum ditulis. Segera hadir.</p>
        <Link href={projectBase(project.slug)} className="mt-6 inline-block text-sm underline">
          Kembali ke daftar bab
        </Link>
      </section>
    );
  }

  if (!chapter.isFree && !(await hasApprovedPurchase(project.slug))) {
    redirect(projectBuyPath(project.slug));
  }

  const completed = await getCompletedLessonKeys();
  const progressSlug = projectProgressSlug(project.slug, chapter.slug);
  const firstIncomplete =
    chapter.lessons.find((l) => !completed?.has(lessonKey(progressSlug, l.id))) ?? chapter.lessons[0];

  redirect(projectLessonPath(project.slug, chapter.slug, firstIncomplete.id));
}
