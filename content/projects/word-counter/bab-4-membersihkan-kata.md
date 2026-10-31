CHAPTER: 4
TITLE: Membersihkan Kata
FREE: no

--- LESSON L1 ---

LESSON TITLE: Huruf Kecil dengan .lower()

THEORY:
Bu Rani melihat hasilmu dan bertanya, "Kopi dan kopi itu kata yang sama, kenapa dihitung dua kali?" Kamu setuju. Sebelum menghitung, setiap kata perlu dibersihkan dulu.

Langkah pertama: samakan huruf besar dan kecil. Metode .lower() mengubah semua huruf pada sebuah teks menjadi huruf kecil. Teks aslinya tidak berubah, yang dihasilkan adalah teks baru, jadi hasilnya perlu ditampung.

EXAMPLE:
description: Membuat versi huruf kecil tanpa mengubah teks aslinya.
code:
```
kata = "Kopi"
print(kata.lower())
print(kata)
# Output:
# kopi
# Kopi
```

PRACTICE: code
instructions: Buat versi huruf kecil dari semua kata, lalu hitung ulang ringkasannya. Tugasmu:
1. Buat list kosong bernama kata_bersih.
2. Dengan perulangan for, masukkan setiap kata dari kata ke kata_bersih dalam huruf kecil.
3. Pakai kata_bersih (bukan kata) untuk jumlah_kata dan kata_unik.

Kata unik akan turun dari 70, karena Kopi dan kopi kini dianggap sama. Ringkasannya harus menjadi:
```
--- Ringkasan ---
Jumlah kata      : 93
Kata unik        : 64
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
# TODO 1: buat list kosong bernama kata_bersih, lalu isi dengan setiap kata dari kata
#         dalam huruf kecil (pakai perulangan for)
# TODO 2: pakai kata_bersih, bukan kata, untuk jumlah_kata dan kata_unik di bawah
jumlah_kata = len(kata)

print("--- Ringkasan ---")
print(f"Jumlah kata      : {jumlah_kata}")

kata_unik = set(kata)
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
1. .lower() menghasilkan versi huruf kecil dari sebuah teks. Teks aslinya tidak berubah, jadi hasilnya harus ditampung.
2. Siapkan list kosong lebih dulu, lalu isi satu per satu di dalam perulangan for dengan metode list yang menambah elemen di bagian akhir.
3. Setelah kata_bersih terisi, ganti kata dengan kata_bersih pada dua baris yang menghitung jumlah kata dan kata unik.
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
kata_bersih = []
for k in kata:
    kata_bersih.append(k.lower())
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
Jumlah kata      : 93
Kata unik        : 64
```
source requirements:
- main.py must contain: \.lower\s*\(  -> message: Outputnya sudah benar, tapi huruf kecil belum dibuat dengan .lower().
success message: Kata unik turun dari 70 menjadi 64: Kopi dan kopi kini dianggap sama. Tapi kopi, dan kopi. (dengan tanda baca) masih dianggap berbeda. Lesson berikutnya mengatasinya.

--- LESSON L2 ---

LESSON TITLE: Menghapus Tanda Baca dengan .strip()

THEORY:
Sekarang tanda baca. Metode .strip() membuang karakter di awal dan di akhir sebuah teks. Tanpa isi di dalam kurung, yang dibuang adalah spasi. Jika diberi teks, semua karakter dalam teks itu dibuang dari kedua ujung. Karakter di tengah tidak disentuh, jadi sehari-hari tetap utuh.

Untuk menyebut semua tanda baca, kamu tidak perlu mengetiknya satu per satu. Python sudah menyediakan daftarnya di modul string.

Catatan: ingat kembali, modul adalah file berisi kode siap pakai (fungsi dan nilai) yang bisa kamu pakai di programmu tanpa menulisnya sendiri. Python sudah membawa banyak modul bawaan, termasuk string, jadi tidak ada yang perlu dipasang. Sebelum dipakai, sebuah modul diimpor dengan import di baris paling atas file. Setelah itu isinya dipanggil dengan nama modul, titik, lalu nama isinya. Contohnya string.punctuation, yaitu satu teks yang berisi semua tanda baca.

Kenapa memakai modul string dan bukan mengetik sendiri? Daftar dari modul sudah lengkap dan teruji, sedangkan daftar yang diketik sendiri mudah terlewat satu tanda baca. Dari modul string, di lesson ini kita hanya memakai satu isinya: string.punctuation.

EXAMPLE:
description: Menghapus tanda baca di kedua ujung, sementara tanda hubung di tengah kata tetap ada.
code:
```
import string

print("kopi,".strip(","))
print("(enak!)".strip(string.punctuation))
print("sehari-hari".strip(string.punctuation))
# Output:
# kopi
# enak
# sehari-hari
```

PRACTICE: code
instructions: Hapus tanda baca di awal dan akhir setiap kata. Tugasmu:
1. Impor modul string di baris paling atas main.py.
2. Di dalam perulangan, setelah huruf kecil, hapus juga tanda baca di kedua ujung kata dengan .strip() dan string.punctuation.
3. Masukkan hasilnya ke kata_bersih.

Kata unik turun lagi karena kopi, dan kopi. kini menjadi kopi. Ringkasannya harus menjadi:
```
--- Ringkasan ---
Jumlah kata      : 93
Kata unik        : 60
```
files:
file: main.py
```
# TODO 1: impor modul string di baris paling atas file ini
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
kata_bersih = []
for k in kata:
    # TODO 2: selain huruf kecil, hapus juga tanda baca di awal dan akhir setiap kata
    kata_bersih.append(k.lower())
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
1. .strip() membuang karakter di kedua ujung teks. Jika diberi teks sebagai isi, semua karakter dalam teks itu yang dibuang.
2. Modul string punya daftar semua tanda baca, jadi kamu tidak perlu mengetiknya satu per satu. Impor dulu modulnya, lalu cari nama daftar itu di dalamnya.
3. Metode teks bisa dirangkai: hasil .lower() masih berupa teks, jadi langsung bisa dipanggil .strip() padanya.
answer files (spoiler):
file: main.py
```
import string

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
kata_bersih = []
for k in kata:
    bersih = k.lower().strip(string.punctuation)
    kata_bersih.append(bersih)
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
Jumlah kata      : 93
Kata unik        : 60
```
source requirements:
- main.py must contain: import\s+string  -> message: Outputnya sudah benar, tapi modul string belum diimpor.
- main.py must contain: \.strip\s*\(  -> message: Outputnya sudah benar, tapi tanda baca belum dihapus dengan .strip().
- main.py must contain: string\.punctuation  -> message: Outputnya sudah benar, tapi daftar tanda baca dari modul string belum dipakai.
success message: Kata unik kini 60. Tapi angka itu masih janggal: seharusnya 59, dan jumlah kata masih 93, bukan 92. Ada satu potongan yang sebenarnya bukan kata. Kita cari tahu di lesson berikutnya.

--- LESSON L3 ---

LESSON TITLE: Membuang Kata Kosong

THEORY:
Bu Rani menunjuk angka 60. "Seharusnya 59," katanya. Penyebabnya satu potongan: tanda hubung yang berdiri sendiri di artikel. Setelah tanda baca di tepinya dihapus, tidak ada yang tersisa, dan hasilnya teks kosong.

Teks kosong ditulis dua tanda kutip yang berdampingan dan panjangnya 0. Ia bukan kata, tetapi sampai sekarang ikut dihitung. Solusinya: periksa dengan if, dan tambahkan ke daftar hanya jika hasilnya tidak kosong.

EXAMPLE:
description: Tanda hubung yang sendirian menjadi teks kosong setelah dibersihkan.
code:
```
hasil = "-".strip("-")
print(len(hasil))
print(hasil != "")
# Output:
# 0
# False
```

PRACTICE: code
instructions: Buang kata yang menjadi kosong setelah dibersihkan. Tugasmu:
1. Di dalam perulangan, periksa dulu apakah bersih tidak kosong.
2. Hanya jika tidak kosong, masukkan bersih ke kata_bersih.

Angkanya kini cocok dengan tampilan akhir yang dijanjikan di Bab 1:
```
--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59
```
files:
file: main.py
```
import string

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
kata_bersih = []
for k in kata:
    bersih = k.lower().strip(string.punctuation)
    # TODO: tambahkan bersih ke kata_bersih hanya jika bersih tidak kosong
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
1. Teks kosong adalah teks tanpa karakter sama sekali. Kamu bisa membandingkannya dengan dua tanda kutip yang berdampingan.
2. Gunakan if untuk menjaga baris yang menambahkan ke list: baris itu hanya dijalankan jika syaratnya terpenuhi.
3. Baris yang menambahkan ke kata_bersih perlu menjorok satu tingkat lagi di bawah if.
answer files (spoiler):
file: main.py
```
import string

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
kata_bersih = []
for k in kata:
    bersih = k.lower().strip(string.punctuation)
    if bersih != "":
        kata_bersih.append(bersih)
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
success message: Itu dia: 92 kata dan 59 kata unik, persis seperti tampilan akhir yang dijanjikan di Bab 1. Pembersihan teksnya berhasil!

--- LESSON L4 ---

LESSON TITLE: Fungsi bersihkan_kata()

THEORY:
Pembersihan satu kata kini terdiri dari beberapa langkah: huruf kecil, lalu hapus tanda baca di tepi. Bungkus langkah-langkah itu dalam satu fungsi bernama bersihkan_kata. Kodenya lebih mudah dibaca, dan bisa dipakai lagi di tempat lain.

Kamu sudah mempelajari def dan return di Python Dasar. Fungsi ini menerima satu kata dan mengembalikan kata yang sudah bersih.

EXAMPLE:
description: Fungsi yang membungkus dua langkah pembersihan.
code:
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

print(bersihkan_kata("Kopi,"))
print(bersihkan_kata("(Enak!)"))
# Output:
# kopi
# enak
```

PRACTICE: code
instructions: Bungkus pembersihan satu kata ke dalam fungsi. Tugasmu:
1. Buat fungsi bersihkan_kata(kata) di bawah import string. Fungsi menerima satu kata dan mengembalikan kata itu dalam huruf kecil, tanpa tanda baca di kedua ujungnya.
2. Di perulangan, panggil fungsi itu untuk menggantikan baris yang membersihkan kata secara langsung.

Ringkasan tidak berubah, karena fungsi hanya merapikan kodenya:
```
--- Ringkasan ---
Jumlah kata      : 92
Kata unik        : 59
```
files:
file: main.py
```
import string

# TODO 1: buat fungsi bersihkan_kata(kata) di sini. Fungsi menerima satu kata dan mengembalikan
#         kata itu dalam huruf kecil, tanpa tanda baca di kedua ujungnya

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
kata_bersih = []
for k in kata:
    # TODO 2: ganti dua baris di bawah dengan memanggil fungsi bersihkan_kata
    bersih = k.lower().strip(string.punctuation)
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
1. Fungsi dibuat dengan def, punya parameter untuk satu kata, dan mengirim hasilnya kembali dengan return.
2. Isi fungsi adalah pembersihan yang sekarang ada di perulangan: huruf kecil, lalu hapus tanda baca di kedua ujung.
3. Di perulangan, simpan hasil pemanggilan fungsi di variabel bersih, supaya pemeriksaan kata kosong di bawahnya tetap berjalan.
answer files (spoiler):
file: main.py
```
import string

def bersihkan_kata(kata):
    return kata.lower().strip(string.punctuation)

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
- main.py must contain: def\s+bersihkan_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi bersihkan_kata() belum dibuat.
- main.py must contain: return\b  -> message: Outputnya sudah benar, tapi fungsinya belum mengembalikan hasil dengan return.
- main.py must contain: bersihkan_kata\s*\([\s\S]*bersihkan_kata\s*\(  -> message: Outputnya sudah benar, tapi fungsi bersihkan_kata() belum dipanggil di perulangan.
success message: Bagus! Pembersihan kini punya nama sendiri. Di bab berikutnya kita rapikan lebih jauh dengan memindahkan fungsi ke file tersendiri.
