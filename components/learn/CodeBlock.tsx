// One look for every code sample in a lesson (theory examples, quiz snippets,
// spoiler answers). Focusable so keyboard users can scroll a wide block.
export default function CodeBlock({
  code,
  size = "base",
  wrap = false,
  className = "",
}: {
  code: string;
  size?: "base" | "sm";
  wrap?: boolean; // wrap long lines instead of scrolling sideways
  className?: string;
}) {
  return (
    <pre
      tabIndex={0}
      className={`rounded-lg bg-ink px-4 py-3.5 font-mono leading-6 text-white ${
        size === "sm" ? "text-xs" : "text-[0.8125rem] sm:text-sm"
      } ${wrap ? "whitespace-pre-wrap" : "overflow-x-auto"} ${className}`}
    >
      <code>{code}</code>
    </pre>
  );
}
