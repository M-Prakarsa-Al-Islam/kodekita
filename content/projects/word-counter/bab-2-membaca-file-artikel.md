CHAPTER: 2
TITLE: Membaca File Artikel
FREE: yes

--- LESSON L1 ---

LESSON TITLE: Mengenal artikel-kopi.txt

THEORY:
Bu Rani mengirim artikelnya dalam sebuah file bernama artikel-kopi.txt. Sebelum bisa menghitung apa pun, programmu harus bisa membaca isi file itu.

File berakhiran .txt menyimpan teks biasa, tanpa gambar atau format khusus. Program membukanya lewat nama file. Jika hanya nama yang ditulis, Python mencari file itu di folder yang sama dengan programmu, dan di proyek ini semua file memang berada di satu folder.

Klik tab artikel-kopi.txt untuk membaca seluruh artikelnya. Ada tiga paragraf yang dipisahkan baris kosong.

EXAMPLE:
description: Dua kalimat pertama dari artikel-kopi.txt.
run: no
code:
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari.
```

PRACTICE: quiz
question: Jika program membuka file hanya dengan namanya, misalnya artikel-kopi.txt, di mana Python mencari file itu?
options:
1. Di folder yang sama dengan programmu
2. Di seluruh isi komputer
3. Di internet
4. Hanya di dalam file fungsi.py
correct: 1
explanation: Python mencari file di folder yang sama dengan programmu. Karena main.py dan artikel-kopi.txt berada di folder yang sama, menulis namanya saja sudah cukup.

--- LESSON L2 ---

LESSON TITLE: Membuka dan Membaca File

THEORY:
Kamu sudah mengenal with open(...) as file: dari Python Dasar. Polanya sama di sini: buka file, baca seluruh isinya dengan .read(), lalu pakai isinya setelah blok with selesai.

Hasil .read() adalah satu teks panjang (string) yang masih lengkap dengan baris barunya.

EXAMPLE:
description: Membaca file dan memeriksa jenis hasilnya.
code:
```
nama_file = "artikel-kopi.txt"
with open(nama_file) as file:
    isi = file.read()
print(type(isi))
# Output: <class 'str'>
```

PRACTICE: code
instructions: Banner dari Bab 1 sudah ada di main.py. Tugasmu: baca isi artikel-kopi.txt dan cetak di bawah banner.
Syaratnya:
- Nama file disimpan di variabel nama_file.
- File dibuka dengan with open(...).
- Isinya dibaca dengan .read() dan disimpan di variabel isi.
files:
file: main.py
```
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

# TODO: simpan nama file "artikel-kopi.txt" di variabel nama_file, buka dengan
# with open(), baca isinya dengan .read() ke variabel isi, lalu cetak isi.
```
file: fungsi.py
```
# Fungsi-fungsi proyek akan ditulis di sini pada bab-bab berikutnya.
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Mulailah dari sebuah variabel yang menyimpan nama file, lalu pakai variabel itu saat membuka file.
2. Pola with open yang kamu pelajari di Bab 3 Python Dasar dipakai di sini. Ingat bahwa isi blok with harus menjorok.
3. Isi file dibaca dengan .read(). Simpan hasilnya di variabel isi, lalu cetak isi setelah blok with selesai.
answer files (spoiler):
file: main.py
```
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
with open(nama_file) as file:
    isi = file.read()
print(isi)
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
source requirements:
- main.py must contain: with\s+open\s*\(  -> message: Outputnya sudah benar, tapi file belum dibuka dengan with open(...).
- main.py must contain: \.read\s*\(  -> message: Outputnya sudah benar, tapi isi file belum dibaca dengan .read().
- main.py must contain: nama_file\s*=  -> message: Outputnya sudah benar, tapi nama file belum disimpan di variabel nama_file.
success message: Berhasil! Programmu sudah bisa membaca artikel Bu Rani dan menampilkannya. Di lesson berikutnya kita buat tampilannya lebih rapi.

--- LESSON L3 ---

LESSON TITLE: Menampilkan Pesan "Membaca file"

THEORY:
Program yang ramah memberi tahu apa yang sedang dikerjakannya. Kamu akan mencetak pesan status memakai f-string, dan print() tanpa isi di dalam kurung mencetak satu baris kosong.

Artikel yang panjang akan memenuhi layar, jadi kita tampilkan paragraf pertamanya saja sebagai pratinjau. File teks menyimpan akhir baris sebagai \n, dan setiap paragraf artikel ini berada dalam satu baris. Karena itu isi.split("\n") menghasilkan list baris, dan elemen pertamanya adalah paragraf pertama.

Catatan: pratinjau ini hanya sementara. Di bab berikutnya ia diganti dengan perhitungan kata.

EXAMPLE:
description: Memecah teks per baris dan mengambil baris pertama.
code:
```
catatan = "baris satu\nbaris dua\nbaris tiga"
baris = catatan.split("\n")
print(baris[0])
# Output: baris satu
```

PRACTICE: code
instructions: Rapikan tampilan program di main.py. Tugasmu:
1. Cetak pesan status Membaca file: diikuti nama file, memakai variabel nama_file.
2. Cetak satu baris kosong setelah pesan status.
3. Ganti pencetakan seluruh isi agar yang tampil hanya paragraf pertama artikel. Ambil paragraf itu dengan .split(), jangan mengetik ulang isinya.

Hasil yang diharapkan (baris terakhir adalah paragraf pertama artikel):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

(paragraf pertama artikel-kopi.txt)
```
files:
file: main.py
```
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
# TODO 1: cetak "Membaca file: " diikuti nama file (pakai f-string), lalu satu baris kosong

with open(nama_file) as file:
    isi = file.read()

# TODO 2: ganti print(isi) di bawah ini agar yang tampil hanya paragraf pertama
print(isi)
```
file: fungsi.py
```
# Fungsi-fungsi proyek akan ditulis di sini pada bab-bab berikutnya.
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Pesan status memakai f-string yang memuat variabel nama_file. Baris kosong dicetak dengan print() yang tidak diberi isi.
2. Setiap paragraf berada dalam satu baris. Memecah isi pada tanda akhir baris menghasilkan list yang tiap elemennya adalah satu paragraf.
3. Paragraf pertama adalah elemen dengan indeks 0 dari list itu. Ganti pencetakan isi agar hanya elemen tersebut yang dicetak.
answer files (spoiler):
file: main.py
```
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

paragraf_pertama = isi.split("\n")[0]
print(paragraf_pertama)
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.
```
source requirements:
- main.py must contain: \.split\s*\(  -> message: Outputnya sudah benar, tapi paragraf pertama belum diambil dengan .split().
success message: Keren! Programmu kini membuka dengan banner, memberi tahu file apa yang dibaca, dan menampilkan pratinjau artikel. Bab 2 selesai, dan kamu siap menghitung kata.
