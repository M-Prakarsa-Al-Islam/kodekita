"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LessonFile } from "@/content/types";
import { createClient } from "@/lib/supabase/client";
import {
  draftKey,
  getBrowserStorage,
  loadDraft,
  removeDraft,
  resolveInitialCode,
  saveDraft,
} from "@/lib/code-drafts";

const SAVE_DELAY_MS = 400;

type Files = Record<string, string>;

// The learner's files for a lesson, remembered in this browser (see
// lib/code-drafts.ts). Works for one file (classic lessons: legacy storage
// key, so old drafts survive) and for several. Read-only files are never
// stored. With no `scope` it is plain state and stores nothing.
export function useFilesDraft(
  scope: { chapterSlug: string; lessonId: string } | undefined,
  starterFiles: LessonFile[]
) {
  const chapterSlug = scope?.chapterSlug;
  const lessonId = scope?.lessonId;

  // Stable identity for the starters: a new array with the same content must
  // not reset what the learner typed.
  const signature = JSON.stringify(starterFiles);
  const { starters, editableNames, multi } = useMemo(() => {
    const list = JSON.parse(signature) as LessonFile[];
    return {
      starters: Object.fromEntries(list.map((f) => [f.name, f.content])) as Files,
      editableNames: list.filter((f) => f.editable !== false).map((f) => f.name),
      multi: list.length > 1,
    };
  }, [signature]);

  const [files, setFiles] = useState<Files>(starters);
  const [keys, setKeys] = useState<Record<string, string> | null>(null);
  const [restored, setRestored] = useState(false);
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  });

  // 1) Whenever the lesson (or its starters) change: start from the starters,
  //    then look for saved drafts. The user id comes from the local session
  //    (getSession reads the cookie; it does not call the network).
  useEffect(() => {
    setFiles(starters);
    setKeys(null);
    setRestored(false);
    if (!chapterSlug || !lessonId) return;

    let cancelled = false;
    (async () => {
      let userId: string | null = null;
      try {
        const { data } = await createClient().auth.getSession();
        userId = data.session?.user.id ?? null;
      } catch {
        userId = null;
      }
      if (cancelled || !userId) return; // signed out: remember nothing

      const storage = getBrowserStorage();
      const nextKeys: Record<string, string> = {};
      const restoredNow: Files = {};
      for (const name of editableNames) {
        const k = draftKey(userId, chapterSlug, lessonId, multi ? name : undefined);
        nextKeys[name] = k;
        const result = resolveInitialCode(storage ? loadDraft(storage, k) : null, starters[name]);
        // Don't overwrite a file the learner already started typing meanwhile.
        if (result.restored && filesRef.current[name] === starters[name]) {
          restoredNow[name] = result.code;
        }
      }
      if (Object.keys(restoredNow).length > 0) {
        setFiles((prev) => ({ ...prev, ...restoredNow }));
        setRestored(true);
      }
      setKeys(nextKeys);
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterSlug, lessonId, starters, editableNames, multi]);

  // 2) Save shortly after typing stops.
  useEffect(() => {
    if (!keys) return;
    const storage = getBrowserStorage();
    if (!storage) return;
    const t = setTimeout(() => {
      for (const name of editableNames) {
        if (keys[name]) saveDraft(storage, keys[name], files[name], starters[name]);
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [files, keys, starters, editableNames]);

  // 3) Don't lose the last half second when the page is refreshed / closed /
  //    switched away from (mobile browsers often kill background tabs).
  useEffect(() => {
    if (!keys) return;
    function flush() {
      const storage = getBrowserStorage();
      if (!storage || !keys) return;
      for (const name of editableNames) {
        if (keys[name]) saveDraft(storage, keys[name], filesRef.current[name], starters[name]);
      }
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") flush();
    }
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [keys, starters, editableNames]);

  const setFile = useCallback((name: string, code: string) => {
    setFiles((prev) => (prev[name] === code ? prev : { ...prev, [name]: code }));
  }, []);

  const reset = useCallback(() => {
    setFiles(starters);
    setRestored(false);
    if (keys) {
      const storage = getBrowserStorage();
      if (storage) for (const name of editableNames) if (keys[name]) removeDraft(storage, keys[name]);
    }
  }, [keys, starters, editableNames]);

  // At least one editable file differs from its starter.
  const changed = editableNames.some((n) => files[n] !== starters[n]);

  return {
    files,
    setFile,
    reset,
    restored,
    starters,
    // Something differs from the starter (show "Reset kode").
    changed,
    // ...and it is being saved (show "tersimpan di perangkat ini").
    hasDraft: keys !== null && changed,
  };
}
