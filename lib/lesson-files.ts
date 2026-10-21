// Normalises a code practice into a list of files, so the UI has one code
// path: a classic single-editor lesson is just one file called main.py.
import type { CodePractice, LessonFile } from "@/content/types";

export const DEFAULT_ENTRY = "main.py";

export function getPracticeFiles(practice: CodePractice): LessonFile[] {
  if (practice.files) return practice.files;
  return [{ name: DEFAULT_ENTRY, content: practice.starterCode, editable: true }];
}

export function getEntry(practice: CodePractice): string {
  return practice.entry ?? DEFAULT_ENTRY;
}

export function isEditable(file: LessonFile): boolean {
  return file.editable !== false;
}

// Which tab is open first: the entry file if it is there, else the first
// editable file, else the first file.
export function defaultActiveFile(files: LessonFile[], entry: string): string {
  return (
    files.find((f) => f.name === entry)?.name ??
    files.find(isEditable)?.name ??
    files[0]?.name ??
    entry
  );
}

// Content problems an author can make; used by scripts/test-lessons-pyodide.mjs.
export function validateFiles(files: LessonFile[], entry: string): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const f of files) {
    if (!/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(f.name)) problems.push(`bad file name "${f.name}"`);
    if (seen.has(f.name)) problems.push(`duplicate file "${f.name}"`);
    seen.add(f.name);
  }
  if (!seen.has(entry)) problems.push(`entry file "${entry}" is not among the files`);
  if (!files.some(isEditable)) problems.push("no editable file");
  return problems;
}
