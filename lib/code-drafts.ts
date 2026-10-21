// Remembers what a learner typed in a lesson's editor, in the browser's
// localStorage, so a refresh / closed tab / lost connection doesn't throw the
// code away. Pure functions that take the storage as a parameter, so they are
// unit-tested in Node with a fake storage (scripts/test-drafts.mjs).
//
// Design (see PROJECT_DESIGN.md section 6.2):
// - LOCAL ONLY for course lessons: nothing is sent to Supabase. Exercises are
//   small and disposable; the cost/benefit of server sync is for projects.
//   Consequence: a draft does not follow the learner to another device.
// - Keys include the user id (two people on one computer don't see each
//   other's code) and are removed on sign-out (`clearAllDrafts`).
// - Safari on iPhone can evict localStorage of sites not visited for about a
//   week; private mode may block it. Every call here fails soft: if storage
//   is unavailable the editor simply behaves as it did before.

export const DRAFT_PREFIX = "pymula:draft:v1:";
export const MAX_DRAFT_CHARS = 100_000;

export type DraftStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
};

export type SavedDraft = { code: string; starter: string; savedAt: number };

export function draftKey(userId: string, chapterSlug: string, lessonId: string): string {
  return `${DRAFT_PREFIX}${userId}:${chapterSlug}:${lessonId}`;
}

// Tolerant of anything that could be in storage (corrupt JSON, an older
// format, something another script wrote): returns null instead of throwing.
export function loadDraft(storage: DraftStorage, key: string): SavedDraft | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (
      data &&
      typeof data === "object" &&
      typeof data.code === "string" &&
      typeof data.starter === "string" &&
      typeof data.savedAt === "number"
    ) {
      return { code: data.code, starter: data.starter, savedAt: data.savedAt };
    }
    return null;
  } catch {
    return null;
  }
}

export type SaveOutcome = "saved" | "removed" | "skipped" | "failed";

// - code equals the starter: there is nothing worth remembering, so the key is
//   removed (keeps storage clean and makes "reset" simply forget);
// - absurdly large code is not stored (storage quota is shared with the site);
// - quota errors / blocked storage are swallowed ("failed").
export function saveDraft(
  storage: DraftStorage,
  key: string,
  code: string,
  starter: string,
  now: number = Date.now()
): SaveOutcome {
  try {
    if (code === starter) {
      storage.removeItem(key);
      return "removed";
    }
    if (code.length > MAX_DRAFT_CHARS) return "skipped";
    const draft: SavedDraft = { code, starter, savedAt: now };
    storage.setItem(key, JSON.stringify(draft));
    return "saved";
  } catch {
    return "failed";
  }
}

export function removeDraft(storage: DraftStorage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    /* ignore */
  }
}

// What to show when the lesson opens.
// - no draft, or the draft equals the starter -> the starter (nothing restored);
// - the author changed the starter since the draft was saved AND the learner
//   never edited it (draft == the old starter) -> show the NEW starter;
// - otherwise the learner's own code wins (they can use "Reset kode").
export function resolveInitialCode(
  saved: SavedDraft | null,
  currentStarter: string
): { code: string; restored: boolean } {
  if (!saved) return { code: currentStarter, restored: false };
  if (saved.code === currentStarter) return { code: currentStarter, restored: false };
  if (saved.starter !== currentStarter && saved.code === saved.starter) {
    return { code: currentStarter, restored: false };
  }
  return { code: saved.code, restored: true };
}

// Removes only OUR draft keys (never other site data such as auth tokens).
// Returns how many were removed.
export function clearAllDrafts(storage: DraftStorage): number {
  try {
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && k.startsWith(DRAFT_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => storage.removeItem(k));
    return keys.length;
  } catch {
    return 0;
  }
}

let cachedStorage: DraftStorage | null | undefined;

// The browser's localStorage if it is really usable, else null. Probed once.
export function getBrowserStorage(): DraftStorage | null {
  if (cachedStorage !== undefined) return cachedStorage;
  try {
    if (typeof window === "undefined") return null; // server render: don't cache
    const s = window.localStorage;
    const probe = "__pymula_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    cachedStorage = s;
  } catch {
    cachedStorage = null;
  }
  return cachedStorage;
}
