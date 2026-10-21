"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

// Editor code state that survives refresh. With no `scope` it behaves like
// plain useState(starter) and stores nothing.
export function useCodeDraft(
  scope: { chapterSlug: string; lessonId: string } | undefined,
  starter: string
) {
  const chapterSlug = scope?.chapterSlug;
  const lessonId = scope?.lessonId;

  const [code, setCode] = useState(starter);
  const [key, setKey] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const codeRef = useRef(code);
  useEffect(() => {
    codeRef.current = code;
  });

  // 1) Whenever the lesson (or its starter) changes: start from the starter,
  //    then look for a saved draft. The user id comes from the local session
  //    (getSession reads the cookie; it does not call the network).
  useEffect(() => {
    setCode(starter);
    setKey(null);
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

      const k = draftKey(userId, chapterSlug, lessonId);
      const storage = getBrowserStorage();
      const result = resolveInitialCode(storage ? loadDraft(storage, k) : null, starter);
      // Don't overwrite code the learner already started typing meanwhile.
      if (result.restored && codeRef.current === starter) {
        setCode(result.code);
        setRestored(true);
      }
      setKey(k);
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterSlug, lessonId, starter]);

  // 2) Save shortly after typing stops.
  useEffect(() => {
    if (!key) return;
    const storage = getBrowserStorage();
    if (!storage) return;
    const t = setTimeout(() => saveDraft(storage, key, code, starter), SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [code, key, starter]);

  // 3) Don't lose the last half second when the page is refreshed / closed /
  //    switched away from (mobile browsers often kill background tabs).
  useEffect(() => {
    if (!key) return;
    function flush() {
      const storage = getBrowserStorage();
      if (storage && key) saveDraft(storage, key, codeRef.current, starter);
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
  }, [key, starter]);

  const reset = useCallback(() => {
    setCode(starter);
    setRestored(false);
    if (key) {
      const storage = getBrowserStorage();
      if (storage) removeDraft(storage, key);
    }
  }, [key, starter]);

  return {
    code,
    setCode,
    reset,
    restored,
    // There is something saved for this lesson (the code differs from the starter).
    hasDraft: key !== null && code !== starter,
  };
}
