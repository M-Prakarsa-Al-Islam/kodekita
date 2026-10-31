CHAPTER: 5
TITLE: Fungsi dan Modul
FREE: no

--- LESSON L1 ---

LESSON TITLE: Satu Fungsi untuk Semua Kata

THEORY:
Programmu mulai panjang dan berantakan. Bu Rani meminta kamu merapikannya supaya mudah dipakai lagi. Caranya: bungkus pekerjaan dalam fungsi, lalu simpan fungsi di file tersendiri.

Mulai dari fungsi yang lebih besar. Fungsi tidak hanya mengubah satu nilai, ia juga bisa menerima bahan lewat parameter, bekerja di dalamnya, lalu mengembalikan hasil berupa list. Pemanggil cukup menyimpan hasilnya.

EXAMPLE:
description: Fungsi yang menerima list dan mengembalikan list baru.
code:
```
def gandakan(angka):
    hasil = []
    for a in angka:
        hasil.append(a * 2)
    return hasil

print(gandakan([1, 2, 3]))
# Output: [2, 4, 6]
```

PRACTICE: code
instructions: Gabungkan seluruh proses menyiapkan kata ke dalam satu fungsi bernama daftar_kata. Tugasmu:
1. Buat fungsi daftar_kata(teks) di bawah bersihkan_kata. Fungsi memecah teks menjadi kata, membersihkan tiap kata dengan bersihkan_kata, membuang yang kosong, lalu mengembalikan list kata bersih.
2. Di bagian utama program, panggil fungsi itu dengan isi dan simpan hasilnya di kata_bersih. Hapus kode lama yang melakukan hal yang sama.

Ringkasan tidak berubah, karena yang berubah hanya cara kodenya disusun:
```
--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59
```
files:
file: main.py
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

# TODO 1: buat fungsi daftar_kata(teks) di sini. Fungsi memecah teks menjadi kata, membersihkan tiap
#         kata dengan bersihkan_kata, membuang yang kosong, lalu mengembalikan list kata bersih

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

# TODO 2: ganti baris dari kata = isi.split() sampai akhir perulangan dengan satu pemanggilan
#         daftar_kata(isi) yang hasilnya disimpan di kata_bersih
kata = isi.split()
kata_bersih = []
for k in kata:
    bersih = bersihkan_kata(k)
    if bersih != "":
        kata_bersih.append(bersih)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

kata_unik = set(kata_bersih)
print(f"Kata unik        : {len(kata_unik)}")
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
1. Fungsi baru bekerja seperti perulangan yang sudah ada, tetapi bahannya datang lewat parameter dan hasilnya dikirim kembali, bukan disimpan di variabel luar.
2. Di dalam fungsi, siapkan list kosong sendiri, isi dengan kata bersih yang tidak kosong, lalu kembalikan list itu.
3. Di bagian utama, baris-baris lama yang memecah dan membersihkan kata tidak diperlukan lagi setelah fungsi dipanggil.
answer files (spoiler):
file: main.py
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

kata_unik = set(kata_bersih)
print(f"Kata unik        : {len(kata_unik)}")
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
```
source requirements:
- main.py must contain: def\s+daftar_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi daftar_kata() belum dibuat.
- main.py must contain: daftar_kata\s*\([\s\S]*daftar_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi daftar_kata() belum dipanggil di bagian utama.
success message: Bagian utama programmu kini jauh lebih pendek. Berikutnya, fungsi-fungsi itu kita pindahkan ke file sendiri.

--- LESSON L2 ---

LESSON TITLE: Memindahkan Fungsi ke fungsi.py

THEORY:
Satu file Python bisa dipakai oleh file lain sebagai modul. Nama modulnya adalah nama file tanpa .py. Jadi fungsi yang ada di fungsi.py bisa dipanggil dari main.py setelah diimpor.

Setiap file mengimpor sendiri apa yang dipakainya. Jika sebuah fungsi memakai modul string, maka modul itu harus diimpor di file tempat fungsi itu berada.

EXAMPLE:
description: Dua file: fungsi di fungsi.py, dipakai oleh main.py.
run: no
code:
```
# --- isi fungsi.py ---
def sapa(nama):
    return "Halo, " + nama

# --- isi main.py ---
from fungsi import sapa
print(sapa("Rani"))
# Output: Halo, Rani
```

PRACTICE: code
instructions: Pindahkan fungsi ke file sendiri. Tugasmu:
1. Pindahkan import string dan kedua fungsi (bersihkan_kata dan daftar_kata) dari main.py ke fungsi.py.
2. Di main.py, impor daftar_kata dari modul fungsi.

Ringkasan tetap sama, tetapi kode di main.py kini hanya berisi bagian utama:
```
--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59
```
files:
file: main.py
```
# TODO 1: pindahkan import string dan kedua fungsi ke tab fungsi.py
# TODO 2: di main.py, impor daftar_kata dari modul fungsi
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

kata_unik = set(kata_bersih)
print(f"Kata unik        : {len(kata_unik)}")
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
1. Nama modul adalah nama file tanpa .py, jadi fungsi.py diimpor sebagai fungsi.
2. Setiap file mengimpor sendiri apa yang dipakainya. Karena pembersihan kini terjadi di fungsi.py, modul string diperlukan di sana, bukan di main.py.
3. Di main.py, impor dari fungsi hanya fungsi yang dipanggil langsung oleh main.py.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata

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

kata_unik = set(kata_bersih)
print(f"Kata unik        : {len(kata_unik)}")
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
```
source requirements:
- main.py must contain: from\s+fungsi\s+import|import\s+fungsi  -> message: Outputnya sudah benar, tapi main.py belum mengimpor dari modul fungsi.
- fungsi.py must contain: def\s+bersihkan_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi bersihkan_kata() belum ada di fungsi.py.
- fungsi.py must contain: def\s+daftar_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi daftar_kata() belum ada di fungsi.py.
- fungsi.py must contain: import\s+string  -> message: Outputnya sudah benar, tapi fungsi.py belum mengimpor modul string yang dipakainya.
success message: Rapi! main.py kini hanya berisi alur program, sedangkan pekerjaan detailnya tinggal di fungsi.py.

--- LESSON L3 ---

LESSON TITLE: Kata Unik dengan Fungsi

THEORY:
Penghitungan kata unik masih berada di main.py. Pindahkan juga ke fungsi.py supaya semua logika berada di satu tempat.

Kata unik dihitung dengan set, yang membuang duplikat, lalu len() menghitung isinya. Fungsinya menerima list kata dan mengembalikan satu angka. Fungsi tidak mencetak apa pun, pencetakan tetap tugas main.py.

EXAMPLE:
description: Fungsi kecil yang menggabungkan set dan len().
code:
```
def hitung_beda(daftar):
    return len(set(daftar))

print(hitung_beda(["a", "b", "a"]))
# Output: 2
```

PRACTICE: code
instructions: Buat fungsi untuk menghitung kata unik. Tugasmu:
1. Di fungsi.py, buat fungsi hitung_unik(daftar) yang mengembalikan jumlah kata berbeda di dalam daftar.
2. Di main.py, impor fungsi itu dan pakai untuk baris Kata unik.

Ringkasan tidak berubah:
```
--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59
```
files:
file: main.py
```
from fungsi import daftar_kata

# TODO 2: impor juga hitung_unik
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = "artikel-kopi.txt"
print(f"Membaca file: {nama_file}")
print()

with open(nama_file) as file:
    isi = file.read()

# TODO 2: pakai hitung_unik untuk baris Kata unik, sebagai pengganti set di bawah
kata_bersih = daftar_kata(isi)
jumlah_kata = len(kata_bersih)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

kata_unik = set(kata_bersih)
print(f"Kata unik        : {len(kata_unik)}")
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

# TODO 1: tambahkan fungsi hitung_unik(daftar) di bawah ini
```
file: artikel-kopi.txt (read-only)
```
Kopi adalah minuman yang disukai banyak orang. Di pagi hari, kopi sering menjadi teman sarapan sehari-hari. Banyak orang minum kopi di rumah, di kantor, dan di kedai.

Kopi yang enak berasal dari biji yang dipilih secara teliti. Biji kopi tumbuh di kebun yang sejuk dan subur. Setiap daerah punya rasa kopi yang berbeda. Petani merawat kopi dengan sabar, lalu menjemur biji kopi di bawah matahari.

Sekarang banyak anak muda suka ngopi di kedai kopi. Kopi susu jadi pilihan banyak pelanggan. Orang tua juga menyukai kopi hitam. Rasa kopi hitam - pahit dan harum.
```
hints:
1. set membuang duplikat, dan len() menghitung isinya. Gabungan keduanya sudah kamu pakai di main.py.
2. Fungsi menerima list kata dan mengembalikan satu angka, bukan mencetak apa pun.
3. Jika yang diimpor dari fungsi lebih dari satu, namanya dipisah dengan koma.
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
```
source requirements:
- fungsi.py must contain: def\s+hitung_unik\s*\(  -> message: Outputnya sudah benar, tapi fungsi hitung_unik() belum ada di fungsi.py.
- fungsi.py must contain: set\s*\(  -> message: Outputnya sudah benar, tapi fungsi hitung_unik() belum memakai set().
- main.py must contain: hitung_unik\s*\(  -> message: Outputnya sudah benar, tapi main.py belum memanggil hitung_unik().
success message: Semua logika pengolahan kata kini ada di fungsi.py. Bab berikutnya menjawab pertanyaan utama Bu Rani: kata apa yang paling sering muncul?
