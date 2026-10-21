# How to write a chapter for PyMula

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
- **For CODE practices, give a full worked
  answer separately from the hints** — see `answer (spoiler)` below.
  It's rendered behind its own "⚠️ Lihat Jawaban Lengkap (Spoiler!)"
  button, never mixed into the numbered hints, so learners can't
  stumble into the full solution while clicking through normal hints.
- Keep `theory` short — a few sentences, not a full textbook page. One
  example is usually enough.
- A chapter can have as many lessons as makes sense (2–4 is typical so
  far), each ending in either a quiz OR a code practice, not both.

## How your text is displayed (typography)

Lesson text is plain text, but the page now styles it based on how you write
it. You don't need any special syntax - just write like this:

- **A blank line starts a new paragraph.** A single line break stays a line
  break inside the paragraph (so "Tugasmu:" followed by numbered steps works).
- **Lists:** start a line with `- ` for bullets, or `1. `, `2. ` for numbered
  steps. Put each item on its own line. An intro line directly above the list
  is fine.
- **A short term followed by a colon at the start of a list item is shown in
  bold**, e.g. `- Unik (Tidak Menerima Duplikat): jika kamu memasukkan ...`
  or `- .split(separator): memotong string ...`. Keep the term short (at most
  4 words, no comma) - a long sentence with a colon is left as normal text.
- **Call-outs:** a paragraph that starts with `Penting:`, `Peringatan:` or
  `Catatan:` (or `Catatan khusus untuk .items():`) is shown in a highlighted
  box. Use them sparingly, for the one thing the learner must not miss.
- **Code inside a sentence is detected automatically** and shown in a code
  style: function calls (`print()`, `len(list)`, `.append(x)`), indexing and
  type hints (`data[0]`, `list[str]`, `dict[str, int]`), snake_case names
  (`kata_bersih`), and `True` / `False` / `None`. Don't add backticks - they
  would show up as literal characters. Plain words like `if`, `for`, `else`
  or an operator such as `%` can't be detected, so they stay normal text.
- **Whole code samples** always go in the `code:` / `starter code:` blocks,
  never inline in a paragraph.
- **Nothing is ever dropped or reworded** by this styling (it is tested over
  every existing lesson), so a typo in the text is a typo on the page.

## Template — copy this per chapter

```
CHAPTER: <number>
TITLE: <chapter title, e.g. Fungsi>
FREE: yes/no
(chapter 6 onward is paid, not free)
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
code snippet (optional, if the question asks the learner to trace a
piece of code - keep this OUT of the question text itself, it gets
rendered as its own monospace block):
```
<the code the question refers to>
```
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
answer (spoiler):
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

## Worked example (Chapter 3, Lesson 1 and lesson 2 only, for reference)

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

--- LESSON L2 ---
LESSON TITLE: Memanggil Fungsi (Calling a Function)

THEORY:
Fungsi yang baru saja dibuat tidak akan berjalan dengan sendirinya; program hanya menyimpannya di memori. Agar kodenya dijalankan, kita harus "memanggilnya" (*calling*) dengan cara menuliskan nama fungsi tersebut diikuti tanda kurung `()`.

EXAMPLE:
description: Memanggil fungsi yang sudah didefinisikan.
code:
` ` `
def mulai():
    print("Sistem diaktifkan")

mulai() 
# Output: Sistem diaktifkan
` ` `

PRACTICE: code
instructions: Di bawah ini sudah tersedia fungsi bernama `tampilkan_pesan()`. Tugasmu hanya satu: panggil fungsi tersebut di baris paling bawah agar teksnya tercetak ke layar.
starter code:
` ` `
def tampilkan_pesan():
    print("Selamat datang di aplikasi!")

# Panggil fungsinya di bawah baris ini

` ` `
hints:
1. Tulis nama fungsinya.
2. Jangan lupa tambahkan tanda kurung `()` di akhir nama fungsi.
3. SPOILER JAWABAN: 
tampilkan_pesan()
expected output (exact):
` ` `
Selamat datang di aplikasi!
` ` `
success message: Bagus! Sekarang kamu tahu cara menjalankan fungsi yang sudah dibuat.

Once I have your text in this format, I'll turn it straight into a working
lesson with a real, tested checker — you don't need to touch any code.