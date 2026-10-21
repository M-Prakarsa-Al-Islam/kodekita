import { Fragment } from "react";
import { parseLessonText, splitInline, splitLead } from "@/lib/lesson-text";

// Styled lesson prose. Colour is inherited, so callers can pass e.g.
// `text-ink-soft`. See lib/lesson-text.ts for what is detected.

const CODE_CLASS =
  "rounded bg-ink/[0.07] px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-ink";

// Sentence-level text with code-like words styled (use for captions, quiz
// options, one-line messages).
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {splitInline(text).map((part, i) =>
        part.type === "code" ? (
          <code key={i} className={CODE_CLASS}>
            {part.text}
          </code>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        )
      )}
    </>
  );
}

function ListItem({ text }: { text: string }) {
  const lead = splitLead(text);
  return (
    <li className="pl-1">
      {lead ? (
        <>
          <strong className="font-semibold">
            <InlineText text={lead.lead} />:
          </strong>{" "}
          <InlineText text={lead.rest} />
        </>
      ) : (
        <InlineText text={text} />
      )}
    </li>
  );
}

export default function LessonText({
  text,
  size = "base",
  className = "",
}: {
  text: string;
  size?: "base" | "sm";
  className?: string;
}) {
  const body =
    size === "base" ? "text-[1.0625rem] leading-[1.75]" : "text-[0.9375rem] leading-relaxed";

  return (
    <div className={`${body} [&>*:first-child]:mt-0 ${className}`}>
      {parseLessonText(text).map((block, i) => {
        switch (block.type) {
          case "ul":
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-6 marker:text-ink-soft">
                {block.items.map((item, j) => (
                  <ListItem key={j} text={item} />
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                start={block.start}
                className="mt-4 list-decimal space-y-2 pl-6 marker:font-medium marker:text-ink-soft"
              >
                {block.items.map((item, j) => (
                  <ListItem key={j} text={item} />
                ))}
              </ol>
            );
          case "callout":
            return (
              <div
                key={i}
                className="mt-4 rounded-r-md border-l-4 border-sun bg-sun/10 px-4 py-3 text-ink"
              >
                <p className="whitespace-pre-line text-pretty">
                  <strong className="font-semibold">
                    <InlineText text={block.label} />:
                  </strong>{" "}
                  <InlineText text={block.text} />
                </p>
              </div>
            );
          default:
            return (
              <p key={i} className="mt-4 whitespace-pre-line text-pretty">
                <InlineText text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
