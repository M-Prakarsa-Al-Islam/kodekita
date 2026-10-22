import { LinkButton } from "@/components/ui/Button";

// The "password changed" confirmation. Used both by the form (right after the
// action succeeds) and by the server-rendered page (when it re-renders after
// the recovery cookie is gone), so the learner never sees it flicker or vanish.
export default function ResetSuccess({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <p role="status" className="text-sm font-medium text-code">
        {message}
      </p>
      <p className="text-sm text-ink-soft">
        Kamu tidak perlu mengulang proses reset. Link di emailmu sudah tidak berlaku lagi setelah dipakai, dan itu
        normal.
      </p>
      <LinkButton href="/">Ke dashboard</LinkButton>
    </div>
  );
}
