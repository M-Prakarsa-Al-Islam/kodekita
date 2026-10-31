CHAPTER: 8
TITLE: Merapikan Tampilan
FREE: no

--- LESSON L1 ---

LESSON TITLE: Rata Kiri dan Kanan di f-string

THEORY:
Hasil hitunganmu sudah benar, tetapi tampilannya belum enak dibaca. Bu Rani ingin kata dan angkanya berbaris rapi seperti tabel.

Di dalam f-string, setelah nama variabel kamu bisa menulis tanda titik dua lalu aturan tampilan. Tanda < berarti rata kiri, tanda > berarti rata kanan, dan angka sesudahnya adalah lebar kolom: teks diberi spasi sampai selebar itu. Kolom dibuat dengan menempelkan beberapa bagian bertemu satu sama lain.

EXAMPLE:
description: Rata kiri selebar 10 dan rata kanan selebar 10 diberi kurung siku agar lebarnya terlihat.
code:
```
print(f"[{'kopi':<10}]")
print(f"[{'kopi':>10}]")
print(f"[{12:>4}]")
# Output:
# [kopi      ]
# [      kopi]
# [  12]
```

PRACTICE: code
instructions: Rapikan baris lima kata teratas menjadi kolom. Tugasmu:
1. Ubah baris yang dicetak di dalam perulangan.
2. Kata dibuat rata kiri selebar 10 karakter, dan jumlah rata kanan selebar 4 karakter.
3. Tidak ada tanda titik dua di antara keduanya, lebar kolomlah yang memberi jarak.

Bagian akhir keluaran harus seperti ini. Perhatikan jarak antara kata dan angkanya:
```
Kata unik        : 59

5 kata teratas:
kopi        12
di           7
yang         5
banyak       4
orang        3
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
print("5 kata teratas:")
# TODO: ubah baris di dalam perulangan: kata rata kiri selebar 10, jumlah rata kanan selebar 4, tanpa titik dua
for kata, jumlah in lima_teratas:
    print(f"{kata}: {jumlah}")
```
file: fungsi.py
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

def daftar_kata(teks):
    hasil = []
    for k in teks.split():
        bersih = bersihkan_kata(k)
        if bersih != "":
            hasil.append(bersih)
    return hasil


def hitung_unik(daftar):
    return len(set(daftar))


def hitung_frekuensi(daftar):
    frekuensi = {}
    for kata in daftar:
        if kata in frekuensi:
            frekuensi[kata] = frekuensi[kata] + 1
        else:
            frekuensi[kata] = 1
    return frekuensi


def ambil_jumlah(pasangan):
    return pasangan[1]


def urutkan_frekuensi(frekuensi):
    return sorted(frekuensi.items(), key=ambil_jumlah, reverse=True)
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Setelah nama variabel di dalam kurung kurawal f-string, tanda titik dua membuka aturan tampilan.
2. Aturan tampilan terdiri dari arah perataan, lalu lebar kolom. Arah untuk rata kiri dan rata kanan berbeda.
3. Kedua bagian ditulis berdampingan dalam satu f-string, jadi tidak ada spasi atau tanda baca tambahan di antaranya.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
print("5 kata teratas:")
for kata, jumlah in lima_teratas:
    print(f"{kata:<10}{jumlah:>4}")
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59

5 kata teratas:
kopi        12
di           7
yang         5
banyak       4
orang        3
```
source requirements:
- main.py must contain: :\s*<\s*10  -> message: Outputnya sudah benar, tapi kata belum dibuat rata kiri selebar 10.
- main.py must contain: :\s*>\s*4  -> message: Outputnya sudah benar, tapi jumlah belum dibuat rata kanan selebar 4.
success message: Kolomnya sudah rapi. Tinggal nomor urutnya.

--- LESSON L2 ---

LESSON TITLE: Nomor Urut

THEORY:
Setiap baris perlu nomor urut: 1, 2, 3, dan seterusnya. Caranya: siapkan variabel penghitung yang mulai dari 1 sebelum perulangan, cetak nilainya di setiap putaran, lalu naikkan 1.

EXAMPLE:
description: Variabel penghitung yang naik 1 di setiap putaran.
code:
```
nomor = 1
for buah in ["apel", "jeruk", "mangga"]:
    print(f"{nomor}. {buah}")
    nomor = nomor + 1
# Output:
# 1. apel
# 2. jeruk
# 3. mangga
```

PRACTICE: code
instructions: Beri nomor urut pada setiap baris. Tugasmu:
1. Buat variabel nomor yang bernilai 1 sebelum perulangan.
2. Di setiap putaran, cetak nomor, titik, spasi, lalu kolom kata dan jumlah seperti sebelumnya.
3. Naikkan nomor sebanyak 1 di akhir putaran.

Bagian akhir keluaran harus seperti ini:
```
Kata unik        : 59

5 kata teratas:
1. kopi        12
2. di           7
3. yang         5
4. banyak       4
5. orang        3
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
print("5 kata teratas:")
# TODO: beri nomor urut di depan setiap baris dengan variabel penghitung nomor yang mulai dari 1
for kata, jumlah in lima_teratas:
    print(f"{kata:<10}{jumlah:>4}")
```
file: fungsi.py
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

def daftar_kata(teks):
    hasil = []
    for k in teks.split():
        bersih = bersihkan_kata(k)
        if bersih != "":
            hasil.append(bersih)
    return hasil


def hitung_unik(daftar):
    return len(set(daftar))


def hitung_frekuensi(daftar):
    frekuensi = {}
    for kata in daftar:
        if kata in frekuensi:
            frekuensi[kata] = frekuensi[kata] + 1
        else:
            frekuensi[kata] = 1
    return frekuensi


def ambil_jumlah(pasangan):
    return pasangan[1]


def urutkan_frekuensi(frekuensi):
    return sorted(frekuensi.items(), key=ambil_jumlah, reverse=True)
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Variabel penghitung dibuat sebelum perulangan, bukan di dalamnya, supaya nilainya tidak kembali ke awal setiap putaran.
2. Nomor, titik, dan spasi dicetak lebih dulu, baru kolom kata dan jumlah yang sudah kamu atur di lesson sebelumnya.
3. Menaikkan 1 berarti menyimpan nilai lama ditambah 1 ke variabel yang sama, di bagian paling akhir isi perulangan.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
print("5 kata teratas:")
nomor = 1
for kata, jumlah in lima_teratas:
    print(f"{nomor}. {kata:<10}{jumlah:>4}")
    nomor = nomor + 1
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59

5 kata teratas:
1. kopi        12
2. di           7
3. yang         5
4. banyak       4
5. orang        3
```
success message: Barisnya sudah bernomor dan berbaris rapi. Tinggal merakit judul dan jarak antar bagian.

--- LESSON L3 ---

LESSON TITLE: Merakit Laporan Lengkap

THEORY:
Hampir selesai! Semua bagian laporan sudah ada. Tinggal menyamakan judul bagian terakhir dengan tampilan akhir yang dijanjikan di Bab 1, dan memastikan jarak antar bagian benar.

Satu baris kosong memisahkan bagian ringkasan dari bagian lima kata teratas. Judul bagian itu juga harus persis sama, termasuk tanda hubungnya.

EXAMPLE:
description: Judul bagian memakai tiga tanda hubung di kiri dan kanan, seperti judul Ringkasan.
code:
```
print("--- Contoh Judul ---")
# Output: --- Contoh Judul ---
```

PRACTICE: code
instructions: Samakan laporan dengan tampilan akhir. Tugasmu:
1. Ganti judul lima kata teratas dengan --- 5 kata yang paling sering muncul ---.
2. Pastikan ada satu baris kosong tepat sebelum judul itu.

Seluruh keluaran program harus seperti ini. Hanya baris Nama file yang belum ada, karena itu akan ditambahkan di bab berikutnya:
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59

--- 5 kata yang paling sering muncul ---
1. kopi        12
2. di           7
3. yang         5
4. banyak       4
5. orang        3
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
# TODO: ganti judul di bawah dengan judul laporan yang sesuai tampilan akhir
print("5 kata teratas:")
nomor = 1
for kata, jumlah in lima_teratas:
    print(f"{nomor}. {kata:<10}{jumlah:>4}")
    nomor = nomor + 1
```
file: fungsi.py
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

def daftar_kata(teks):
    hasil = []
    for k in teks.split():
        bersih = bersihkan_kata(k)
        if bersih != "":
            hasil.append(bersih)
    return hasil


def hitung_unik(daftar):
    return len(set(daftar))


def hitung_frekuensi(daftar):
    frekuensi = {}
    for kata in daftar:
        if kata in frekuensi:
            frekuensi[kata] = frekuensi[kata] + 1
        else:
            frekuensi[kata] = 1
    return frekuensi


def ambil_jumlah(pasangan):
    return pasangan[1]


def urutkan_frekuensi(frekuensi):
    return sorted(frekuensi.items(), key=ambil_jumlah, reverse=True)
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Judul bagian ditulis persis seperti judul Ringkasan: tiga tanda hubung, spasi, teks, spasi, tiga tanda hubung.
2. Satu baris kosong dicetak dengan print() yang tidak diberi isi, tepat sebelum judul bagian.
3. Bandingkan keluaranmu dengan blok di atas baris demi baris, termasuk huruf besar dan kecilnya.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

jumlah_unik = hitung_unik(kata_bersih)
print(f"Kata unik        : {jumlah_unik}")

frekuensi = hitung_frekuensi(kata_bersih)
lima_teratas = urutkan_frekuensi(frekuensi)[:5]

print()
print("--- 5 kata yang paling sering muncul ---")
nomor = 1
for kata, jumlah in lima_teratas:
    print(f"{nomor}. {kata:<10}{jumlah:>4}")
    nomor = nomor + 1
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Membaca file: artikel-kopi.txt

--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59

--- 5 kata yang paling sering muncul ---
1. kopi        12
2. di           7
3. yang         5
4. banyak       4
5. orang        3
```
source requirements:
- main.py must contain: ---\s+5 kata yang paling sering muncul\s+---  -> message: Outputnya sudah benar, tapi judul bagian belum memakai teks yang diminta.
success message: Hampir sempurna! Laporanmu sudah sama dengan tampilan akhir, kecuali pertanyaan nama file. Bab berikutnya menambahkannya, dan menangani file yang hilang.
