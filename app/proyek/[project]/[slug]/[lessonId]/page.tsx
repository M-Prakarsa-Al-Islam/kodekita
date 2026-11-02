import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectChapter, getProjectLesson, getProjectAdjacent, getProjectNavChapters, getTakeHome } from "@/content/projects";
import TakeHomeDownload, { type TakeHomeProps } from "@/components/learn/TakeHomeDownload";
import { editableFileNames, getLastCodeLesson, getTakeHomeState, modelCode } from "@/lib/take-home";
import { hasApprovedPurchase } from "@/lib/purchase-server";
import Practice from "@/components/learn/Practice";
import LessonNav from "@/components/learn/LessonNav";
import ChapterProgress from "@/components/learn/ChapterProgress";
import CodeBlock from "@/components/learn/CodeBlock";
import LessonText from "@/components/learn/LessonText";
import { getCompletedLessonKeys, lessonKey } from "@/lib/progress-server";
import { projectBase, projectBuyPath, projectLessonPath, projectProgressSlug } from "@/lib/project-paths";

export default async function ProjectLessonPage({
  params,
}: {
  params: { project: string; slug: string; lessonId: string };
}) {
  const project = getProject(params.project);
  if (!project) notFound();
  const chapter = getProjectChapter(project, params.slug);
  if (!chapter || chapter.status !== "published") notFound();

  // Server-side enforcement, not just hiding the UI (same rule as Python Dasar).
  if (!chapter.isFree && !(await hasApprovedPurchase(project.slug))) {
    redirect(projectBuyPath(project.slug));
  }

  const lesson = getProjectLesson(project, params.slug, params.lessonId);
  if (!lesson) notFound();

  const { prev, next } = getProjectAdjacent(project, params.slug, params.lessonId);

  // Progress is stored under "<project>/<chapter>" (lib/project-paths.ts).
  const progressSlug = projectProgressSlug(project.slug, chapter.slug);
  const completed = await getCompletedLessonKeys();
  const completedKeys = completed ? Array.from(completed) : [];
  const completedIds = chapter.lessons.filter((l) => completed?.has(lessonKey(progressSlug, l.id))).map((l) => l.id);
  const base = projectBase(project.slug);

  // The project download box. Unlocked only when EVERY code lesson is finished, and that is
  // decided here, on the server: the model answer and the README are not sent to the
  // browser until then.
  let takeHome: TakeHomeProps | null = null;
  if (lesson.takeHome) {
    const state = getTakeHomeState(project, completed);
    const info = getTakeHome(project);
    const last = getLastCodeLesson(project);
    if (!state.unlocked || !info || !last) {
      const next = state.remaining[0];
      takeHome = {
        unlocked: false,
        total: state.total,
        remaining: state.remaining.length,
        nextHref: next ? next.href : null,
        nextLabel: next ? `Bab ${next.chapterOrder}, ${next.lessonTitle}` : null,
      };
    } else {
      const editable = editableFileNames(last.practice);
      const label = `Bab ${last.ref.chapterOrder}, lesson ${last.ref.lessonId.replace(/^L/, "")}: ${last.ref.lessonTitle}`;
      takeHome = {
        unlocked: true,
        folder: info.folder,
        lastProgressSlug: last.ref.progressSlug,
        lastLessonId: last.ref.lessonId,
        editableNames: editable,
        modelCode: modelCode(last.practice),
        seed: Object.fromEntries(
          info.seedFiles.map((n) => [n, last.practice.files?.find((f) => f.name === n)?.content ?? ""])
        ),
        readmeOwn: info.buildReadme(true, label),
        readmeModel: info.buildReadme(false, label),
      };
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <LessonNav
        chapterSlug={chapter.slug}
        lessonId={lesson.id}
        navChapters={getProjectNavChapters(project)}
        completedKeys={completedKeys}
        basePath={base}
        keyPrefix={`${project.slug}/`}
        chapterLabel="Bab "
      />
      <div className="mt-4">
        <ChapterProgress
          lessons={chapter.lessons.map((l) => ({ id: l.id, title: l.title }))}
          currentId={lesson.id}
          completedIds={completedIds}
        />
      </div>
      <h1 className="mt-8 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink">
        {lesson.title}
      </h1>

      <div className="mt-8 space-y-14">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-code">Teori</p>
          <LessonText text={lesson.theory.explanation} className="mt-3" />
          {lesson.theory.sections?.map((section, i) => (
            <div key={i} className={section.heading ? "mt-10" : "mt-5"}>
              {section.heading && (
                <h2 className="font-display text-xl font-semibold leading-snug text-ink">{section.heading}</h2>
              )}
              {section.text && <LessonText text={section.text} className={section.heading ? "mt-2" : ""} />}
              {section.code && <CodeBlock code={section.code} className="mt-4" />}
            </div>
          ))}
          {lesson.theory.example && (
            <div className="mt-10">
              <LessonText text={lesson.theory.example.description} size="sm" className="text-ink-soft" />
              <CodeBlock code={lesson.theory.example.code} className="mt-3" />
            </div>
          )}
        </div>

        {takeHome && <TakeHomeDownload {...takeHome} />}

        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-code">
            {lesson.practice.kind === "quiz" ? "Kuis" : lesson.practice.kind === "open" ? "Tantangan" : "Latihan"}
          </p>
          {lesson.practice.kind === "code" && (
            <p className="mt-2 text-xs text-ink-soft">
              Kode awal setiap lesson sudah disiapkan. Kodemu dari lesson sebelumnya tidak dibawa otomatis.
            </p>
          )}
          <div className="mt-3">
            {/* chapterSlug is the PROGRESS slug: it keys both the saved progress and the per-lesson draft. */}
            <Practice practice={lesson.practice} chapterSlug={progressSlug} lessonId={lesson.id} />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={projectLessonPath(project.slug, prev.chapterUrlSlug, prev.lessonId)} className="underline">
            ← {prev.lessonTitle}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={projectLessonPath(project.slug, next.chapterUrlSlug, next.lessonId)} className="underline">
            {next.lessonTitle} →
          </Link>
        ) : (
          <Link href={base} className="underline">
            Selesai — kembali ke daftar bab
          </Link>
        )}
      </div>
    </section>
  );
}
