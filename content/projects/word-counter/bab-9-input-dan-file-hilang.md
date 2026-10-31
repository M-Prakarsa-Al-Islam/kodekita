CHAPTER: 9
TITLE: Input dan File Hilang
FREE: no

--- LESSON L1 ---

LESSON TITLE: Menanyakan Nama File

THEORY:
Selama ini nama file ditulis langsung di dalam program. Bu Rani ingin program bisa dipakai untuk file apa saja, jadi program perlu menanyakannya.

Fungsi input() menampilkan pertanyaan, lalu mengembalikan apa yang diketik pengguna sebagai teks. Di lesson ini, jawaban pengguna sudah disiapkan di kotak Input program, jadi kamu tidak perlu mengetiknya sendiri. Keluarannya tampil seperti terminal: pertanyaan, lalu jawaban, lalu baris baru.

EXAMPLE:
description: Pertanyaan, jawaban, dan baris baru tampil seperti di terminal.
code:
```
nama = input("Nama kamu: ")
print("Halo,", nama)
# Output:
# Nama kamu: Rani
# Halo, Rani
```

PRACTICE: code
instructions: Tanyakan nama file kepada pengguna. Tugasmu:
1. Ganti nama file yang ditulis langsung dengan input() yang bertanya Nama file: dan menyimpan jawabannya di nama_file.
2. Cetak satu baris kosong setelah pertanyaan, sebelum pesan Membaca file.

Kotak Input program sudah berisi artikel-kopi.txt. Seluruh keluaran program kini harus persis seperti tampilan akhir:
```
==================================
           WORD COUNTER
==================================
Nama file: artikel-kopi.txt

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

# TODO: ganti nama file yang ditulis langsung di bawah. Tanyakan nama file kepada pengguna dengan input(),
#       cetak satu baris kosong setelahnya, lalu pesan "Membaca file"
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
stdin:
artikel-kopi.txt
hints:
1. input() menampilkan tulisan di dalam kurungnya sebagai pertanyaan, lalu mengembalikan apa yang diketik pengguna sebagai teks.
2. Simpan hasilnya di variabel nama_file, sebagai pengganti teks yang selama ini kamu tulis langsung.
3. Tulisan di dalam input() tampil persis seperti yang kamu tulis, jadi perhatikan tanda titik dua dan spasi sesudahnya.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = input("Nama file: ")
print()
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
Nama file: artikel-kopi.txt

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
- main.py must contain: input\s*\(  -> message: Outputnya sudah benar, tapi nama file belum ditanyakan dengan input().
success message: Keluaran programmu kini sama persis dengan tampilan akhir yang dijanjikan di Bab 1. Tinggal membuatnya tahan terhadap nama file yang salah.

--- LESSON L2 ---

LESSON TITLE: Membungkus Alur dalam main()

THEORY:
Pesan error yang ramah nanti harus menghentikan program di tengah jalan, tanpa mencetak ringkasan. Di dalam sebuah fungsi, perintah return menghentikan fungsi itu, jadi kita bungkus seluruh alur program dalam fungsi bernama main().

Kamu sudah mengenal main() di Python Dasar: fungsi utama yang menjadi pintu masuk program. Kodenya dipanggil dengan menulis main() di baris paling bawah file.

EXAMPLE:
description: Alur program dibungkus dalam main() dan dipanggil di baris paling bawah.
code:
```
def main():
    print("Mulai")
    print("Selesai")

main()
# Output:
# Mulai
# Selesai
```

PRACTICE: code
instructions: Bungkus alur program dalam main(). Tugasmu:
1. Buat fungsi main() di bawah baris import, dan pindahkan semua kode di bawahnya ke dalam fungsi itu (kode di dalam fungsi harus menjorok).
2. Panggil main() di baris paling bawah file.

Keluaran tidak berubah sama sekali:
```
==================================
           WORD COUNTER
==================================
Nama file: artikel-kopi.txt

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
# TODO: bungkus semua kode di bawah baris import dalam fungsi main(), lalu panggil main() di baris paling bawah
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi

garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)

nama_file = input("Nama file: ")
print()
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
stdin:
artikel-kopi.txt
hints:
1. Fungsi dibuat dengan def, tanpa parameter, dan seluruh isinya menjorok satu tingkat.
2. Di editor, pilih beberapa baris sekaligus lalu tekan Tab untuk menjorokkan semuanya.
3. Fungsi baru berjalan jika dipanggil. Pemanggilannya ditulis di baris paling bawah, tanpa menjorok.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi


def main():
    garis = "=" * 34
    print(garis)
    print("WORD COUNTER".center(34))
    print(garis)

    nama_file = input("Nama file: ")
    print()
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


main()
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Nama file: artikel-kopi.txt

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
- main.py must contain: def\s+main\s*\(\s*\)  -> message: Outputnya sudah benar, tapi fungsi main() belum dibuat.
- main.py must contain: \nmain\s*\(\s*\)  -> message: Outputnya sudah benar, tapi main() belum dipanggil di baris paling bawah.
success message: Alur programmu kini ada di dalam main(). Sekarang kita bisa menghentikannya dengan rapi saat ada masalah.

--- LESSON L3 ---

LESSON TITLE: Pesan Ramah dengan try/except

THEORY:
Bagaimana jika pengguna salah mengetik nama file? Tanpa penanganan, Python menampilkan pesan error panjang yang membingungkan. Kamu sudah mengenal try dan except: bagian try dijalankan, dan jika terjadi error jenis tertentu, bagian except mengambil alih.

Untuk file yang tidak ada, jenis errornya adalah FileNotFoundError. Di dalam fungsi, return di bagian except menghentikan seluruh fungsi, jadi sisa program tidak berjalan.

EXAMPLE:
description: File yang ada dan yang tidak ada, ditangani dengan try dan except.
code:
```
def cek(nama):
    try:
        with open(nama) as file:
            file.read()
    except FileNotFoundError:
        print("File tidak ditemukan:", nama)
        return
    print("File ada:", nama)

cek("artikel-kopi.txt")
cek("hilang.txt")
# Output:
# File ada: artikel-kopi.txt
# File tidak ditemukan: hilang.txt
```

PRACTICE: code
instructions: Tangani nama file yang salah. Tugasmu:
1. Bungkus pembukaan dan pembacaan file dengan try, dan tangani FileNotFoundError dengan except.
2. Jika file tidak ada, cetak pesan seperti di bawah ini, lalu hentikan main() dengan return.
3. Pesan Membaca file baru boleh dicetak setelah file berhasil dibuka.

Kotak Input program kali ini berisi hilang.txt, file yang tidak ada. Seluruh keluaran harus seperti ini, tanpa ringkasan:
```
==================================
           WORD COUNTER
==================================
Nama file: hilang.txt

File 'hilang.txt' tidak ditemukan. Periksa kembali nama file.
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi


def main():
    garis = "=" * 34
    print(garis)
    print("WORD COUNTER".center(34))
    print(garis)

    nama_file = input("Nama file: ")
    print()
    # TODO: bungkus pembukaan file dengan try dan except FileNotFoundError. Jika file tidak ada, cetak pesan
    #       ramah lalu hentikan fungsi. Pesan "Membaca file" baru dicetak setelah file berhasil dibuka
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


main()
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
stdin:
hilang.txt
hints:
1. Bagian yang bisa gagal adalah membuka file, jadi bagian itulah yang dibungkus dengan try.
2. except perlu tahu jenis error yang ditangani. Untuk file yang tidak ditemukan, namanya diawali File.
3. Urutan pentingnya: pesan Membaca file dipindah ke bawah blok try dan except, sehingga tidak tampil jika file tidak ada.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi


def main():
    garis = "=" * 34
    print(garis)
    print("WORD COUNTER".center(34))
    print(garis)

    nama_file = input("Nama file: ")
    print()

    try:
        with open(nama_file) as file:
            isi = file.read()
    except FileNotFoundError:
        print(f"File '{nama_file}' tidak ditemukan. Periksa kembali nama file.")
        return

    print(f"Membaca file: {nama_file}")
    print()

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


main()
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Nama file: hilang.txt

File 'hilang.txt' tidak ditemukan. Periksa kembali nama file.
```
source requirements:
- main.py must contain: try\s*:  -> message: Outputnya sudah benar, tapi pembukaan file belum dibungkus dengan try.
- main.py must contain: except\s+FileNotFoundError  -> message: Outputnya sudah benar, tapi error file tidak ditemukan belum ditangani dengan except FileNotFoundError.
success message: Sekarang programmu memberi pesan yang jelas, bukan error yang membingungkan. Satu kasus lagi: file yang kosong.

--- LESSON L4 ---

LESSON TITLE: File Kosong dan Kata Sedikit

THEORY:
Dua kasus terakhir. Pertama, file dengan kata kurang dari lima. Slicing [:5] tidak error: ia mengambil sebanyak yang ada, jadi laporan otomatis menampilkan lebih sedikit baris. Tidak ada kode tambahan yang diperlukan.

Kedua, file yang kosong. Tidak ada kata sama sekali, sehingga bagian lima kata teratas tidak punya baris apa pun, dan pengguna melihat judul yang menggantung. Untuk kasus ini kita cetak keterangan (belum ada kata).

EXAMPLE:
description: Slicing pada list yang lebih pendek dari lima tidak error.
code:
```
print(["a", "b"][:5])
print(len([]) == 0)
# Output:
# ['a', 'b']
# True
```

PRACTICE: code
instructions: Tangani file yang kosong. Tugasmu:
1. Setelah judul lima kata teratas, periksa dengan if apakah lima_teratas kosong.
2. Jika kosong, cetak (belum ada kata).

Kotak Input program kali ini berisi kosong.txt, file yang tidak punya isi. Seluruh keluaran harus seperti ini:
```
==================================
           WORD COUNTER
==================================
Nama file: kosong.txt

Membaca file: kosong.txt

--- Ringkasan ---
Jumlah kata      : 0
Kata unik        : 0

--- 5 kata yang paling sering muncul ---
(belum ada kata)
```
files:
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi


def main():
    garis = "=" * 34
    print(garis)
    print("WORD COUNTER".center(34))
    print(garis)

    nama_file = input("Nama file: ")
    print()

    try:
        with open(nama_file) as file:
            isi = file.read()
    except FileNotFoundError:
        print(f"File '{nama_file}' tidak ditemukan. Periksa kembali nama file.")
        return

    print(f"Membaca file: {nama_file}")
    print()

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
    # TODO: jika lima_teratas kosong, cetak (belum ada kata) di sini
    nomor = 1
    for kata, jumlah in lima_teratas:
        print(f"{nomor}. {kata:<10}{jumlah:>4}")
        nomor = nomor + 1


main()
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
file: kosong.txt (read-only)
```

```
stdin:
kosong.txt
hints:
1. Sebuah list yang tidak punya elemen punya panjang 0, dan len() bisa dibandingkan dengan 0.
2. if memeriksa syaratnya, dan baris di bawahnya hanya berjalan jika syaratnya terpenuhi.
3. Letakkan pemeriksaannya tepat setelah judul bagian, di dalam main() sehingga ikut menjorok.
answer files (spoiler):
file: main.py
```
from fungsi import daftar_kata, hitung_unik, hitung_frekuensi, urutkan_frekuensi


def main():
    garis = "=" * 34
    print(garis)
    print("WORD COUNTER".center(34))
    print(garis)

    nama_file = input("Nama file: ")
    print()

    try:
        with open(nama_file) as file:
            isi = file.read()
    except FileNotFoundError:
        print(f"File '{nama_file}' tidak ditemukan. Periksa kembali nama file.")
        return

    print(f"Membaca file: {nama_file}")
    print()

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
    if len(lima_teratas) == 0:
        print("(belum ada kata)")
    nomor = 1
    for kata, jumlah in lima_teratas:
        print(f"{nomor}. {kata:<10}{jumlah:>4}")
        nomor = nomor + 1


main()
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
Nama file: kosong.txt

Membaca file: kosong.txt

--- Ringkasan ---
Jumlah kata      : 0
Kata unik        : 0

--- 5 kata yang paling sering muncul ---
(belum ada kata)
```
source requirements:
- main.py must contain: \bif\b  -> message: Outputnya sudah benar, tapi keadaan list kosong belum diperiksa dengan if.
success message: Selesai! Programmu menangani file yang ada, yang tidak ada, dan yang kosong. Bab terakhir mengajarkan cara membawa programmu pulang.
