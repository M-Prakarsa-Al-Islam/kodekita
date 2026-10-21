import type { Checker } from "@/content/types";

export type CheckResult = {
  passed: boolean;
  message: string;
};

// Normalizes line endings and trailing whitespace so learners aren't
// failed by an extra blank line or trailing space — but keeps case and
// internal spacing significant, since output text matters for a
// beginner "does your program produce X" challenge.
function normalize(output: string): string {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

// Returns the message of the first unmet source requirement, or null if
// there are none / all are met. Fails closed: if requirements exist but
// no source code was provided, or a pattern is not a valid RegExp, the
// lesson is not marked correct.
//
// `source` is the learner's code: a single string (classic lessons, treated as
// the file "main.py") or a map of file name -> content (multi-file lessons).
// A requirement with `file` is matched against that file only; without it,
// against all the learner's .py files together.
function firstUnmetRequirement(
  source: string | Record<string, string> | undefined,
  requirements: Checker["sourceRequirements"]
): string | null {
  if (!requirements || requirements.length === 0) return null;
  if (source === undefined) {
    return "Kodemu belum bisa diperiksa. Coba jalankan ulang.";
  }
  const files = typeof source === "string" ? { "main.py": source } : source;
  // Drop "# ..." comments first so a correct signature that is only
  // written inside a comment doesn't count. (Naive: a "#" inside a string
  // literal also truncates that line - fine for definition-shape
  // patterns, which never need to match text after a "#".)
  const stripped: Record<string, string> = {};
  for (const [name, content] of Object.entries(files)) {
    stripped[name] = content.replace(/#.*$/gm, "");
  }
  const allPython = Object.entries(stripped)
    .filter(([name]) => name.endsWith(".py"))
    .map(([, content]) => content)
    .join("\n");

  for (const req of requirements) {
    let text: string;
    if (req.file !== undefined) {
      if (!(req.file in stripped)) return req.message;
      text = stripped[req.file];
    } else {
      text = allPython;
    }
    try {
      if (!new RegExp(req.pattern).test(text)) return req.message;
    } catch {
      return "Aturan pemeriksaan jawaban tidak valid. Laporkan ke admin.";
    }
  }
  return null;
}

export function checkOutput(
  actualStdout: string,
  actualError: string | null,
  checker: Checker,
  sourceCode?: string | Record<string, string>
): CheckResult {
  if (actualError) {
    return {
      passed: false,
      message: `Program-nya error: ${actualError}`,
    };
  }

  if (checker.type === "stdout_exact") {
    const actual = normalize(actualStdout);
    const expected = normalize(checker.expected);

    if (actual === expected) {
      const unmet = firstUnmetRequirement(sourceCode, checker.sourceRequirements);
      if (unmet) return { passed: false, message: unmet };
      return { passed: true, message: "Benar!" };
    }

    return {
      passed: false,
      message:
        actual.length === 0
          ? "Program belum menghasilkan output apa pun. Pastikan ada print()."
          : "Outputnya belum sesuai. Coba periksa lagi.",
    };
  }

  return { passed: false, message: "Jenis checker tidak dikenal." };
}

export function checkQuizAnswer(
  selectedIndex: number,
  correctIndex: number
): CheckResult {
  return {
    passed: selectedIndex === correctIndex,
    message:
      selectedIndex === correctIndex ? "Benar!" : "Belum tepat, coba lagi.",
  };
}
