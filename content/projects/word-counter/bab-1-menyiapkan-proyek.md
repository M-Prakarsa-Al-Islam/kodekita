PROJECT: word-counter
PROJECT TITLE: Build a Word Counter
PRICE: 10000
FILES: main.py, fungsi.py
SEED FILES: artikel-kopi.txt (read-only)

CHAPTER: 1
TITLE: Menyiapkan Proyek
FREE: yes

--- LESSON L1 ---

LESSON TITLE: Apa yang Akan Kita Bangun?

THEORY:
Bu Rani menulis blog tentang kopi. Ia penasaran: kata apa yang paling sering ia pakai di tulisannya? Menghitungnya satu per satu jelas melelahkan, jadi ia meminta bantuanmu membuat program kecil bernama Word Counter.

Program ini meminta nama sebuah file teks, membacanya, lalu menampilkan ringkasan: jumlah kata, jumlah kata unik, dan 5 kata yang paling sering muncul. Inilah tampilan akhir yang akan kamu bangun, bab demi bab.

Kamu akan memakai banyak hal dari Python Dasar. Selain itu, kamu akan belajar hal baru: membersihkan teks, menghitung seberapa sering sebuah kata muncul, mengurutkan hasilnya, dan merapikan tampilannya.

EXAMPLE:
description: Tampilan akhir program Word Counter pada artikel tentang kopi.
run: no
code:
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

PRACTICE: quiz
question: Berdasarkan tampilan akhir di atas, kata apa yang paling sering muncul di artikel-kopi.txt, dan berapa kali?
options:
1. kopi, 12 kali
2. di, 7 kali
3. yang, 5 kali
4. orang, 3 kali
correct: 1
explanation: Daftar 5 kata teratas diurutkan dari yang paling sering muncul. Kata di peringkat 1 adalah kopi, dengan 12 kemunculan.

--- LESSON L2 ---

LESSON TITLE: Mengenal Workspace Proyek

THEORY:
Berbeda dari latihan biasa, proyek ini memakai beberapa file sekaligus. Kamu bisa berpindah antar file lewat tab di atas editor.

- main.py: file yang dijalankan saat kamu menekan tombol Jalankan. Program utamamu ada di sini.
- fungsi.py: tempat menyimpan fungsi-fungsi. File ini masih kosong dan akan terisi pada bab-bab berikutnya.
- artikel-kopi.txt: artikel yang nanti dihitung katanya. File ini hanya bisa dibaca, tidak bisa diubah.

Kamu tidak bisa menambah, menghapus, atau mengganti nama file. Yang bisa kamu ubah hanyalah isi main.py dan fungsi.py.

Penting: latihan ini hanya untuk berkenalan dengan workspace, jadi kodenya tidak dipakai lagi. Di lesson berikutnya kita mulai menulis program yang sebenarnya dari main.py yang bersih. Mulai dari sana, setiap lesson punya kode awal sendiri yang sudah disiapkan: hasil lesson sebelumnya ditambah bagian baru yang perlu kamu isi. Kode yang kamu tulis sendiri di lesson sebelumnya tidak terbawa otomatis, jadi kalau kamu menulisnya berbeda dari contoh kami, kode awal lesson berikutnya tetap memakai versi dari kami.

EXAMPLE:
description: Isi main.py yang paling sederhana. Setiap print() menampilkan satu baris.
code:
```
print("Halo dari main.py")
print("Ini baris kedua")
# Output:
# Halo dari main.py
# Ini baris kedua
```

PRACTICE: code
instructions: Buka ketiga tab untuk melihat isinya. Lalu di main.py, tambahkan satu baris print() di bawah komentar TODO agar program mencetak teks: Workspace siap dipakai
files:
file: main.py
```
print("Proyek Word Counter dimulai")
# TODO: cetak teks "Workspace siap dipakai" di bawah ini
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
1. Cukup satu baris di bawah komentar TODO.
2. Gunakan print() dengan teks di antara tanda kutip. Huruf besar dan kecilnya harus sama persis dengan yang diminta.
answer files (spoiler):
file: main.py
```
print("Proyek Word Counter dimulai")
print("Workspace siap dipakai")
```
expected output (exact):
```
Proyek Word Counter dimulai
Workspace siap dipakai
```
success message: Bagus! Kamu sudah tahu cara membaca isi tiap tab dan menjalankan main.py. Sekarang saatnya membuat bagian pertama program yang sebenarnya.

--- LESSON L3 ---

LESSON TITLE: Membuat Banner Program

THEORY:
Program yang baik membuka dengan tampilan yang rapi. Untuk membuat banner Word Counter, kamu butuh dua trik baru.

Pertama, operator * pada teks akan mengulang teks itu. Jadi "=" * 5 menghasilkan =====. Dengan begitu kamu tidak perlu mengetik tanda = berkali-kali.

Kedua, .center(lebar) menaruh teks di tengah ruang selebar lebar karakter, dengan spasi di kiri dan kanannya.

EXAMPLE:
description: Mengulang teks dengan * dan menengahkan teks dengan .center().
code:
```
garis = "=" * 5
print(garis)
# Output: =====

judul = "HAI"
print("[" + judul.center(9) + "]")
# Output: [   HAI   ]
```

PRACTICE: code
instructions: Buat banner program di main.py. Tugasmu:
1. Cetak sebuah garis yang terdiri dari 34 tanda = (gunakan operator *, jangan mengetik 34 tanda satu per satu).
2. Cetak teks WORD COUNTER yang ditengahkan pada lebar 34 dengan .center().
3. Cetak garis yang sama sekali lagi.
Kamu boleh menyimpan garis di sebuah variabel supaya tidak mengetiknya dua kali.

Hasil yang diharapkan:
```
==================================
           WORD COUNTER
==================================
```
files:
file: main.py
```
# Banner program Word Counter
# TODO: cetak garis, judul di tengah, lalu garis lagi
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
1. Operator * pada teks mengulang teks itu. Pikirkan teks apa yang harus diulang, dan berapa kali.
2. Judulnya adalah teks biasa. Panggil .center() padanya dan beri lebar yang sama dengan panjang garis.
3. Garis yang sama dicetak dua kali. Menyimpannya di sebuah variabel membuatmu tidak perlu menulisnya dua kali.
answer files (spoiler):
file: main.py
```
garis = "=" * 34
print(garis)
print("WORD COUNTER".center(34))
print(garis)
```
expected output (exact):
```
==================================
           WORD COUNTER
==================================
```
source requirements:
- main.py must contain: \*  -> message: Outputnya sudah benar, tapi garisnya belum dibuat dengan operator * untuk mengulang tanda =.
- main.py must contain: \.center\s*\(  -> message: Outputnya sudah benar, tapi judul belum ditengahkan dengan .center().
success message: Mantap! Banner Word Counter sudah tampil. Garis dan judul ini akan menjadi bagian paling atas dari program akhirmu.
