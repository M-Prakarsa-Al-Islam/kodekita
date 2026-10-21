// Turns the plain text authors write for lessons (theory, instructions, hints,
// quiz questions, explanations...) into structured pieces the UI can style:
// paragraphs, bulleted / numbered lists, "Penting:" call-outs, and code-like
// words inside sentences (e.g. .append(), kata_bersih, list[str]).
//
// Lesson text is plain text on purpose (no markdown renderer, no backticks in
// the content). So this module infers the structure from how the text is
// written, conservatively. It must NEVER lose or change a character of the
// text - scripts/test-lesson-text.mjs proves that over every real lesson.
//
// Pure (no React, no I/O) so it can be unit-tested in Node. No regex
// look-behind: older iPhone Safari throws a SyntaxError on it at load time.

export type Inline = { type: "text"; text: string } | { type: "code"; text: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "callout"; label: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; start: number; items: string[] };

// ---- inline code -----------------------------------------------------------
// Each alternative is something that is code and essentially never ordinary
// Indonesian prose:
//   CALL   print()  len(list)  .append(x)  float("-inf")  range(len(x))
//   INDEX  data[0]  huruf[1:5]  list[str]  dict[str, list[str]]
//   SNAKE  kata_bersih  hitung_diskon  is_aktif
//   CONST  True  False  None
const STR = `"[^"]*"|'[^']*'`;
const CALL_ARGS = `\\((?:${STR}|[^()\\s"']|\\((?:${STR}|[^()\\s"'])*\\))*\\)`;
const CALL = `\\.?[A-Za-z_]\\w*${CALL_ARGS}`;
const INDEX = `[A-Za-z_]\\w*\\[(?:[^\\[\\]\\s,]|, ?|\\[[^\\[\\]]*\\])*\\]`;
const SNAKE = `\\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\b`;
const CONST = `\\b(?:True|False|None)\\b`;
const INLINE_CODE_SOURCE = `${CALL}|${INDEX}|${SNAKE}|${CONST}`;

export function splitInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(new RegExp(INLINE_CODE_SOURCE, "g"))) {
    const index = m.index ?? 0;
    if (index > last) out.push({ type: "text", text: text.slice(last, index) });
    out.push({ type: "code", text: m[0] });
    last = index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}

// ---- bold lead-in of a list item ------------------------------------------
// "Unik (Tidak Menerima Duplikat): jika kamu ..." -> lead + rest. Only for a
// short, term-like lead (starts with a capital letter or a dot, at most 4
// words, no comma) so a sentence that merely contains a colon isn't bolded.
const LEAD = /^([A-Z.][^:\n,]{0,47}?)\s?:\s+(\S[\s\S]*)$/;

export function splitLead(item: string): { lead: string; rest: string } | null {
  const m = item.match(LEAD);
  if (!m) return null;
  const lead = m[1].trim();
  if (lead.split(/\s+/).length > 4) return null;
  return { lead, rest: m[2] };
}

// ---- blocks ----------------------------------------------------------------
const UL = /^\s*-\s+(\S.*?)\s*$/;
const OL = /^\s*(\d+)\.\s+(\S.*?)\s*$/;
const CALLOUT = /^(Penting|Peringatan|Catatan(?: khusus untuk \S+)?):\s+([\s\S]+)$/;

function toParagraph(text: string): Block {
  const m = text.match(CALLOUT);
  if (m) return { type: "callout", label: m[1], text: m[2] };
  return { type: "p", text };
}

export function parseLessonText(input: string): Block[] {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  // What the previous non-skipped line was, so that consecutive items of the
  // same kind join one list while anything in between starts a new one.
  let prev: "blank" | "text" | "ul" | "ol" = "blank";

  const flushPara = () => {
    if (para.length === 0) return;
    const text = para.join("\n").trim();
    if (text) blocks.push(toParagraph(text));
    para = [];
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushPara();
      prev = "blank";
      continue;
    }
    const ul = line.match(UL);
    const ol = ul ? null : line.match(OL);

    if (ul) {
      flushPara();
      const last = blocks[blocks.length - 1];
      if (prev === "ul" && last?.type === "ul") last.items.push(ul[1]);
      else blocks.push({ type: "ul", items: [ul[1]] });
      prev = "ul";
    } else if (ol) {
      flushPara();
      const last = blocks[blocks.length - 1];
      if (prev === "ol" && last?.type === "ol") last.items.push(ol[2]);
      else blocks.push({ type: "ol", start: Number(ol[1]), items: [ol[2]] });
      prev = "ol";
    } else {
      para.push(line);
      prev = "text";
    }
  }
  flushPara();
  return blocks;
}
