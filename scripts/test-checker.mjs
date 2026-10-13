function normalize(output) {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function firstUnmetRequirement(sourceCode, requirements) {
  if (!requirements || requirements.length === 0) return null;
  if (sourceCode === undefined) return "Kodemu belum bisa diperiksa. Coba jalankan ulang.";
  const code = sourceCode.replace(/#.*$/gm, "");
  for (const req of requirements) {
    try {
      if (!new RegExp(req.pattern).test(code)) return req.message;
    } catch {
      return "Aturan pemeriksaan jawaban tidak valid. Laporkan ke admin.";
    }
  }
  return null;
}

function checkOutput(actualStdout, actualError, checker, sourceCode) {
  if (actualError) {
    return { passed: false, message: `Program-nya error: ${actualError}` };
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

function checkQuizAnswer(selectedIndex, correctIndex) {
  return {
    passed: selectedIndex === correctIndex,
    message: selectedIndex === correctIndex ? "Benar!" : "Belum tepat, coba lagi.",
  };
}

const tests = [];
function t(name, actualStdout, actualError, checker, expectPassed, sourceCode) {
  tests.push({ kind: "output", name, actualStdout, actualError, checker, expectPassed, sourceCode });
}
function tq(name, selected, correct, expectPassed) {
  tests.push({ kind: "quiz", name, selected, correct, expectPassed });
}

// --- Chapter 1 challenge: print exactly two fixed lines ---
const ch1Checker = {
  type: "stdout_exact",
  expected: "Halo, dunia!\nSaya baru belajar Python.",
};

t("ch1 correct solution", "Halo, dunia!\nSaya baru belajar Python.\n", null, ch1Checker, true);
t("ch1 correct, no trailing newline", "Halo, dunia!\nSaya baru belajar Python.", null, ch1Checker, true);
t("ch1 wrong text", "Halo dunia\nSaya baru belajar Python.", null, ch1Checker, false);
t("ch1 swapped line order", "Saya baru belajar Python.\nHalo, dunia!", null, ch1Checker, false);
t("ch1 empty output (student didn't call print)", "", null, ch1Checker, false);
t("ch1 syntax error from bad code", "", "SyntaxError: invalid syntax", ch1Checker, false);
t("ch1 extra trailing blank line should still pass", "Halo, dunia!\nSaya baru belajar Python.\n\n", null, ch1Checker, true);

// --- Chapter 2 challenge: compute area of 8 x 5 rectangle ---
const ch2Checker = { type: "stdout_exact", expected: "Luas: 40" };

t("ch2 correct solution", "Luas: 40\n", null, ch2Checker, true);
t("ch2 wrong formula (perimeter instead of area)", "Luas: 26", null, ch2Checker, false);
t("ch2 right number wrong label", "Hasil: 40", null, ch2Checker, false);
t("ch2 off-by-one", "Luas: 41", null, ch2Checker, false);
t("ch2 extra space is still caught (significant)", "Luas:  40", null, ch2Checker, false);

// --- Chapter 1 L1 quiz (correctIndex: 0) ---
tq("ch1 L1 correct answer", 0, 0, true);
tq("ch1 L1 wrong answer", 2, 0, false);

// --- Chapter 2 L1 quiz (correctIndex: 0) ---
tq("ch2 L1 correct answer", 0, 0, true);
tq("ch2 L1 wrong answer (leading digit)", 1, 0, false);
tq("ch2 L1 wrong answer (space)", 2, 0, false);
tq("ch2 L1 wrong answer (dash)", 3, 0, false);

// --- sourceRequirements (used by chapter 13 type-hint lessons) ---
const srcChecker = {
  type: "stdout_exact",
  expected: "80000.0",
  sourceRequirements: [
    { pattern: "def\\s+hitung_diskon\\s*\\([^)]*\\bharga\\s*:\\s*int\\b", message: "harga belum int" },
    { pattern: "def\\s+hitung_diskon\\s*\\([^)]*\\)\\s*->\\s*float\\s*:", message: "return belum float" },
  ],
};
const hinted = "def hitung_diskon(harga: int, persen: int) -> float:\n    return 1.0";
const unhinted = "def hitung_diskon(harga, persen):\n    return 1.0";
t("src: output right + requirements met", "80000.0", null, srcChecker, true, hinted);
t("src: output right + whitespace variations still pass", "80000.0", null, srcChecker, true, "def hitung_diskon( harga:int , persen : int )  ->float :\n    pass");
t("src: output right but hints missing (unchanged starter) fails", "80000.0", null, srcChecker, false, unhinted);
t("src: first requirement met, second missing fails", "80000.0", null, srcChecker, false, "def hitung_diskon(harga: int, persen: int):\n    pass");
t("src: wrong output fails even if hints present", "1.0", null, srcChecker, false, hinted);
t("src: hints only inside the wrong function name fails", "80000.0", null, srcChecker, false, "def lain(harga: int) -> float:\n    pass");
t("src: requirements exist but no source passed fails closed", "80000.0", null, srcChecker, false, undefined);
t("src: correct signature only inside a # comment does not count", "80000.0", null, srcChecker, false, "# " + hinted.split("\n")[0] + "\n" + unhinted);
t("src: hint after code on same line still counts (comment only strips after #)", "80000.0", null, srcChecker, true, hinted + "  # ok");
t("src: invalid regex fails closed (no crash)", "80000.0", null, { type: "stdout_exact", expected: "80000.0", sourceRequirements: [{ pattern: "(", message: "x" }] }, false, hinted);
t("src: checker without requirements ignores source (old lessons)", "Luas: 40", null, ch2Checker, true, "anything");

let failures = 0;
for (const c of tests) {
  const result =
    c.kind === "output"
      ? checkOutput(c.actualStdout, c.actualError, c.checker, c.sourceCode)
      : checkQuizAnswer(c.selected, c.correct);
  const ok = result.passed === c.expectPassed;
  console.log(`${ok ? "PASS" : "FAIL"} — ${c.name} (got passed=${result.passed}: "${result.message}")`);
  if (!ok) failures++;
}

console.log(`\n${tests.length - failures}/${tests.length} test-cases behaved as expected.`);
if (failures > 0) process.exit(1);
