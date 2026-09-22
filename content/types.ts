export type ChapterStatus = "published" | "todo";

export type Checker = {
  // stdout_exact: output must match `expected` exactly after trim.
  // Keep every auto-checked code practice deterministic (fixed inputs,
  // one correct output) - open-ended prompts like "print your name"
  // cannot be auto-graded this way.
  type: "stdout_exact";
  expected: string;
};

export type CodePractice = {
  kind: "code";
  instructions: string;
  starterCode: string;
  hints: string[];
  checker: Checker;
  successFeedback: string;
};

export type QuizPractice = {
  kind: "quiz";
  question: string;
  options: string[];
  correctIndex: number; // 0-based
  explanation: string; // shown after answering, right or wrong
};

export type Practice = CodePractice | QuizPractice;

export type Theory = {
  explanation: string; // short, plain explanation (the old "learn")
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
