CHAPTER: 10
TITLE: Selesai dan Bawa Pulang
FREE: no

--- LESSON L1 ---

LESSON TITLE: Apa yang Sudah Kamu Bangun

THEORY:
Bu Rani sangat senang. Programmu sudah bisa menjawab pertanyaannya, dan bahkan memberi pesan yang ramah kalau ia salah mengetik nama file. Sebelum membawanya pulang, mari lihat sekali lagi apa yang sudah kamu bangun, dengan kata-kata biasa.

Program ini bekerja seperti lini produksi. Pertama, main.py menanyakan nama file. Kedua, isi file dibaca, dibersihkan, dan dipecah menjadi daftar kata. Ketiga, kata-kata itu dihitung: berapa jumlahnya, berapa yang berbeda, dan berapa kali tiap kata muncul. Keempat, hasil hitungannya diurutkan dari yang terbanyak. Kelima, main.py mencetak laporan berisi ringkasan dan lima kata teratas.

Pembagian tugasnya jelas. main.py mengatur alur dan semua tampilan. fungsi.py menyimpan pekerjaan di balik layar, dan setiap fungsi di dalamnya hanya mengerjakan satu hal. artikel-kopi.txt hanyalah data yang dibaca. Pembagian seperti ini membuat program mudah dikembangkan: untuk mengubah cara kata dibersihkan, kamu hanya menyentuh satu fungsi di fungsi.py.

Di lesson-lesson berikutnya kamu akan membawa programmu pulang sebagai file zip, menjalankannya di komputermu sendiri, dan menaruhnya di GitHub supaya bisa dilihat orang lain.

EXAMPLE:
description: Peta kerja program: siapa membaca, memanggil, dan mencetak apa.
run: no
code:
```
artikel-kopi.txt   dibaca oleh        main.py
main.py            memanggil          fungsi.py
fungsi.py          mengembalikan      daftar kata, hitungan, dan urutan
main.py            mencetak           laporan
```

PRACTICE: quiz
question: Di file mana fungsi urutkan_frekuensi() berada, dan siapa yang memanggilnya?
options:
1. Di fungsi.py, dan dipanggil oleh main.py
2. Di main.py, dan dipanggil oleh fungsi.py
3. Di artikel-kopi.txt, dan dipanggil oleh main.py
4. Di fungsi.py, dan dipanggil oleh artikel-kopi.txt
correct: 1
explanation: Fungsi pembantu disimpan di fungsi.py, dan main.py memanggilnya setelah mengimpornya. artikel-kopi.txt hanya berisi teks yang dibaca, ia tidak memanggil apa pun.

--- LESSON L2 ---

LESSON TITLE: README dan Unduh Zip
DOWNLOAD: yes

THEORY:
Programmu sudah selesai, dan sekarang saatnya membawanya pulang. Kamu akan mengunduhnya sebagai satu file zip. File zip adalah kotak yang membungkus beberapa file menjadi satu, sehingga mudah dikirim atau disimpan.

Zip ini berisi empat file: main.py dan fungsi.py (programmu), artikel-kopi.txt (data contoh), dan README.md. README adalah file penjelasan yang biasanya dibaca pertama kali oleh orang yang melihat sebuah proyek: apa programnya, cara menjalankannya, dan isi foldernya. Kami sudah menuliskannya untukmu, dan kamu boleh mengubahnya dengan kata-katamu sendiri.

Tombol unduh terbuka setelah semua lesson yang berisi kode selesai. Alasannya sederhana: yang kamu bawa pulang sebaiknya program yang sudah benar-benar jadi. Jika masih ada lesson kode yang belum selesai, kotak di bawah menunjukkan sisanya dan tautan untuk melanjutkan.

Satu hal yang perlu kamu tahu dengan jujur: setiap lesson di PyMula dimulai dari kode awal yang kami siapkan, dan kodemu dari lesson sebelumnya tidak dibawa otomatis. Jadi kode di zip adalah kode dari lesson kode terakhir, hasil kerja bertahap bersama latihan-latihan itu, bukan program yang ditulis dari nol seorang diri. Jika kodemu yang lulus di lesson terakhir tersimpan di perangkat ini, zip berisi kode itu. Jika tidak, zip berisi versi contoh kami yang sama dan lulus pemeriksaan yang sama. README di dalam zip menjelaskan hal ini.

EXAMPLE:
description: Bagian awal README.md di dalam zip: judul, penjelasan singkat, lalu bagian-bagian yang memudahkan orang memakai proyekmu.
run: no
code:
```
# Word Counter

Program Python yang menghitung kata di sebuah file teks. ...

## Contoh tampilan
## Cara menjalankan
## Isi folder
## Asal kode
```

PRACTICE: quiz
question: Apa fungsi file README.md di sebuah proyek?
options:
1. Menjelaskan proyek: apa isinya dan cara menjalankannya
2. Menjalankan programnya secara otomatis
3. Menyimpan data yang dibaca oleh program
4. Membuat programnya berjalan lebih cepat
correct: 1
explanation: README menjelaskan proyek kepada orang yang baru melihatnya. Ia tidak menjalankan apa pun dan tidak mempengaruhi kecepatan program.

--- LESSON L3 ---

LESSON TITLE: Menjalankan di Komputer Sendiri

THEORY:
Selama ini programmu berjalan di dalam situs PyMula. Supaya benar-benar menjadi milikmu, ia perlu bisa berjalan di luar situs ini, di komputermu sendiri. Bedanya, di situs jawaban untuk input() sudah disiapkan untukmu, sedangkan di komputermu kamu mengetiknya sendiri.

Yang kamu butuhkan hanya Python. Langkah-langkahnya:
1. Unduh Python 3 dari python.org. Di Windows, centang "Add python.exe to PATH" saat memasang.
2. Ekstrak file zip yang kamu unduh, sehingga muncul folder word-counter.
3. Buka terminal di dalam folder itu. Terminal adalah jendela tempat kamu mengetik perintah: di Windows cari Command Prompt atau PowerShell, di macOS cari Terminal.
4. Jalankan programnya dengan perintah di bawah ini.

Perintahnya adalah python main.py. Di macOS dan Linux, jika python tidak dikenali, pakai python3 main.py. Setelah program menampilkan Nama file:, ketik artikel-kopi.txt lalu tekan Enter. Kamu akan melihat laporan yang sama persis dengan yang kamu bangun di sini.

Jika kamu membaca ini di ponsel, kamu bisa melewati praktiknya dan mencobanya nanti di komputer. Lesson ini tidak menghalangi apa pun.

EXAMPLE:
description: Di terminal: masuk ke folder hasil ekstrak, jalankan programnya, lalu ketik nama file saat diminta.
run: no
code:
```
cd word-counter
python main.py
Nama file: artikel-kopi.txt
```

PRACTICE: quiz
question: Kamu sudah mengekstrak zip dan membuka terminal di dalam folder word-counter. Perintah mana yang menjalankan programmu?
options:
1. python main.py
2. python fungsi.py
3. python artikel-kopi.txt
4. python README.md
correct: 1
explanation: main.py adalah pintu masuk program: ia menanyakan nama file dan mencetak laporan. fungsi.py hanya berisi fungsi pembantu, jadi menjalankannya sendiri tidak menampilkan apa pun.

--- LESSON L4 ---

LESSON TITLE: Apa Itu GitHub dan Mengapa Mengunggah ke Sana

THEORY:
GitHub adalah situs tempat orang menyimpan proyek kode di internet. Setiap proyek disimpan dalam sebuah repositori, yaitu folder proyek yang berada di GitHub. Di dalamnya ada file-filemu dan riwayat perubahan yang pernah dibuat.

Kenapa perlu mengunggah proyek ke sana? Ada tiga alasan. Pertama, proyekmu mendapat alamat web: siapa pun yang kamu beri tautannya bisa melihat kodemu, misalnya calon pemberi kerja atau temanmu. Kedua, ia menjadi cadangan: jika laptopmu rusak atau hilang, kodemu masih aman. Ketiga, memakai GitHub adalah kebiasaan sehari-hari para programmer, jadi mencobanya sekarang adalah latihan yang berguna.

Satu hal yang perlu diingat: repositori yang bersifat publik bisa dilihat siapa saja. Proyek ini aman karena hanya berisi kode dan artikel contoh. Jangan pernah mengunggah kata sandi, kunci rahasia, atau data pribadi ke repositori publik.

EXAMPLE:
description: Alamat sebuah repositori: nama akunmu, lalu nama repositori. Tautan seperti inilah yang kamu bagikan atau tulis di CV.
run: no
code:
```
https://github.com/namakamu/word-counter
```

PRACTICE: quiz
question: Kenapa mengunggah proyek ke GitHub berguna untuk menunjukkan kemampuanmu?
options:
1. Siapa pun yang kamu beri tautannya bisa melihat dan menilai kodemu
2. GitHub otomatis membuat programmu berjalan lebih cepat
3. GitHub menjalankan programmu setiap hari tanpa diminta
4. GitHub mengubah programmu menjadi aplikasi ponsel
correct: 1
explanation: Repositori publik punya alamat web yang bisa kamu bagikan, sehingga orang lain bisa membaca kodemu. GitHub tidak mengubah cara programmu berjalan.

--- LESSON L5 ---

LESSON TITLE: Mengunggah Projekmu ke GitHub

THEORY:
Sekarang praktiknya. Kamu tidak perlu memasang apa pun, karena seluruh langkah bisa dilakukan lewat browser. Pastikan zip sudah diekstrak, sehingga main.py, fungsi.py, artikel-kopi.txt, dan README.md ada di satu folder di komputermu.

Langkah-langkahnya:
1. Buka github.com dan buat akun gratis, atau masuk jika sudah punya.
2. Klik tanda + di pojok kanan atas, lalu pilih New repository.
3. Isi nama repositori, misalnya word-counter. Pilih visibilitas Public agar bisa dilihat orang lain. Nyalakan opsi Add README, lalu klik Create repository.
4. Di halaman repositori, klik tombol Add file di atas daftar file, lalu pilih Upload files.
5. Seret keempat file ke halaman itu, atau klik choose your files untuk memilihnya.
6. Di bagian bawah, tulis pesan commit singkat, misalnya Tambah proyek Word Counter, lalu klik Commit changes.

Commit adalah foto kondisi semua file pada satu waktu, dan pesan commit adalah catatan singkat tentang foto itu. Setelah selesai, alamat repositorimu adalah https://github.com/NAMAKAMU/word-counter, dan itulah tautan yang bisa kamu bagikan.

Jika README di repositorimu masih berisi tulisan bawaan GitHub, buka README.md di repositori, klik ikon pensil (Edit), tempel isi README.md dari zip, lalu klik Commit changes. Tampilan GitHub bisa berubah dari waktu ke waktu. Jika sebuah tombol berbeda dari yang tertulis di sini, cari tombol dengan nama yang mirip.

EXAMPLE:
description: Yang harus terlihat di halaman repositorimu setelah mengunggah: keempat file itu.
run: no
code:
```
word-counter/
  README.md
  artikel-kopi.txt
  fungsi.py
  main.py
```

PRACTICE: quiz
question: Di halaman repositori, tombol mana yang kamu pakai untuk menambahkan file dari komputermu lewat browser?
options:
1. Add file, lalu Upload files
2. Fork
3. Star
4. Watch
correct: 1
explanation: Add file lalu Upload files memungkinkan kamu menyeret file dari komputer ke repositori. Fork menyalin repositori orang lain, sedangkan Star dan Watch hanya menandai atau mengikuti sebuah repositori.

--- LESSON L6 ---

LESSON TITLE: Tantangan Perluasan

THEORY:
Programmu sudah selesai, tetapi programmer jarang berhenti di situ. Setelah sebuah program jadi, langkah berikutnya biasanya mengubahnya sedikit agar lebih berguna, lalu mencoba apakah ia masih berjalan. Itulah tantangan ini.

Tantangan ini terbuka: tidak ada jawaban benar tunggal, dan tidak dinilai otomatis. Kamu memilih sendiri satu ide, mengerjakannya di komputermu (atau di editor mana pun yang kamu suka), menjalankannya, lalu menilai sendiri apakah hasilnya sesuai dengan yang kamu inginkan.

Tips: ubah sedikit demi sedikit dan jalankan setelah setiap perubahan, supaya jika ada error kamu tahu penyebabnya. Jika berhasil, unggah versi barunya ke GitHub. Dari sana kamu bisa melihat bagaimana sebuah proyek berkembang.

Sebagai gambaran, jika kata di, yang, dan dan diabaikan, lima kata teratas pada artikel kopi berubah. Kata-kata yang tadinya tertutup oleh kata sambung kini terlihat.

EXAMPLE:
description: Contoh hasil yang mungkin: lima kata teratas setelah di, yang, dan dan diabaikan. Hasil programmu boleh berbeda jika kamu memilih ide lain.
run: no
code:
```
1. kopi        12
2. banyak       4
3. orang        3
4. biji         3
5. kedai        2
```

PRACTICE: open
prompt: Pilih satu ide di bawah ini, kerjakan di komputermu, jalankan, lalu tandai selesai. Kamu boleh mengerjakan lebih dari satu, dan boleh juga membuat idemu sendiri.
ideas:
- Tampilkan 10 kata teratas, bukan 5. Perhatikan apa yang terjadi pada nomor urut dan lebar kolom.
- Abaikan kata sambung seperti di, yang, dan dan. Buat daftar kata yang diabaikan, lalu lewati kata-kata itu saat menyusun daftar kata.
- Biarkan pengguna memilih sendiri berapa banyak kata teratas yang ditampilkan, lewat input().
- Simpan laporan ke sebuah file bernama hasil.txt, selain menampilkannya di layar.
success message: Bagus! Mengubah program yang sudah jadi adalah cara terbaik untuk memahaminya lebih dalam. Jika kamu mengunggahnya ke GitHub, versi barumu kini bisa dilihat orang lain.
