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

export function checkOutput(
  actualStdout: string,
  actualError: string | null,
  checker: Checker
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
