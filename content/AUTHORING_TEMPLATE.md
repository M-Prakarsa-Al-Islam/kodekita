# How to write a chapter for KodeKita

Copy the block below for each chapter, fill it in, and send it to me
(pasted in chat, or as a `.md`/`.txt` file — either is fine) along with
which chapter number(s) it's for. I'll convert it into the real
`content/chapters/chapter-N.ts` file, update `index.ts` and `todo.ts`, run
the checker/quiz logic to make sure it actually works, and update
`PROGRESS.md`.

## Rules that matter

- **Every CODE practice must be deterministic.** Give fixed starting
  values so there's exactly one correct output. "Print your own name" can't
  be auto-graded — "given panjang=8 and lebar=5, print the area" can.
- **Every QUIZ practice needs exactly one correct option.**
- **For CODE practices (from Chapter 3 onward), give a full worked
  answer separately from the hints** — see `answer (spoiler)` below.
  It's rendered behind its own "⚠️ Lihat Jawaban Lengkap (Spoiler!)"
  button, never mixed into the numbered hints, so learners can't
  stumble into the full solution while clicking through normal hints.
- Keep `theory` short — a few sentences, not a full textbook page. One
  example is usually enough.
- A chapter can have as many lessons as makes sense (2–4 is typical so
  far), each ending in either a quiz OR a code practice, not both.

## Template — copy this per chapter

```
CHAPTER: <number>
TITLE: <chapter title, e.g. Fungsi>
FREE: yes/no

--- LESSON L1 ---
LESSON TITLE: <e.g. Apa Itu Fungsi?>

THEORY:
<a few sentences explaining the concept, plain Indonesian>

EXAMPLE (optional):
description: <one line describing what the example shows>
code:
```
<python code here>
```

PRACTICE: quiz
question: <question text>
options:
1. <option A>
2. <option B>
3. <option C>
4. <option D>
correct: <option number, e.g. 2>
explanation: <shown after answering, right or wrong>

--- LESSON L2 ---
LESSON TITLE: <title>

THEORY:
<explanation>

EXAMPLE (optional):
description: <line>
code:
```
<python code>
```

PRACTICE: code
instructions: <what the learner must make the program do — be exact about
  the required output, since this becomes the auto-grader's expected
  answer>
starter code:
```
<starter code, can include # TODO comments>
```
hints:
1. <hint 1>
2. <hint 2>
answer (spoiler, recommended from Chapter 3 onward):
```
<the full, correct program — shown only behind an explicit spoiler
  warning in the UI, separate from the numbered hints above>
```
expected output (exact):
```
<exactly what print() should produce, nothing else>
```
success message: <shown when they pass>

--- (add more lessons the same way) ---
```

## Worked example (Chapter 3, Lesson 1 only, for reference)

```
CHAPTER: 3
TITLE: Fungsi
FREE: yes

--- LESSON L1 ---
LESSON TITLE: Apa Itu Fungsi?

THEORY:
Fungsi adalah kumpulan kode yang diberi nama, supaya bisa dipakai berkali-
kali tanpa menulis ulang. Fungsi didefinisikan dengan kata kunci def,
diikuti nama fungsi dan tanda kurung.

EXAMPLE:
description: Fungsi sederhana yang menyapa seseorang.
code:
```
def sapa():
    print("Halo!")

sapa()
sapa()
```

PRACTICE: quiz
question: Kata kunci apa yang dipakai untuk membuat fungsi baru di Python?
options:
1. func
2. def
3. function
4. define
correct: 2
explanation: Python memakai kata kunci def untuk mendefinisikan fungsi, contohnya def nama_fungsi():.
```

Once I have your text in this format, I'll turn it straight into a working
lesson with a real, tested checker — you don't need to touch any code.
