# Tambahan template: menulis bab untuk kelas proyek

Dipakai bersama `content/AUTHORING_TEMPLATE.md`. Semua aturan di sana tetap
berlaku (lesson berakhir di kuis ATAU latihan kode, hasil harus deterministik,
jawaban lengkap dipisah dari hint, dan sebagainya). Dokumen ini hanya memuat
apa yang **berbeda** di kelas proyek.

## 1. Header proyek (sekali, di atas Bab 1)

```
PROJECT: word-counter
PROJECT TITLE: Build a Word Counter
PRICE: 10000
FILES: main.py, fungsi.py
SEED FILES: artikel-kopi.txt (read-only)
```

- `PROJECT` menjadi slug dan kunci pembelian (`course_slug`) dan kunci harga di
  `content/pricing.ts`.
- `FILES` adalah file kode yang bisa diedit. Daftar ini tetap sepanjang proyek.
- `SEED FILES` adalah file data yang selalu muncul sebagai tab read-only.

## 2. Header bab

```
CHAPTER: <nomor urut tampilan>
TITLE: <judul bab>
FREE: yes/no
```

- Di kelas proyek, `FREE` ditentukan per bab. Word Counter: Bab 1 dan 2 gratis.
- **Cerita bab** ditulis sebagai paragraf pertama `THEORY` pada lesson
  pertama bab itu. Tidak ada penanda khusus.
- **Menambah bab baru:** jangan menyisipkan nomor di tengah. Slug bab proyek
  tidak memuat nomor (misalnya `membersihkan-kata`), dan urutan tampil
  mengikuti `order`. Dengan begitu progres pembeli, yang tersimpan per id
  lesson, tidak rusak. Aturan "jangan renumber" untuk id lesson tetap berlaku.

## 3. Aturan lesson proyek

1. **Selalu multi-file.** Setiap latihan kode memakai blok `files:` dengan
   semua file proyek (kode yang bisa diedit dan file read-only), supaya tab
   yang dilihat pembelajar konsisten dari lesson ke lesson.
2. **Satu program yang tumbuh.** Starter `main.py` dan `fungsi.py` pada
   lesson N = jawaban lesson N-1 + bagian baru yang diberi `# TODO`.
   Penulis menulis starter lengkap per lesson. **Keputusan 2026-10-28:** kode
   yang ditulis pembelajar TIDAK dibawa ke lesson berikutnya. Hal ini sudah
   dijelaskan ke pembelajar di Bab 1 L2, jadi jangan menjanjikan "kodemu
   tersimpan" di teori lesson mana pun. Starter yang baru memuat jawaban model.
3. **Pengecualian: lesson perkenalan** boleh memakai file bersih, asalkan
   teori menyebutnya dengan jelas (contoh: Bab 1 L2).
4. **Instruksi lebih longgar dari kursus.** Tulis tujuan dan syarat, bukan
   langkah per baris. Pembelajar memilih cara menulisnya.
5. **Hint adalah petunjuk, BUKAN jawaban.** Hint boleh menyebut konsep atau
   nama fungsi yang perlu dipakai, dan mengarahkan ke bab yang sudah dipelajari.
   Hint tidak boleh berisi baris kode yang tinggal disalin sebagai jawaban
   (hint 3 pun tidak). Urutan: hint 1 menunjuk konsep, hint 2 menunjuk alat
   (fungsi atau metode) yang dipakai, hint 3 menunjuk bagian yang sering
   salah. Jawaban lengkap hanya di `answer files (spoiler)`. `npm test` gagal
   jika sebuah hint memuat salah satu baris jawaban (10 karakter atau lebih).
5b. **Teks yang spasinya penting ditulis di blok kode berpagar.** Teks biasa
   di layar menggabungkan deretan spasi, jadi kalimat seperti "ada 6 spasi
   sebelum titik dua" tidak bisa dibaca dari tampilan. Tulis format keluaran di
   dalam `instructions:` di antara dua baris yang hanya berisi tiga backtick:
   ````
   instructions: ... Cetak ringkasan persis seperti di bawah ini:
   ```
   --- Ringkasan ---
   Jumlah kata      : 93
   ```
   ````
   Untuk lesson yang keluarannya tidak jelas dari kalimat (format, baris kosong,
   daftar), tampilkan keluaran yang diharapkan dengan cara ini. `npm test`
   memeriksa dua hal: tidak ada prosa yang bergantung pada deretan spasi, dan
   setiap baris di blok itu benar-benar ada di keluaran yang diperiksa checker.
   Baris yang diawali tanda kurung, seperti (paragraf pertama artikel), dianggap
   keterangan dan boleh tidak ada di keluaran.
6. **Output harus persis sama dengan spesifikasi** di `PROJECT_DESIGN.md`
   bagian 5 (teks banner, titik dua, lebar kolom, aturan seri). Jangan
   menulis ulang format dari ingatan, salin dari bagian itu.
7. **Cek cara, bukan hanya output.** Pakai `source requirements` (per file)
   saat lesson mengajarkan teknik tertentu, misalnya `.center(`, `sorted(`,
   atau `with open(`. Pesan error harus diawali "Outputnya sudah benar, tapi ..."
   agar pembelajar tahu bagian mana yang kurang.
8. **Starter yang belum diubah harus gagal, jawaban harus lolos.** Itu yang
   diuji `npm test`.
9. **Urutan konsep.** Satu lesson hanya memakai konsep yang sudah muncul di
   Python Dasar atau di lesson proyek sebelumnya. Konsep yang belum diajarkan
   di Python Dasar (hasil audit di `PROJECT_DESIGN.md` bagian 5) harus
   diperkenalkan di proyek sebelum dipakai.
10. **Data uji selalu `artikel-kopi.txt`**, kecuali lesson memang membutuhkan
    teks kecil sendiri (misalnya lesson aturan seri atau file kosong). Teks
    kecil itu ditulis di blok `file:` dan dibuat read-only.
11. **Contoh di THEORY yang membaca file** (misalnya Bab 2 L2) membutuhkan
    `artikel-kopi.txt` saat tes. Skrip tes Fase 2 harus menyediakan file itu.
12. **`run: no` untuk contoh yang bukan Python.** Tes menjalankan setiap
    `EXAMPLE` sebagai Python. Jika contohnya keluaran program atau teks biasa
    (bukan kode), tulis baris `run: no` tepat setelah `description:`:
    ```
    EXAMPLE:
    description: Tampilan akhir program.
    run: no
    code:
    ```
    Contoh itu tetap tampil sebagai blok kode, tetapi tidak dijalankan.
13. **Jangan menyunting `chapter-N.ts`.** File itu dihasilkan dari `bab-N-*.md`
    oleh `node scripts/convert-project-md.mjs <proyek>`. `npm test` gagal jika
    keduanya berbeda.
14. **Input dari pengguna** memakai `stdin:`. Ingat baris `Nama file: ...`
    ikut tercetak di output yang diharapkan.

## 4. Contoh ringkas satu latihan proyek

```
PRACTICE: code
instructions: <tujuan dan syarat>
files:
file: main.py
```
<starter main.py = jawaban lesson sebelumnya + # TODO>
```
file: fungsi.py
```
<starter fungsi.py>
```
file: artikel-kopi.txt (read-only)
```
<isi artikel, disalin dari file asli>
```
hints:
1. <konsep>
2. <fungsi atau bentuk kode>
3. <hampir jawaban>
answer files (spoiler):
file: main.py
```
<jawaban lengkap main.py>
```
expected output (exact):
```
<output persis>
```
source requirements:
- main.py must contain: <regex JavaScript>  -> message: Outputnya sudah benar, tapi ...
success message: <pesan>
```

Bab 1 (`bab-1-menyiapkan-proyek.md`) adalah contoh yang sudah lengkap.
