function normalize(output) {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function checkOutput(actualStdout, actualError, checker) {
  if (actualError) {
    return { passed: false, message: `Program-nya error: ${actualError}` };
  }
  if (checker.type === "stdout_exact") {
    const actual = normalize(actualStdout);
    const expected = normalize(checker.expected);
    if (actual === expected) return { passed: true, message: "Benar!" };
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
function t(name, actualStdout, actualError, checker, expectPassed) {
  tests.push({ kind: "output", name, actualStdout, actualError, checker, expectPassed });
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

let failures = 0;
for (const c of tests) {
  const result =
    c.kind === "output"
      ? checkOutput(c.actualStdout, c.actualError, c.checker)
      : checkQuizAnswer(c.selected, c.correct);
  const ok = result.passed === c.expectPassed;
  console.log(`${ok ? "PASS" : "FAIL"} — ${c.name} (got passed=${result.passed}: "${result.message}")`);
  if (!ok) failures++;
}

console.log(`\n${tests.length - failures}/${tests.length} test-cases behaved as expected.`);
if (failures > 0) process.exit(1);
