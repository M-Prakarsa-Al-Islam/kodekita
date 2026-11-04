"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

// A confirmation pop-up for actions that are easy to press by accident.
// - The safe choice (cancel) has the focus when it opens, so pressing Enter out of
//   habit never confirms.
// - Escape, a tap outside the box, and the cancel button all cancel.
// - Tab stays inside the box while it is open; the page behind does not scroll.
// - Focus goes back to the button that opened it.
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.(); // does nothing if the opener is gone (for example after confirming)
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCancel();
      return;
    }
    if (e.key !== "Tab") return;
    const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []);
    if (buttons.length === 0) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      data-testid="confirm-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel(); // a tap on the dark area, not inside the box
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-lg"
      >
        <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
          {title}
        </h2>
        <div id={bodyId} className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button type="button" variant="primary" data-autofocus onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="ghost" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
