CHAPTER: 6
TITLE: Menghitung Frekuensi
FREE: no

--- LESSON L1 ---

LESSON TITLE: Dictionary Penghitung

THEORY:
Bu Rani akhirnya menanyakan hal yang sebenarnya ingin ia ketahui: "Kata apa yang paling sering kupakai?" Untuk menjawabnya, kita perlu tahu berapa kali setiap kata muncul.

Alat yang pas adalah dictionary. Kuncinya adalah kata, dan nilainya adalah hitungannya. Untuk setiap kata ada dua kemungkinan: kata itu sudah ada di dictionary, maka hitungannya ditambah 1, atau belum ada, maka ia dimulai dari 1.

EXAMPLE:
description: Menghitung kemunculan dengan dictionary.
code:
```
hitungan = {}
for huruf in ["a", "b", "a"]:
    if huruf in hitungan:
        hitungan[huruf] = hitungan[huruf] + 1
    else:
        hitungan[huruf] = 1
print(hitungan)
# Output: {'a': 2, 'b': 1}
```

PRACTICE: code
instructions: Hitung kemunculan setiap kata di kata_bersih. Tugasmu:
1. Buat dictionary kosong bernama frekuensi.
2. Untuk setiap kata di kata_bersih, tambahkan hitungannya di frekuensi.
3. Di bawah ringkasan, cetak satu baris kosong, lalu satu baris contoh yang menampilkan hitungan kata kopi.

Bagian akhir keluaran harus seperti ini (baris contoh ini hanya sementara):
```
Kata unik        : 59

Contoh: kata kopi muncul 12 kali
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik

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

# TODO 1: buat dictionary kosong bernama frekuensi
# TODO 2: untuk setiap kata di kata_bersih: kalau sudah ada di frekuensi, tambah hitungannya 1;
#         kalau belum, mulai dari 1
# TODO 3: cetak satu baris kosong, lalu satu baris contoh yang menampilkan hitungan kata kopi
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
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Dictionary menyimpan pasangan kunci dan nilai. Di sini kuncinya adalah kata dan nilainya adalah hitungannya.
2. Untuk setiap kata ada dua kemungkinan: kuncinya sudah ada di dictionary atau belum. Operator in bisa memeriksanya.
3. Menambah hitungan berarti mengambil nilai lama, lalu menyimpan nilai lama ditambah 1 pada kunci yang sama.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik

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

frekuensi = {}
for kata in kata_bersih:
    if kata in frekuensi:
        frekuensi[kata] = frekuensi[kata] + 1
    else:
        frekuensi[kata] = 1

print()
print(f"Contoh: kata kopi muncul {frekuensi['kopi']} kali")
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

Contoh: kata kopi muncul 12 kali
```
source requirements:
- main.py must contain: \{\s*\}  -> message: Outputnya sudah benar, tapi dictionary kosong untuk frekuensi belum dibuat.
success message: Kopi muncul 12 kali, persis seperti di tampilan akhir. Penghitungnya jalan! Berikutnya kita pindahkan ke fungsi.

--- LESSON L2 ---

LESSON TITLE: Fungsi hitung_frekuensi()

THEORY:
Seperti pekerjaan sebelumnya, penghitung frekuensi lebih baik menjadi fungsi di fungsi.py. Fungsi menerima list kata dan mengembalikan dictionary hitungannya. Yang mencetak tetap main.py.

EXAMPLE:
description: Fungsi yang mengembalikan dictionary.
code:
```
def hitung_huruf(daftar):
    hasil = {}
    for h in daftar:
        if h in hasil:
            hasil[h] = hasil[h] + 1
        else:
            hasil[h] = 1
    return hasil

print(hitung_huruf(["x", "y", "x", "x"]))
# Output: {'x': 3, 'y': 1}
```

PRACTICE: code
instructions: Pindahkan penghitung frekuensi ke fungsi. Tugasmu:
1. Di fungsi.py, buat fungsi hitung_frekuensi(daftar) yang mengembalikan dictionary hitungan setiap kata di daftar.
2. Di main.py, impor fungsi itu dan pakai untuk mengisi frekuensi. Hapus penghitung lama dari main.py.

Keluaran tidak berubah:
```
Kata unik        : 59

Contoh: kata kopi muncul 12 kali
```
files:
file: main.py
```
# TODO 1: pindahkan penghitung frekuensi ke fungsi hitung_frekuensi(daftar) di fungsi.py
# TODO 2: di main.py, impor fungsi itu dan pakai untuk mengisi frekuensi
from fungsi import daftar_kata, hitung_unik

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

frekuensi = {}
for kata in kata_bersih:
    if kata in frekuensi:
        frekuensi[kata] = frekuensi[kata] + 1
    else:
        frekuensi[kata] = 1

print()
print(f"Contoh: kata kopi muncul {frekuensi['kopi']} kali")
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
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. Isi fungsi sama dengan penghitung yang kamu tulis di lesson sebelumnya, hanya saja bahannya datang lewat parameter.
2. Fungsi mengirim kembali dictionary yang sudah terisi. Dictionary kosongnya dibuat di dalam fungsi, bukan di luar.
3. Di main.py, tambahkan nama fungsi baru ke daftar yang diimpor dari fungsi.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi

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

print()
print(f"Contoh: kata kopi muncul {frekuensi['kopi']} kali")
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

Contoh: kata kopi muncul 12 kali
```
source requirements:
- fungsi.py must contain: def\s+hitung_frekuensi\s*\(  -> message: Outputnya sudah benar, tapi fungsi hitung_frekuensi() belum ada di fungsi.py.
- fungsi.py must contain: \{\s*\}  -> message: Outputnya sudah benar, tapi fungsi hitung_frekuensi() belum membuat dictionary kosong.
- main.py must contain: hitung_frekuensi\s*\(  -> message: Outputnya sudah benar, tapi main.py belum memanggil hitung_frekuensi().
success message: Penghitung frekuensi kini punya tempatnya sendiri. Sekarang kita lihat apa isi dictionary itu.

--- LESSON L3 ---

LESSON TITLE: Mengintip Isi dengan .items()

THEORY:
Untuk melihat isi dictionary, gunakan .items(). Perulangan for bisa memegang kunci dan nilai sekaligus pada setiap putaran, sehingga kamu bisa memeriksa nilainya sebelum mencetak.

Dictionary mengingat urutan kunci pertama kali dimasukkan. Maka kata yang muncul lebih dulu di artikel tampil lebih dulu juga, bukan berdasarkan jumlahnya. Urutan ini nanti penting saat ada beberapa kata dengan jumlah yang sama.

EXAMPLE:
description: Melihat kunci dan nilai sekaligus dengan .items().
code:
```
hitungan = {"a": 2, "b": 1}
for huruf, jumlah in hitungan.items():
    print(huruf, jumlah)
# Output:
# a 2
# b 1
```

PRACTICE: code
instructions: Tampilkan kata-kata yang sering muncul. Tugasmu:
1. Hapus dua baris contoh yang tadi.
2. Cetak satu baris kosong, lalu judul seperti pada contoh di bawah.
3. Dengan perulangan atas frekuensi.items(), cetak setiap kata yang muncul 3 kali atau lebih dalam bentuk kata: jumlah.

Perhatikan urutannya: mengikuti kemunculan pertama di artikel, bukan jumlahnya. Bagian akhir keluaran harus seperti ini (tampilan ini juga sementara):
```
Kata unik        : 59

Kata yang muncul 3 kali atau lebih:
kopi: 12
yang: 5
banyak: 4
orang: 3
di: 7
dan: 3
biji: 3
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi

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

# TODO: ganti dua baris contoh di bawah dengan perulangan atas frekuensi.items() yang mencetak
#       judul dan semua kata yang muncul 3 kali atau lebih
print()
print(f"Contoh: kata kopi muncul {frekuensi['kopi']} kali")
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
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. .items() memberi pasangan kunci dan nilai, dan perulangan for bisa memegang keduanya sekaligus.
2. Periksa nilainya dengan if sebelum mencetak, supaya hanya kata yang cukup sering muncul yang tampil.
3. Urutan tampilnya mengikuti urutan kata pertama kali masuk ke dictionary, jadi kamu tidak perlu mengurutkan apa pun.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi

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

print()
print("Kata yang muncul 3 kali atau lebih:")
for kata, jumlah in frekuensi.items():
    if jumlah >= 3:
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

Kata yang muncul 3 kali atau lebih:
kopi: 12
yang: 5
banyak: 4
orang: 3
di: 7
dan: 3
biji: 3
```
source requirements:
- main.py must contain: \.items\s*\(\s*\)  -> message: Outputnya sudah benar, tapi perulangan belum memakai .items().
success message: Kopi unggul dengan 12, tapi daftarnya belum urut dari yang terbanyak. Itulah tugas Bab 7: mengurutkan untuk mendapatkan 5 kata teratas.
