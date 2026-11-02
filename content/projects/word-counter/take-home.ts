// What the learner takes home from Word Counter: the folder name, which data
// files go in the zip, and the README. The README text is not secret, so it is
// the one part of the download that may be sent to the browser.
const FENCE = "```";

// The program's output on artikel-kopi.txt. scripts/test-take-home.mjs checks that
// this is identical to what the last lessons expect, so the README can never
// promise output the program does not print.
export const SAMPLE_OUTPUT = [
  "=".repeat(34),
  " ".repeat(11) + "WORD COUNTER",
  "=".repeat(34),
  "Nama file: artikel-kopi.txt",
  "",
  "Membaca file: artikel-kopi.txt",
  "",
  "--- Ringkasan ---",
  "Jumlah kata      : 92",
  "Kata unik        : 59",
  "",
  "--- 5 kata yang paling sering muncul ---",
  "1. kopi        12",
  "2. di           7",
  "3. yang         5",
  "4. banyak       4",
  "5. orang        3",
].join("\n");

export function buildReadme(usedOwnCode: boolean, lastLessonLabel: string): string {
  const origin = usedOwnCode
    ? `Proyek ini dibuat bertahap di PyMula, lewat latihan yang dicek otomatis. Setiap lesson di sana dimulai dari kode awal yang disiapkan, lalu kamu melengkapinya. Kode di folder ini adalah kode yang kamu tulis di lesson terakhir (${lastLessonLabel}) saat lesson itu lulus. Karena kode awal tiap lesson disiapkan oleh PyMula, program ini adalah hasil kerja bertahap bersama latihan-latihan itu, bukan ditulis dari nol seorang diri.`
    : `Proyek ini dibuat bertahap di PyMula, lewat latihan yang dicek otomatis. Setiap lesson di sana dimulai dari kode awal yang disiapkan. Kode di folder ini adalah versi contoh dari PyMula untuk lesson terakhir (${lastLessonLabel}), karena kode milikmu tidak ditemukan di perangkat ini (misalnya kamu mengerjakannya di perangkat lain, atau data peramban sudah dihapus). Programnya sama dengan yang kamu bangun, dan lulus pemeriksaan yang sama.`;
  return [
    "# Word Counter",
    "",
    "Program Python yang menghitung kata di sebuah file teks. Ia membersihkan teks (huruf dijadikan kecil dan tanda baca di tepi kata dibuang), lalu menampilkan jumlah kata, jumlah kata unik, dan 5 kata yang paling sering muncul.",
    "",
    "## Contoh tampilan",
    "",
    "Dijalankan pada `artikel-kopi.txt`:",
    "",
    FENCE,
    SAMPLE_OUTPUT,
    FENCE,
    "",
    "## Cara menjalankan",
    "",
    '1. Pasang Python 3 dari https://www.python.org/downloads/ . Di Windows, centang "Add python.exe to PATH" saat memasang.',
    "2. Buka terminal di dalam folder ini (Command Prompt atau PowerShell di Windows, Terminal di macOS dan Linux).",
    "3. Jalankan perintah ini:",
    "",
    FENCE,
    "python main.py",
    FENCE,
    "",
    "   Di macOS dan Linux, jika perintah itu tidak dikenali, pakai `python3 main.py`.",
    "4. Saat diminta `Nama file:`, ketik `artikel-kopi.txt`, atau nama file teks lain yang ada di folder ini.",
    "",
    "Jika file tidak ditemukan, program menampilkan pesan yang ramah lalu berhenti. Jika file kosong, laporan menampilkan `(belum ada kata)`.",
    "",
    "## Isi folder",
    "",
    "| File | Fungsi |",
    "|---|---|",
    "| `main.py` | Program utama: menanyakan nama file, membaca isinya, lalu mencetak laporan. |",
    "| `fungsi.py` | Fungsi pembantu: membersihkan kata, membuat daftar kata, menghitung kata unik dan frekuensi, serta mengurutkan. |",
    "| `artikel-kopi.txt` | Artikel contoh yang dihitung katanya. |",
    "",
    "## Yang dipakai",
    "",
    "Membaca file dengan `with open(...)`, membersihkan teks dengan `.lower()` dan `.strip()`, fungsi dan modul (`import`), dictionary dan `set`, `sorted()` dengan `key`, f-string untuk membuat kolom, `input()`, dan `try/except` untuk menangani file yang tidak ada.",
    "",
    "## Asal kode",
    "",
    origin,
    "",
    "Silakan ubah README ini dengan kata-katamu sendiri sebelum kamu mempublikasikannya.",
    "",
    "## Ide pengembangan",
    "",
    "- Tampilkan 10 kata teratas, bukan 5.",
    "- Abaikan kata sambung seperti `di`, `yang`, dan `dan`.",
    "- Biarkan pengguna memilih berapa banyak kata teratas yang ditampilkan.",
    "",
  ].join("\n");
}

export const wordCounterTakeHome = {
  folder: "word-counter",
  // Data files that go into the zip next to the program (the lesson's other read-only files, like kosong.txt, do not).
  seedFiles: ["artikel-kopi.txt"],
  buildReadme,
};
