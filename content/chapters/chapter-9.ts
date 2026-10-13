import type { ChapterContent } from "@/content/types";

export const chapter9: ChapterContent = {
  slug: "9-list",
  order: 9,
  title: "List",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "pengenalan-list-dan-indeks",
      title: "Pengenalan List dan Indeks",
      theory: {
        explanation: `Hingga saat ini, kita menyimpan satu nilai di dalam satu variable. Namun, bagaimana jika kita ingin menyimpan puluhan atau ratusan data? Di sinilah tipe data List berperan.

List adalah struktur data di Python yang digunakan untuk menyimpan sekumpulan nilai dalam satu variable tunggal. List ditandai dengan tanda kurung siku [], dan setiap nilainya dipisahkan oleh koma.
Untuk mengakses elemen di dalam list, kita menggunakan sistem indeks. Di Python, penghitungan indeks selalu dimulai dari angka 0, bukan 1.`,
        example: {
          description: "Mengakses elemen list menggunakan indeks.",
          code: `buah = ["Apel", "Mangga", "Jeruk"]
# Indeks 0 = Apel, 1 = Mangga, 2 = Jeruk

print(buah[0]) # Output: Apel
print(buah[2]) # Output: Jeruk`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini terdapat list karyawan yang berisi nama-nama staf di " +
          "sebuah perusahaan. Tugasmu adalah mencetak nama staf yang berada di " +
          "urutan ketiga secara fisik di dalam list tersebut menggunakan " +
          "fungsi print() dan pengaksesan indeks.",
        starterCode: `karyawan = ["Andi", "Budi", "Citra", "Diana", "Eka"]

# Cetak nama karyawan yang berada di urutan ketiga secara fisik
`,
        hints: [
          "Urutan ketiga secara fisik berarti kamu melompati urutan pertama dan kedua.",
          "Karena Python memulai indeks dari 0, maka elemen urutan pertama adalah indeks 0, urutan kedua indeks 1, dan urutan ketiga adalah indeks 2.",
          "Gunakan print(karyawan[2]).",
        ],
        answerHint: `print(karyawan[2])`,
        checker: {
          type: "stdout_exact",
          expected: "Citra",
        },
        successFeedback:
          'Tepat sekali! Membiasakan diri dengan konsep "Zero-based indexing" ' +
          "(indeks yang dimulai dari nol) adalah langkah pertama yang paling " +
          "fundamental dalam menguasai struktur data.",
      },
    },
    {
      id: "L2",
      slug: "panjang-list",
      title: "Mengetahui Panjang List",
      theory: {
        explanation: `Terkadang kita tidak tahu secara pasti ada berapa banyak elemen di dalam sebuah list, terutama jika datanya berasal dari database atau input pengguna. Untuk menghitung total elemen di dalam sebuah list secara instan, Python menyediakan fungsi bawaan len() (singkatan dari length).

Fungsi len() akan selalu mengembalikan jumlah elemen yang sebenarnya, dihitung secara normal dari angka 1.`,
        example: {
          description: "Menghitung total elemen di dalam list.",
          code: `keranjang = ["Buku", "Pena", "Penggaris", "Penghapus"]
jumlah_barang = len(keranjang)

print(jumlah_barang)
# Output: 4`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sebuah sistem pendaftaran mencatat email pengguna ke dalam list " +
          "pendaftar. Gunakan fungsi len() untuk menghitung ada berapa jumlah " +
          "email di dalam list tersebut, lalu cetak angkanya menggunakan print().",
        starterCode: `pendaftar = ["user1@mail.com", "user2@mail.com", "admin@mail.com"]

# Hitung jumlah pendaftar dan cetak hasilnya
`,
        hints: [
          "Panggil fungsi len(pendaftar) untuk mendapatkan angkanya.",
          "Letakkan langsung pemanggilan len() tersebut di dalam kurung fungsi print().",
        ],
        answerHint: `print(len(pendaftar))`,
        checker: {
          type: "stdout_exact",
          expected: "3",
        },
        successFeedback:
          "Bagus! Fungsi len() sangat penting dan akan selalu kamu gunakan " +
          "setiap kali kamu perlu memvalidasi apakah sebuah data list kosong " +
          "atau sudah terisi.",
      },
    },
    {
      id: "L3",
      slug: "indeks-negatif-dan-slicing",
      title: "Indeks Negatif dan Slicing",
      theory: {
        explanation: `Dalam lesson ini kamu akan belajar dua hal: indeks negatif dan slicing. Semua contoh di bawah memakai list huruf yang sama.`,
        sections: [
          {
            heading: "1. Indeks Negatif",
            text: `Biasanya, kita mengakses elemen list menggunakan indeks yang dimulai dari 0 untuk elemen pertama. Namun, Python juga menyediakan indeks negatif untuk mengakses elemen dari arah belakang.

Perhatikan list berikut (list inilah yang dipakai selama lesson ini):`,
            code: `huruf = ["A", "B", "C", "D", "E", "F"]`,
          },
          {
            text: "Indeks positif dan negatifnya adalah:",
            code: `Elemen          A    B    C    D    E    F
Indeks positif  0    1    2    3    4    5
Indeks negatif  -6   -5   -4   -3   -2   -1`,
          },
          {
            text: `Indeks negatif dihitung dari belakang:
- -1 adalah elemen terakhir.
- -2 adalah elemen kedua dari belakang.
- -3 adalah elemen ketiga dari belakang.

Contoh:`,
            code: `print(huruf[-1])  # Output: F
print(huruf[-2])  # Output: E
print(huruf[-3])  # Output: D`,
          },
          {
            heading: "2. Mengenal Slicing",
            text: `Slicing adalah teknik untuk mengambil beberapa elemen dari list dan menghasilkan list baru.
Format slicing adalah:`,
            code: `list[start:stop:step]`,
          },
          {
            text: `Ketiga bagian tersebut memiliki fungsi berbeda:
- start: indeks tempat pengambilan elemen dimulai. Elemen pada indeks ini ikut diambil.
- stop: batas akhir pengambilan. Elemen pada indeks ini tidak ikut diambil.
- step: jarak lompatan antarindeks. Misalnya nilai 2 berarti mengambil elemen setiap dua indeks.

Contoh:`,
            code: `print(huruf[-1])       # Output: F (Elemen terakhir)
# Mulai indeks 1, berhenti sebelum 5
print(huruf[1:5])      # Output: ['B', 'C', 'D', 'E']
# Mulai indeks 0, berhenti sebelum 5, lompat 2
print(huruf[0:5:2])    # Output: ['A', 'C', 'E']`,
          },
          {
            text: `Pada huruf[1:5], pengambilan dimulai dari indeks 1, yaitu "B", dan berhenti sebelum indeks 5, yaitu "F". Karena itu, hasilnya adalah ['B', 'C', 'D', 'E'].
Ingat: start ikut diambil, sedangkan stop tidak ikut diambil.`,
          },
          {
            heading: "3. Menghilangkan Argumen pada Slicing",
            text: `Dalam slicing, kamu tidak harus selalu menuliskan start, stop, dan step. Bagian yang tidak dituliskan disebut argumen yang dihilangkan atau dikosongkan.

Python akan menggunakan nilai bawaan sesuai dengan bagian yang dikosongkan.

A) Menghilangkan start
Jika start tidak dituliskan, pengambilan dimulai dari awal list.`,
            code: `print(huruf[:3])
# Output: ['A', 'B', 'C']`,
          },
          {
            text: `Karena start dikosongkan, pengambilan dimulai dari indeks 0. Pengambilan berhenti sebelum indeks 3.

B) Menghilangkan stop
Jika stop tidak dituliskan, pengambilan berlanjut sampai akhir list.`,
            code: `print(huruf[3:])
# Output: ['D', 'E', 'F']`,
          },
          {
            text: `Pengambilan dimulai dari indeks 3, yaitu "D", lalu berlanjut sampai elemen terakhir.

C) Menghilangkan start dan stop
Jika keduanya dikosongkan, Python mengambil seluruh elemen list.`,
            code: `print(huruf[:])
# Output: ['A', 'B', 'C', 'D', 'E', 'F']`,
          },
          {
            text: `D) Menghilangkan step
Jika step tidak dituliskan, nilai bawaannya adalah 1. Artinya, elemen diambil secara berurutan tanpa melompati elemen.`,
            code: `print(huruf[0:5])
# Output: ['A', 'B', 'C', 'D', 'E']`,
          },
          {
            text: "Kode tersebut setara dengan huruf[0:5:1].",
          },
          {
            heading: "4. Slicing Menggunakan Indeks Negatif",
            text: `Indeks negatif juga dapat digunakan dalam slicing, baik sebagai start maupun stop.
Contoh:`,
            code: `print(huruf[-4:-1])
# Output: ['C', 'D', 'E']`,
          },
          {
            text: `Indeks -4 menunjuk "C", sedangkan indeks -1 menunjuk "F". Karena stop tidak ikut diambil, hasilnya adalah ['C', 'D', 'E'].

Kamu juga bisa menggabungkan indeks negatif dengan argumen yang dihilangkan:`,
            code: `print(huruf[-3:])
# Output: ['D', 'E', 'F']`,
          },
          {
            text: `Pengambilan dimulai dari indeks -3, yaitu "D", dan berlanjut sampai akhir list.`,
          },
          {
            heading: "5. Menggunakan step Negatif",
            text: `Nilai step juga dapat berupa angka negatif. Jika step bernilai negatif, pengambilan elemen dilakukan dari kanan ke kiri.
Contoh:`,
            code: `print(huruf[::-1])
# Output: ['F', 'E', 'D', 'C', 'B', 'A']`,
          },
          {
            text: `Pada contoh tersebut, start dan stop dikosongkan, sedangkan step bernilai -1. Python mengambil seluruh elemen dari belakang ke depan.

Contoh lainnya:`,
            code: `print(huruf[4:1:-1])
# Output: ['E', 'D', 'C']`,
          },
          {
            text: `Pengambilan dimulai dari indeks 4, yaitu "E", kemudian bergerak ke kiri sampai sebelum indeks 1. Karena stop tidak ikut diambil, elemen "B" tidak masuk ke hasil.

Perhatikan bahwa ketika step negatif, arah pengambilan berubah. Jika start dan stop tidak sesuai dengan arah tersebut, hasil slicing bisa berupa list kosong.`,
          },
        ],
      },
      practice: {
        kind: "code",
        instructions:
          "Diberikan list buah yang berisi enam nama buah. Gunakan indeks " +
          "negatif untuk mencetak buah terakhir. Kemudian, gunakan slicing " +
          "untuk mengambil tiga buah pertama dan membalik urutan seluruh isi " +
          "list. Cetak setiap hasilnya.",
        starterCode: `buah = ["Apel", "Jeruk", "Mangga", "Anggur", "Melon", "Pisang"]

# 1. Cetak buah terakhir menggunakan indeks negatif
print()
# 2. Ambil tiga buah pertama menggunakan slicing
print()
# 3. Balik urutan seluruh buah menggunakan slicing
print()
`,
        hints: [
          "Indeks negatif -1 digunakan untuk mengakses elemen terakhir. Gunakan buah[-1].",
          "Untuk mengambil tiga buah pertama, gunakan buah[:3]. Ingat, indeks stop tidak ikut diambil.",
          "Untuk membalik urutan list, gunakan buah[::-1]. Nilai step -1 membuat pengambilan elemen bergerak dari belakang ke depan.",
        ],
        answerHint: `print(buah[-1])
print(buah[:3])
print(buah[::-1])`,
        checker: {
          type: "stdout_exact",
          expected: `Pisang
['Apel', 'Jeruk', 'Mangga']
['Pisang', 'Melon', 'Anggur', 'Mangga', 'Jeruk', 'Apel']`,
        },
        successFeedback:
          "Sangat Bagus! Kamu berhasil menggunakan indeks negatif dan slicing " +
          "untuk mengakses elemen terakhir, mengambil sebagian isi list, serta " +
          "membalik urutan elemen menggunakan step negatif.",
      },
    },
    {
      id: "L4",
      slug: "mengubah-dan-menambah-data",
      title: "Mengubah dan Menambah Data",
      theory: {
        explanation: `List di Python bersifat mutable (dapat diubah). Artinya, kamu bisa mengganti isinya, atau menambahkan elemen baru setelah list tersebut dibuat.

- Untuk mengubah data: tetapkan nilai baru pada indeks tujuan dengan operator =, contoh list[0] = "Baru".
- Untuk menambah data di akhir list: gunakan metode .append(nilai).
- Untuk menyisipkan data di posisi tertentu: gunakan metode .insert(indeks, nilai).`,
        example: {
          description: "Mengubah dan menambah elemen list secara dinamis.",
          code: `warna = ["Merah", "Biru"]

warna[0] = "Kuning"     # Mengubah "Merah" menjadi "Kuning"
warna.append("Hijau")   # Menambah "Hijau" di akhir

print(warna)
# Output: ['Kuning', 'Biru', 'Hijau']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Diberikan list profil yang berisi status rank. Ubah nilai "Bronze" ' +
          'menjadi "Silver" dengan mengakses indeksnya. Kemudian, gunakan ' +
          'metode .append() untuk menambahkan string "VIP" ke bagian paling ' +
          "akhir dari list tersebut. Cetak list akhirnya.",
        starterCode: `profil = ["PlayerOne", "Bronze"]

# 1. Ubah "Bronze" menjadi "Silver"
# 2. Tambahkan "VIP"
# 3. Cetak profil
`,
        hints: [
          'Kata "Bronze" berada di indeks 1. Lakukan profil[1] = "Silver".',
          'Gunakan profil.append("VIP") untuk menambahkan data.',
        ],
        answerHint: `profil[1] = "Silver"
profil.append("VIP")
print(profil)`,
        checker: {
          type: "stdout_exact",
          expected: "['PlayerOne', 'Silver', 'VIP']",
        },
        successFeedback:
          "Sangat bagus! Mengubah (update) dan menambah (create) elemen " +
          "adalah fondasi dari manipulasi data.",
      },
    },
    {
      id: "L5",
      slug: "menggabungkan-list",
      title: "Menggabungkan List",
      theory: {
        explanation: `Seringkali kamu memiliki data dari dua sumber yang berbeda dan perlu menyatukannya menjadi satu list utama. Python memungkinkan penggabungan dua list dengan sangat mudah menggunakan operator tambah (+). Proses ini disebut concatenation.`,
        example: {
          description: "Menggunakan operator tambah untuk menggabungkan dua buah list.",
          code: `tim_a = ["Andi", "Budi"]
tim_b = ["Citra", "Diana"]

semua_tim = tim_a + tim_b
print(semua_tim)
# Output: ['Andi', 'Budi', 'Citra', 'Diana']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Terdapat list menu_pagi dan menu_malam. Gabungkan kedua list " +
          "tersebut menggunakan operator + dan simpan ke dalam variable baru " +
          "bernama menu_harian. Setelah itu, cetak variable menu_harian.",
        starterCode: `menu_pagi = ["Roti", "Susu"]
menu_malam = ["Nasi", "Ayam"]

# Gabungkan menu_pagi dan menu_malam ke dalam variable menu_harian
# Lalu cetak hasilnya
`,
        hints: [
          "Buat variable penampung: menu_harian = menu_pagi + menu_malam.",
          "Cetak menggunakan print(menu_harian).",
        ],
        answerHint: `menu_harian = menu_pagi + menu_malam
print(menu_harian)`,
        checker: {
          type: "stdout_exact",
          expected: "['Roti', 'Susu', 'Nasi', 'Ayam']",
        },
        successFeedback:
          "Hebat! Menggabungkan struktur data dengan mulus akan sangat " +
          "mempermudah kodingmu di masa depan.",
      },
    },
    {
      id: "L6",
      slug: "menghapus-data-del",
      title: "Menghapus Data dari List (del)",
      theory: {
        explanation: `Untuk menghapus elemen dari list, Python menyediakan beberapa cara:

1. .pop(): menghapus elemen di indeks terakhir, lalu mengembalikan nilai tersebut. pop juga bisa digunakan untuk menghapus indeks spesifik dengan cara .pop(indeks).
2. Kata kunci del: pendekatan langsung untuk menghapus elemen pada indeks tertentu (contoh: del list[indeks]). Cara ini paling cepat jika kamu sudah tahu letak posisi elemen yang ingin dihapus secara persis.`,
        example: {
          description:
            "Menghapus dan memindahkan elemen dari list menggunakan kata kunci del dan .pop().",
          code: `kendaraan = ["Mobil", "Motor", "Sepeda", "Truk"]
del kendaraan[1] # Menghapus "Motor" di indeks 1

print(kendaraan) # Output: ['Mobil', 'Sepeda', 'Truk']

kendaraan2 = kendaraan.pop() # Mengambil Truk dan dimasukkan ke kendaraan2
print(kendaraan2) # Output: Truk
print(kendaraan) # Output: ['Mobil', 'Sepeda']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sistem mendeteksi adanya data ganda di dalam peserta. Diberikan " +
          'list peserta = ["Budi", "BotX", "Citra"]. Elemen palsu "BotX" ' +
          "berada di indeks 1. Gunakan pernyataan del untuk menghapus " +
          '"BotX" berdasarkan letak indeksnya. Lalu cetak list peserta ' +
          "untuk memverifikasi.",
        starterCode: `peserta = ["Budi", "BotX", "Citra"]

# Hapus data pada indeks 1 menggunakan kata kunci del
# Cetak list peserta
`,
        hints: [
          "Tulis del peserta[1] untuk membuang elemen secara langsung dari list.",
          "Cetak list dengan print(peserta).",
        ],
        answerHint: `del peserta[1]
print(peserta)`,
        checker: {
          type: "stdout_exact",
          expected: "['Budi', 'Citra']",
        },
        successFeedback:
          "Mantap! Mengetahui berbagai cara untuk memanipulasi deletion " +
          "(penghapusan) membuatmu lebih luwes memilih pendekatan yang paling " +
          "tepat guna.",
      },
    },
    {
      id: "L7",
      slug: "keanggotaan-in-not-in",
      title: "Pengecekan Keanggotaan (in / not in)",
      theory: {
        explanation: `Bagaimana cara termudah untuk mengecek apakah sebuah data ada di dalam list tanpa perlu melakukan iterasi manual? Python memiliki operator keanggotaan in dan not in.

Operasi ini akan menghasilkan boolean (True atau False). Fitur ini sangat powerful jika diletakkan di dalam pengkondisian if.`,
        example: {
          description: "Memastikan sebuah nilai ada di dalam list sebelum melakukan proses.",
          code: `keranjang = ["Buku", "Pena"]

print("Buku" in keranjang)   # Output: True
print("Penggaris" in keranjang) # Output: False

if "Buku" in keranjang:
    print("Buku sudah masuk keranjang!")
# Output: Buku sudah masuk keranjang!`,
        },
      },
      practice: {
        kind: "quiz",
        question: "Apa hasil eksekusi dari kode boolean di bawah ini?",
        codeSnippet: `print("Admin" not in ["User", "Guest", "Moderator"])`,
        options: ["True", "False", "Error", "None"],
        correctIndex: 0,
        explanation:
          'Kata kunci not in berarti "TIDAK ADA di dalam". Karena string ' +
          '"Admin" memang tidak terdapat di dalam list tersebut, maka ' +
          "pernyataannya adalah benar (True).",
      },
    },
    {
      id: "L8",
      slug: "mencari-indeks-nilai",
      title: "Mencari Indeks dari Sebuah Nilai",
      theory: {
        explanation: `Jika kamu tahu sebuah data ada di dalam list tapi kamu ingin mengetahui di indeks nomor berapa letaknya, gunakan metode .index(nilai).

Peringatan: jika nilai yang kamu cari ternyata tidak ada di dalam list, Python akan melemparkan error. Oleh karena itu, best practice di industri adalah mengecek eksistensinya menggunakan in sebelum menggunakan .index().`,
        example: {
          description: "Menemukan posisi indeks dari elemen list.",
          code: `karyawan = ["Ali", "Beni", "Cika"]
posisi = karyawan.index("Beni")

print(posisi)
# Output: 1`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Diberikan sebuah daftar antrian rumah sakit " +
          'antrian = ["Pasien1", "Pasien2", "PasienVIP", "Pasien3"]. ' +
          'Carilah indeks (nomor urut komputer) dari "PasienVIP" menggunakan ' +
          "metode .index(), simpan nilainya ke dalam variable baru bernama " +
          "urutan_vip, kemudian cetak nilainya ke layar.",
        starterCode: `antrian = ["Pasien1", "Pasien2", "PasienVIP", "Pasien3"]

# Cari indeks PasienVIP, simpan ke variable, dan cetak hasilnya
`,
        hints: [
          'Gunakan .index("PasienVIP") pada list antrian.',
          'Simpan dalam variable urutan_vip = antrian.index("PasienVIP").',
        ],
        answerHint: `urutan_vip = antrian.index("PasienVIP")
print(urutan_vip)`,
        checker: {
          type: "stdout_exact",
          expected: "2",
        },
        successFeedback:
          "Sempurna! Fitur ini sangat bermanfaat ketika sistem antarmuka (UI) " +
          "perlu menandai dan fokus pada posisi data spesifik secara otomatis.",
      },
    },
    {
      id: "L9",
      slug: "iterasi-for-loop",
      title: "Iterasi List Menggunakan For Loop",
      theory: {
        explanation: `Kekuatan sejati list baru terlihat ketika digabungkan dengan struktur for loop. Saat kamu menggunakan sintaks for item in list:, Python bekerja di belakang layar:
1. Python menargetkan elemen di indeks 0.
2. Menyimpan isinya (valuenya) ke dalam variable item, lalu menjalankan blok kode indentasi di bawahnya.
3. Menggeser target ke indeks 1, menyimpan isinya ke item, dan menjalankan blok kodenya lagi.
Proses otomatis ini terus berlanjut hingga elemen paling akhir tanpa butuh pengecekan indeks manual!`,
        example: {
          description: "Mengakumulasikan harga secara otomatis menggunakan for loop.",
          code: `keranjang = [20000, 15000, 30000]
total = 0

for harga in keranjang:
    print(harga)
    # Output: 20000
    #         15000
    #         30000
    total += harga

print(total)
# Output: 65000`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Mengapa penggunaan iterasi for item in list: sering lebih disukai " +
          "daripada mengakses elemen satu per satu (list[0], list[1]...) saat " +
          "memproses semua data?",
        options: [
          "Karena for loop otomatis bekerja untuk berapapun ukuran list tanpa harus mengetik tiap indeks manual.",
          "Karena menggunakan indeks manual tidak diperbolehkan sama sekali di Python.",
          "Karena for loop dapat mengubah isi list menjadi string.",
          "Karena metode indexing akan menghapus data.",
        ],
        correctIndex: 0,
        explanation:
          "Keuntungan utama perulangan adalah skalabilitas. Ia secara otomatis " +
          "beradaptasi baik jika list hanya berisi 2 elemen, maupun jika list " +
          "memiliki jutaan data, tanpa harus memperbarui panjang kode secara manual.",
      },
    },
    {
      id: "L10",
      slug: "iterasi-range-len",
      title: "Iterasi dengan range() dan len()",
      theory: {
        explanation: `Kadangkala, kamu tidak hanya membutuhkan isinya (seperti pada Lesson L9), tapi kamu juga membutuhkan angka indeks posisinya saat loop berjalan (misalnya untuk mencetak "Peserta nomor 1", dsb).

Kamu bisa menggabungkan range() dan len() bersamaan. Sintaks for i in range(len(list)): akan menghasilkan urutan angka dari 0 hingga batas panjang list. Kamu dapat menggunakan variable indeks i tersebut untuk mengakses posisi di list!`,
        example: {
          description: "Mendapatkan akses baik ke indeks maupun elemen data sekaligus.",
          code: `peserta = ["Anna", "Bob"]
# len(peserta) adalah 2. range(2) menghasilkan angka 0, lalu 1.

for i in range(len(peserta)):
    print("Indeks ke", i, "adalah", peserta[i])

# Output:
# Indeks ke 0 adalah Anna
# Indeks ke 1 adalah Bob`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Diberikan list nilai = [80, 95, 75]. Buatlah iterasi for " +
          "menggunakan teknik range(len(nilai)). Di dalam perulangan " +
          "tersebut, cetak setiap elemen dari variable nilai dengan cara " +
          "mengakses list menggunakan indeks i.",
        starterCode: `nilai = [80, 95, 75]

# Buat for loop dengan range() dan len()
# Cetak list berdasarkan posisi indeks loop-nya
`,
        hints: [
          "Mulai perulangan dengan for i in range(len(nilai)):",
          "Di dalam blok indentasi, cetak nilai[i].",
        ],
        answerHint: `for i in range(len(nilai)):
    print(nilai[i])`,
        checker: {
          type: "stdout_exact",
          expected: `80
95
75`,
        },
        successFeedback:
          "Cerdas sekali! Ini adalah jembatan penghubung yang luar biasa bagi " +
          "pengembang yang beralih dari bahasa berorientasi prosedur rendah " +
          "(seperti C) karena memberikan kebebasan mutlak pada pengaturan " +
          "letak indeks memori.",
      },
    },
    {
      id: "L11",
      slug: "filter-genap-modulo",
      title: "Memfilter Angka Genap dengan Modulo",
      theory: {
        explanation: `Kita bisa memadukan iterasi list dengan operator modulo (%) dan pengkondisian if. Ini adalah kombinasi paling umum di bidang Data Science untuk melakukan seleksi atau filter data mentah.

Sebagai pengingat, angka genap adalah angka yang jika dibagi 2, sisa baginya adalah 0 (yaitu angka % 2 == 0).`,
        example: {
          description: "Memilih angka kelipatan tiga dari suatu list.",
          code: `data_angka = [3, 5, 9, 10, 12]
for n in data_angka: # Mengambil setiap angka dari data_angka secara berurutan dan menyimpannya sementara ke variable n
    if n % 3 == 0: # Memeriksa apakah angka n habis dibagi 3 (sisa pembagiannya adalah 0)
        print(n)

# Output:
# 3
# 9
# 12`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Diberikan sekumpulan data acak daftar_angka = [15, 20, 23, 44, 57, 100]. " +
          "Sistem hanya boleh mencetak (menampilkan) angka yang merupakan " +
          "angka genap. Buat iterasi list menggunakan for, pasang kondisi " +
          "pengecekan modulo di dalamnya, lalu cetak nilai n tersebut hanya " +
          "jika ia genap.",
        starterCode: `daftar_angka = [15, 20, 23, 44, 57, 100]

# Buat iterasi for dan logika if pengecekan angka genap
`,
        hints: [
          "Mulai dengan for n in daftar_angka:",
          "Di dalamnya, tambahkan pengecekan if: if n % 2 == 0:",
          "Di dalam blok if tersebut, lakukan print(n).",
        ],
        answerHint: `for n in daftar_angka:
    if n % 2 == 0:
        print(n)`,
        checker: {
          type: "stdout_exact",
          expected: `20
44
100`,
        },
        successFeedback:
          "Sangat tajam! Memisahkan data berdasarkan karakteristik matematis " +
          "adalah inti dari setiap operasi ekstraksi statistik.",
      },
    },
    {
      id: "L12",
      slug: "maksimum-minimum",
      title: "Mencari Nilai Maksimum dan Minimum (Nilai Tak Terhingga)",
      theory: {
        explanation: `Dalam pemrograman, kita bisa mencari nilai terbesar atau terkecil dalam sebuah list dengan cara membandingkan setiap elemen satu per satu.

Mencari nilai terbesar (maksimum): kita memulai dengan nilai yang sangat kecil, yaitu float("-inf"). Dengan begitu, angka apa pun di dalam list akan lebih besar dari nilai awal tersebut. Setiap kali menemukan angka yang lebih besar dari nilai yang tersimpan, kita memperbarui penyimpan nilai maksimum.

Mencari nilai terkecil (minimum): sebaliknya, kita memulai dengan nilai yang sangat besar, yaitu float("inf"). Dengan begitu, angka apa pun di dalam list akan lebih kecil dari nilai awal tersebut. Setiap kali menemukan angka yang lebih kecil dari nilai yang tersimpan, kita memperbarui penyimpan nilai minimum.

Setelah itu, kita melakukan iterasi untuk memeriksa setiap elemen di dalam list. Setelah semua elemen diperiksa, nilai yang tersimpan adalah nilai terbesar atau terkecil yang ditemukan.`,
        example: {
          description:
            "Mencari angka terbesar di dalam list dengan membandingkan satu per satu elemen ke variable penyimpan tak terhingga negatif.",
          code: `data = [15, 42, 8, 99, 23]
terbesar = float("-inf") # Angka terkecil di alam semesta

for n in data:
    if n > terbesar:
        terbesar = n     # Timpa dengan nilai n yang lebih besar

print(terbesar)
# Output: 99`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Kamu membuat fitur "High Score" untuk game-mu. Diberikan riwayat ' +
          "skor pada list riwayat_skor = [340, 520, 210, 800, 150]. Variable " +
          'penyimpan skor_tertinggi yang diinisiasi dengan float("-inf") sudah ' +
          "disediakan. Lakukan penelusuran dengan for loop seperti pada " +
          "contoh, perbarui skor_tertinggi, lalu cetak skor tertingginya " +
          "setelah loop selesai (di luar loop).",
        starterCode: `riwayat_skor = [340, 520, 210, 800, 150]
skor_tertinggi = float("-inf")

# Buat for loop untuk mengevaluasi tiap angka dan mencari nilai maksimal
`,
        hints: [
          "Gunakan perulangan for skor in riwayat_skor:.",
          "Pasang syarat if skor > skor_tertinggi:.",
          "Di dalam syarat if, timpa nilainya: skor_tertinggi = skor.",
          "Pastikan print(skor_tertinggi) diletakkan sejajar tanpa indentasi (di paling kiri) untuk mencetak saat pencarian usai.",
        ],
        answerHint: `for skor in riwayat_skor:
    if skor > skor_tertinggi:
        skor_tertinggi = skor

print(skor_tertinggi)`,
        checker: {
          type: "stdout_exact",
          expected: "800",
        },
        successFeedback:
          "Algoritma yang brilian! Pendekatan pencarian ini jauh lebih aman " +
          "dibandingkan menginisiasi angka 0 (karena bagaimana jika ternyata " +
          "semua skor di data bernilai minus?). Menggunakan -inf memastikan " +
          "pencarian selalu adil dan akurat.",
      },
    },
    {
      id: "L13",
      slug: "pengenalan-tuple",
      title: "Pengenalan Tuple (List yang Tak Bisa Diubah)",
      theory: {
        explanation: `Kadangkala, kamu memiliki kumpulan data krusial yang bersifat permanen dan pantang diubah oleh alur program, seperti koordinat GPS atau detail izin perbankan. Python menyediakan sepupu dari list bernama Tuple.

Bentuk penggunaannya nyaris identik dengan List (menggunakan indeks 0, bisa di-loop), namun bedanya ia menggunakan tanda kurung biasa () (bukan siku) dan ia bersifat immutable (sama sekali tidak bisa ditambah, diganti, atau dikurangi nilainya, setelah didefinisikan).`,
        example: {
          description: "Pendefinisian tuple konstan.",
          code: `# Ini Tuple
koordinat = (10, 20)

print(koordinat[0]) # Mengakses tetap pakai kurung siku. Output: 10
# koordinat[0] = 15 -> INI AKAN MENYEBABKAN PROGRAM ERROR!`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Apa alasan utama seorang pengembang (developer) memilih " +
          "menggunakan tipe data Tuple () dibandingkan List []?",
        options: [
          "Tuple membuat teks menjadi huruf kapital secara otomatis.",
          "Tuple lebih fleksibel karena bisa menambah data baru tanpa henti.",
          "Tuple berfungsi sebagai penyimpan data statis/permanen karena isinya tidak bisa diubah (immutable).",
          "Tuple memungkinkan penyimpanan nilai array dengan indeks dimulai dari 1.",
        ],
        correctIndex: 2,
        explanation:
          "Sifat immutable (tidak bisa diubah nilainya) adalah fitur andalan " +
          "Tuple. Tuple menjaga integritas data agar tak sengaja berubah " +
          "(bug) di tengah pemrosesan program.",
      },
    },
    {
      id: "L14",
      slug: "split-dan-join",
      title: "Memecah dan Menggabungkan String (.split dan .join)",
      theory: {
        explanation: `String teks dapat dipecah menjadi list, dan sebuah list juga bisa dirajut kembali menjadi satu string teks!
- .split(separator): diterapkan pada variable string. Memotong-motong kalimat teks menjadi serpihan kata ke dalam bentuk list, berdasarkan separator (pemisah) yang diberikan, misalnya spasi " ".
- .join(list): merajut kembali list string menjadi satu kesatuan string yang direkatkan oleh sebuah penghubung separator (contoh menggunakan spasi: " ".join(list)).`,
        example: {
          description:
            "Memecah kalimat menjadi kumpulan kata (list), lalu merekatkannya kembali menggunakan garis strip.",
          code: `teks = "Halo dunia"

# Memecah string menjadi list
list_kata = teks.split(" ")
print(list_kata) # Output: ['Halo', 'dunia']

# Merekatkan list menjadi string baru
teks_baru = "-".join(list_kata)
print(teks_baru) # Output: Halo-dunia`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Diberikan string alamat = "Jl.Merdeka No.10 Jakarta".\n\n' +
          '1. Pecah (split) kalimat tersebut berdasarkan spasinya (" "), ' +
          "simpan dalam variable list_alamat.\n" +
          '2. Rekatkan (join) kembali variable list tersebut menggunakan koma tanpa spasi (","), ' +
          "simpan menjadi alamat_baru.\n" +
          "3. Cetak nilai alamat_baru.",
        starterCode: `alamat = "Jl.Merdeka No.10 Jakarta"

# Split alamat berdasarkan spasi
# Join list-nya menggunakan koma
# Cetak hasilnya
`,
        hints: [
          'Buat variable: list_alamat = alamat.split(" ")',
          'Rangkai kembali: alamat_baru = ",".join(list_alamat)',
          "Jangan lupa cetak hasilnya menggunakan fungsi print().",
        ],
        answerHint: `list_alamat = alamat.split(" ")
alamat_baru = ",".join(list_alamat)
print(alamat_baru)`,
        checker: {
          type: "stdout_exact",
          expected: "Jl.Merdeka,No.10,Jakarta",
        },
        successFeedback:
          'Sempurna! .split dan .join adalah "pisau bedah" utama yang harus ' +
          "dikuasai oleh setiap programmer saat melakukan Text Processing atau " +
          "manipulasi data bentuk tulisan natural.",
      },
    },
    {
      id: "L15",
      slug: "tantangan",
      title: "Tantangan Chapter 9",
      theory: {
        explanation: `Kita sering dihadapkan pada skenario penerimaan "Pesan Teks yang Kotor" dari sebuah sensor transmisi, dan kita harus membuat algoritma "Penyaring" (Filter) data kotor tersebut dari kalimat utamanya menggunakan paduan fungsi String .split() dan iterasi perakitan kembali ke List baru, ditutup dengan .join().`,
      },
      practice: {
        kind: "code",
        instructions:
          "Alat pemancar radio darurat mengirimkan transmisi kalimat ke " +
          "sistemmu, tetapi transmisinya diretas (terinterferensi) sehingga " +
          'disisipi banyak string sampah berupa teks "ERROR". Diberikan: ' +
          'pesan_rusak = "Sistem ERROR ini ERROR berjalan ERROR dengan ERROR baik".\n\n' +
          "Tugasmu merakit algoritma pembersihnya:\n" +
          '1. Pecah pesan_rusak menjadi List himpunan kata-kata berpemisah spasi " ".\n' +
          "2. Deklarasikan list kosong bernama kata_bersih = [].\n" +
          "3. Gunakan For Loop untuk menelusuri tiap serpihan kata di himpunan yang telah dipecah tadi.\n" +
          '4. Gunakan kondisional if pengecekan ketidaksamaan (!=) untuk mengecek apakah nilai katanya bukan "ERROR". ' +
          "Jika bukan error, append nilai kata normal tersebut ke list penyimpan kata_bersih.\n" +
          "5. Jika perulangan telah selesai (di paling bawah luar indentasi), rekatkan kembali list kata_bersih " +
          'tersebut menggunakan spasi " ".join() menjadi satu kalimat utuh bersih, dan cetak kalimat akhirnya langsung!',
        starterCode: `pesan_rusak = "Sistem ERROR ini ERROR berjalan ERROR dengan ERROR baik"

# 1. Pecah pesan menjadi list
# 2. Siapkan penampung list bersih (kosong)
# 3. Lakukan for loop, evaluasi validasi, dan append data yang lolos
# 4. Join kembali teksnya pakai spasi, dan print hasilnya
`,
        hints: [
          'Awali dengan kata_kata = pesan_rusak.split(" "). Siapkan tabungan kata_bersih = [].',
          "Telusuri dengan for kata in kata_kata:.",
          'Masuk ke validasi pengondisian if kata != "ERROR":. Jika benar (bukan kotoran), panggil kata_bersih.append(kata).',
          'Rekatkan dengan " ".join(kata_bersih). Pastikan perintah join dan print() dilakukan saat semua operasi looping selesai (tidak ada indentasi lagi).',
        ],
        answerHint: `kata_kata = pesan_rusak.split(" ")
kata_bersih = []

for kata in kata_kata:
    if kata != "ERROR":
        kata_bersih.append(kata)

pesan_asli = " ".join(kata_bersih)
print(pesan_asli)`,
        checker: {
          type: "stdout_exact",
          expected: "Sistem ini berjalan dengan baik",
        },
        successFeedback:
          "Sangat Brilian! Kamu baru saja menyatukan seluruh pondasi utama " +
          "pengelolaan Data Structure di Python (Penggunaan List, Mutabilitas " +
          "Dinamis, Iterasi For Loop, Filter Kondisional If, String Split dan " +
          "String Join). Kemampuan algoritma penyaring aliran data ini adalah " +
          "gerbang utamamu menjadi System Engineer!",
      },
    },
  ],
};
