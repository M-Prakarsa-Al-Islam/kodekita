export type ChapterStatus = "published" | "todo";

export type Checker = {
  // stdout_exact: output must match `expected` exactly after trim.
  // Keep every auto-checked code practice deterministic (fixed inputs,
  // one correct output) - open-ended prompts like "print your name"
  // cannot be auto-graded this way.
  type: "stdout_exact";
  expected: string;
  // Optional. Use ONLY when the output cannot tell a right answer from
  // an unchanged starter (e.g. type hints: adding `: int` or `-> float`
  // never changes what the program prints). Each `pattern` is a
  // JavaScript RegExp source string (no flags, case-sensitive) that must
  // match the learner's code (with # comments removed); checked only AFTER
  // stdout already matches,
  // and the first unmet one's `message` is shown to the learner. Keep
  // patterns whitespace-tolerant (\s*) and the message no more revealing
  // than the lesson's instructions. Do not use this for ordinary lessons.
  sourceRequirements?: SourceRequirement[];
};

export type SourceRequirement = {
  pattern: string;
  message: string;
};

export type CodePractice = {
  kind: "code";
  instructions: string;
  starterCode: string;
  hints: string[];
  // Full worked solution. Optional (older lessons don't have one) and
  // deliberately kept OUT of `hints` - it's revealed through its own
  // spoiler-warned UI, never by clicking through the numbered hints.
  answerHint?: string;
  checker: Checker;
  successFeedback: string;
};

export type QuizPractice = {
  kind: "quiz";
  question: string;
  // Optional code snippet the question asks about (e.g. "what does
  // this print?"). Rendered as a real monospace block, separate from
  // `question`, so indentation and line breaks survive - embedding
  // code directly in `question` collapses under normal text rendering.
  codeSnippet?: string;
  options: string[];
  correctIndex: number; // 0-based
  explanation: string; // shown after answering, right or wrong
};

export type Practice = CodePractice | QuizPractice;

// Optional extra blocks for long theory (e.g. a lesson that needs many
// code snippets or a table). Rendered in order after `explanation` and
// before `example`: heading (bold), text (plain, line breaks kept), code
// (same dark monospace block as `example.code`). Theory is plain text -
// there is no markdown renderer - so use this instead of embedding
// fenced code blocks or tables in `explanation`.
export type TheorySection = {
  heading?: string;
  text?: string;
  code?: string;
};

export type Theory = {
  explanation: string; // short, plain explanation (the old "learn")
  sections?: TheorySection[];
  example?: {
    description: string;
    code: string;
  };
};

export type Lesson = {
  id: string; // "L1", "L2", ... unique within its chapter
  slug: string; // url-safe, e.g. "selamat-datang"
  title: string;
  theory: Theory;
  practice: Practice;
};

export type ChapterContent = {
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  status: "published";
  lessons: Lesson[];
};

export type ChapterTodo = {
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  status: "todo";
};

export type Chapter = ChapterContent | ChapterTodo;
