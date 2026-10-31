CHAPTER: 3
TITLE: Memecah Teks Menjadi Kata
FREE: no

--- LESSON L1 ---

LESSON TITLE: Memecah dengan .split()

THEORY:
Bu Rani bertanya, "Artikelku sebenarnya berapa kata?" Cara paling sederhana adalah memecah teks menjadi potongan-potongan, lalu menghitung potongannya.

Di Python Dasar kamu memakai .split(" ") yang memotong di setiap spasi. Untuk artikel ini ada masalah: antar paragraf ada baris baru, dan .split(" ") tidak memotong di sana sehingga dua kata bisa menyatu. Bentuk .split() tanpa isi di dalam kurung memotong di semua jenis spasi sekaligus: spasi, spasi ganda, dan baris baru.

EXAMPLE:
description: Perbedaan .split(" ") dan .split() pada teks dengan spasi ganda dan baris baru.
code:
```
teks = "kopi  hitam\nsusu"
print(teks.split(" "))
print(teks.split())
# Output:
# ['kopi', '', 'hitam\nsusu']
# ['kopi', 'hitam', 'susu']
```

PRACTICE: code
instructions: Pecah isi artikel menjadi list kata. Tugasmu:
1. Pecah isi dengan .split() (tanpa isi di dalam kurung) dan simpan di variabel kata.
2. Hapus dua baris pratinjau paragraf dari Bab 2.
3. Sebagai gantinya, cetak 5 kata pertama dari kata (gunakan slicing).

Di bawah banner, pesan status, dan satu baris kosong, hasilnya harus seperti ini:
```
['Kopi', 'adalah', 'minuman', 'yang', 'disukai']
```
files:
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

# TODO 1: pecah isi menjadi list kata dengan .split(), simpan di variabel kata
# TODO 2: hapus dua baris pratinjau di bawah, lalu cetak 5 kata pertama dari kata
paragraf_pertama = isi.split("\n")[0]
print(paragraf_pertama)
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
1. Bentuk .split() tanpa isi di dalam kurung memotong di semua jenis spasi, termasuk baris baru.
2. Simpan hasil pecahannya di variabel kata. Hasilnya berupa list.
3. Untuk mengambil beberapa elemen pertama dari sebuah list, pakai slicing (dipelajari di Bab 9 Python Dasar). Cetak potongan itu sebagai pengganti pratinjau.
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

kata = isi.split()
print(kata[:5])
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

['Kopi', 'adalah', 'minuman', 'yang', 'disukai']
```
source requirements:
- main.py must contain: \.split\s*\(\s*\)  -> message: Outputnya sudah benar, tapi isi belum dipecah dengan .split() tanpa isi di dalam kurung.
success message: Bagus! Teks artikel sekarang menjadi list kata. Lesson berikutnya menghitung berapa jumlahnya.

--- LESSON L2 ---

LESSON TITLE: Menghitung dengan len()

THEORY:
Setelah teks menjadi list kata, jumlah kata sama dengan jumlah elemen list itu. Untuk menghitungnya pakai len(), fungsi yang sama dengan yang kamu pakai pada list di Python Dasar.

EXAMPLE:
description: Menghitung elemen list dengan len().
code:
```
kata = "satu dua tiga".split()
print(len(kata))
# Output: 3
```

PRACTICE: code
instructions: Hitung jumlah kata dan tampilkan sebagai ringkasan. Tugasmu:
1. Hapus print(kata[:5]) dari lesson sebelumnya.
2. Hitung jumlah kata dengan len() dan simpan di variabel jumlah_kata.
3. Cetak ringkasan di bawah pesan status dan baris kosong, dengan format persis seperti di bawah ini. Jumlah spasi sebelum tanda titik dua juga harus sama.
```
--- Ringkasan ---
Jumlah kata      : 93
```
files:
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

kata = isi.split()

# TODO: hapus print di bawah ini. Hitung jumlah kata dengan len(), simpan di jumlah_kata,
# lalu cetak judul --- Ringkasan --- dan baris Jumlah kata (format ada di instruksi)
print(kata[:5])
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
1. Jumlah elemen sebuah list dihitung dengan fungsi len().
2. Simpan hasil hitungannya di variabel jumlah_kata, lalu pakai variabel itu di dalam f-string.
3. Bandingkan baris Jumlah kata di contoh dengan milikmu. Jumlah spasi sebelum tanda titik dua harus sama persis.
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

kata = isi.split()
jumlah_kata = len(kata)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 93
```
source requirements:
- main.py must contain: len\s*\(  -> message: Outputnya sudah benar, tapi jumlah kata belum dihitung dengan len().
success message: Jalan! Programmu menghitung 93 kata. Tapi tunggu: tampilan akhir di Bab 1 menunjukkan 92. Kenapa beda? Jawabannya ada di lesson berikutnya.

--- LESSON L3 ---

LESSON TITLE: Masalah: "Kopi" dan "kopi,"

THEORY:
Bu Rani memeriksa hasilmu. "Di tampilan akhir tadi jumlah katanya 92, kenapa programmu bilang 93?" tanyanya. Ia juga ingin tahu berapa banyak kata yang berbeda.

Ada dua masalah. Pertama, tanda hubung yang berdiri sendiri ikut dihitung sebagai satu kata, padahal itu bukan kata. Kedua, huruf besar dan tanda baca menempel pada kata, sehingga Kopi, kopi, dan kopi. dianggap tiga kata berbeda.

Untuk melihat dampaknya, hitung jumlah kata yang berbeda. Kamu sudah mengenal set yang membuang duplikat. Jadi ubah list menjadi set, lalu hitung isinya dengan len().

EXAMPLE:
description: Hasilnya 4, padahal hanya ada 3 kata berbeda: kopi, enak, dan hangat.
code:
```
teks = "Kopi enak, kopi hangat."
kata = teks.split()
print(kata)
print(len(set(kata)))
# Output:
# ['Kopi', 'enak,', 'kopi', 'hangat.']
# 4
```

PRACTICE: code
instructions: Tambahkan jumlah kata unik ke ringkasan. Tugasmu:
1. Ubah kata menjadi set dengan set().
2. Hitung isinya dengan len().
3. Cetak satu baris tepat di bawah Jumlah kata, dengan format persis seperti di bawah ini. Jumlah spasi sebelum tanda titik dua juga harus sama.
```
--- Ringkasan ---
Jumlah kata      : 93
Kata unik        : 70
```
files:
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

kata = isi.split()
jumlah_kata = len(kata)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

# TODO: ubah kata menjadi set, hitung isinya dengan len(), lalu cetak baris Kata unik
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
1. set() membuang duplikat. Ubah list kata menjadi set untuk mendapatkan kata yang berbeda saja.
2. Jumlah elemen sebuah set juga dihitung dengan len().
3. Cetak dengan f-string tepat di bawah baris Jumlah kata. Spasi sebelum tanda titik dua di baris ini lebih banyak daripada baris di atasnya, supaya titik dua keduanya sejajar.
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

kata = isi.split()
jumlah_kata = len(kata)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

kata_unik = set(kata)
print(f"Kata unik        : {len(kata_unik)}")
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 93
Kata unik        : 70
```
source requirements:
- main.py must contain: set\s*\(  -> message: Outputnya sudah benar, tapi kata unik belum dihitung dengan set().
success message: Hasilnya 93 kata dan 70 kata unik, padahal seharusnya 92 dan 59. Kamu sudah menemukan masalahnya: teks belum dibersihkan. Di Bab 4 kita memperbaikinya.
