import type { ChapterContent } from "@/content/types";

export const chapter2: ChapterContent = {
  slug: "2-variabel",
  order: 2,
  title: "Variabel dan Tipe Data",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "apa-itu-variabel",
      title: "Apa Itu Variabel?",
      theory: {
        explanation: `Bayangkan variabel sebagai sebuah "kotak" atau wadah yang
memiliki label nama. Kamu bisa menyimpan sebuah nilai (seperti teks
atau angka) ke dalam kotak tersebut. Daripada harus mengingat nilai
aslinya terus-menerus, kamu hanya perlu mengingat nama label kotaknya
saja. Di Python, kita menggunakan tanda sama dengan (=) untuk
memasukkan nilai ke dalam variabel.`,
        example: {
          description: "Memasukkan teks ke dalam variabel dan mencetaknya.",
          code: `nama = "Budi"
print(nama)
# Output: Budi`,
        },
      },
      practice: {
        kind: "quiz",
        question: "Apa fungsi utama dari sebuah variabel dalam pemrograman?",
        options: [
          "Untuk mencetak teks ke layar.",
          "Untuk menghentikan program yang sedang berjalan.",
          "Untuk menghapus kode yang salah secara otomatis.",
          "Untuk menyimpan data atau nilai agar bisa digunakan kembali.",
        ],
        correctIndex: 3,
        explanation:
          "Variabel berfungsi sebagai tempat menyimpan data sementara di " +
          "memori komputer agar kode lebih rapi dan data bisa dipanggil " +
          "lagi menggunakan namanya.",
      },
    },
    {
      id: "L2",
      slug: "membuat-dan-mencetak-variabel",
      title: "Membuat dan Mencetak Variabel",
      theory: {
        explanation: `Setelah variabel dibuat dan diisi, kamu bisa memanggil namanya
di dalam perintah print() untuk melihat isinya. Ingat, saat memanggil
variabel di dalam print(), jangan menggunakan tanda petik. Jika
menggunakan tanda petik, Python akan menganggapnya sebagai teks biasa,
bukan variabel.`,
        example: {
          description: "Perbedaan mencetak variabel dan mencetak teks biasa.",
          code: `bahasa = "Python"
print(bahasa)   # Mencetak isi variabel: Python
print("bahasa") # Mencetak teks biasa: bahasa`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Buatlah sebuah variabel bernama makanan dan isi dengan teks ' +
          '"Nasi Goreng". Kemudian, cetak isi variabel tersebut ' +
          "menggunakan print().",
        starterCode: `# Buat variabel di bawah ini


# Cetak variabel makanan di bawah ini

`,
        hints: [
          "Gunakan tanda = untuk mengisi variabel.",
          "Ingat, jangan gunakan tanda petik saat memanggil variabel di dalam print().",
        ],
        checker: {
          type: "stdout_exact",
          expected: "Nasi Goreng",
        },
        successFeedback: "Bagus sekali! Kamu baru saja membuat dan memanggil variabel pertamamu.",
      },
    },
    {
      id: "L3",
      slug: "aturan-penamaan-variabel",
      title: "Aturan dan Gaya Penamaan Variabel",
      theory: {
        explanation: `Python memiliki aturan mutlak untuk nama variabel: tidak boleh
ada spasi dan tidak boleh diawali angka (misal: 1nama salah, nama1
benar). Selain itu, programmer menggunakan berbagai "gaya" untuk
menyambung kata, berikut gaya yang paling terkenal:

snake_case: menggunakan garis bawah (contoh: nama_depan). Ini adalah
standar yang paling umum dan disarankan di Python.
camelCase: kata kedua diawali huruf besar (contoh: namaDepan). Sering
dipakai di bahasa pemrograman lain.
PascalCase: semua kata diawali huruf besar (contoh: NamaDepan).`,
      },
      practice: {
        kind: "quiz",
        question:
          "Manakah dari pilihan berikut yang merupakan penamaan variabel " +
          "yang salah dan akan menyebabkan error di Python?",
        options: ["harga_total", "1_nama_depan", "skorPemain1", "nama_belakang"],
        correctIndex: 1,
        explanation:
          "Nama variabel di Python tidak boleh diawali dengan angka. " +
          "Opsi lainnya sah dan bisa digunakan.",
      },
    },
    {
      id: "L4",
      slug: "komentar-dalam-kode",
      title: "Catatan Kecil (Komentar) di Dalam Kode",
      theory: {
        explanation: `Terkadang kita perlu meninggalkan catatan untuk diri kita
sendiri atau programmer lain agar kode mudah dipahami. Di Python, kamu
bisa menggunakan tanda pagar (#) untuk membuat komentar (comment).
Apapun yang kamu tulis setelah tanda # di baris tersebut akan
sepenuhnya diabaikan oleh Python dan tidak akan dijalankan.`,
        example: {
          description: "Menggunakan komentar untuk menjelaskan kode.",
          code: `# Variabel di bawah ini menyimpan umur
umur = 20
print(umur) # Ini juga komentar di sebelah kanan kode`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Di baris pertama, tuliskan sebuah komentar berisi ' +
          '"# baris ini tidak akan dijalankan". Di baris kedua, cetak ' +
          "angka 100.",
        starterCode: `




`,
        hints: [
          "Pastikan komentar menggunakan tanda #.",
          "Python hanya akan mengeksekusi angka 100 karena baris pertama adalah komentar.",
        ],
        checker: {
          type: "stdout_exact",
          expected: "100",
        },
        successFeedback:
          "Mantap! Membiasakan diri menulis komentar untuk menjelaskan " +
          "kode adalah ciri programmer yang baik. Ada waktunya saat " +
          "programmer lain membaca kode kalian, mereka tidak akan selalu " +
          "tahu apa yang kalian buat jika tidak kalian jelaskan.",
      },
    },
    {
      id: "L5",
      slug: "tipe-data-dasar",
      title: "Tipe Data Dasar: Integer, Float, dan Boolean",
      theory: {
        explanation: `Variabel bisa menyimpan berbagai jenis (tipe) data:

Integer (int): angka bulat tanpa koma, misalnya 10, -5, atau 1000.
Float: angka desimal. Python menggunakan titik (.) bukan koma,
misalnya 10.5 atau 3.14.
Boolean (bool): nilai kebenaran logika, hanya bisa berisi True (Benar)
atau False (Salah). Huruf pertamanya harus kapital.`,
        example: {
          description: "Menyimpan berbagai tipe data ke variabel dan melakukan perhitungan.",
          code: `suhu_awal = 30     # Integer
penurunan = 1.5    # Float
hujan = True       # Boolean
print(suhu_awal - penurunan)
# Output: 28.5`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buat variabel berat_badan berisi nilai float 65.5. Buat " +
          "variabel turun berisi nilai integer 2. Cetak hasil dari " +
          "berat_badan - turun (pengurangan).",
        starterCode: `# Buat variabel berat_badan (float) dan turun (integer)


# Cetak hasil pengurangannya

`,
        hints: [
          "Gunakan titik untuk desimal pada 65.5.",
          "Lakukan operasi pengurangan - langsung di dalam print().",
        ],
        checker: {
          type: "stdout_exact",
          expected: "63.5",
        },
        successFeedback:
          "Hebat! Kamu sudah bisa menggabungkan tipe data integer dan float dalam satu perhitungan matematis.",
      },
    },
    {
      id: "L6",
      slug: "string-concatenation",
      title: "Menggabungkan Teks (String Concatenation)",
      theory: {
        explanation: `Tanda tambah (+) berfungsi sebagai alat hitung jika digunakan
pada angka. Namun, jika kamu menggunakan tanda + pada dua teks
(string), Python akan menggabungkannya menjadi satu kata yang panjang.
Proses ini disebut concatenation. Ingat, Python tidak otomatis
menambahkan spasi!`,
        example: {
          description: "Menggabungkan dua variabel string.",
          code: `kata1 = "Buku"
kata2 = "Python"
print(kata1 + " " + kata2) # Menambahkan spasi manual di tengah
# Output: Buku Python`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Gabungkan variabel depan dan belakang dengan menggunakan " +
          'operator +. Pastikan kamu menambahkan string spasi " " di ' +
          "antara keduanya agar hasilnya tidak menempel.",
        starterCode: `depan = "Bina"
belakang = "Nusantara"

# Cetak gabungan variabel dengan spasi di tengah
print( )
`,
        hints: ['Formatnya adalah: variabel1 + " " + variabel2.'],
        checker: {
          type: "stdout_exact",
          expected: "Bina Nusantara",
        },
        successFeedback:
          "Keren! Kamu sudah paham bahwa operator + bisa memiliki fungsi berbeda tergantung tipe datanya.",
      },
    },
    {
      id: "L7",
      slug: "f-string",
      title: "Menyisipkan Variabel ke Teks (f-string)",
      theory: {
        explanation: `Menggabungkan teks dengan + bisa menjadi repot jika ada banyak
variabel. Python memiliki cara yang jauh lebih modern dan mudah dibaca
bernama f-string (formatted string literal). Kamu cukup menaruh huruf
f tepat sebelum tanda petik awal, lalu memasukkan nama variabel ke
dalam kurung kurawal {} di dalam teks tersebut.`,
        example: {
          description: "Menggunakan f-string untuk menyisipkan nilai ke dalam kalimat.",
          code: `nama = "Andi"
skor = 95
print(f"Halo {nama}, skor kamu adalah {skor}.")
# Output: Halo Andi, skor kamu adalah 95.`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Gunakan f-string untuk mencetak kalimat yang menyisipkan " +
          "variabel kota dan suhu. Output harus sama persis: " +
          '"Cuaca di Jakarta hari ini 32 derajat."',
        starterCode: `kota = "Jakarta"
suhu = 32

# Gunakan f-string di dalam print
print( )
`,
        hints: [
          'Jangan lupa tulis huruf f sebelum tanda petik awal: print(f"...")',
          "Masukkan nama variabel di dalam {} pada posisi kalimat yang tepat.",
        ],
        checker: {
          type: "stdout_exact",
          expected: "Cuaca di Jakarta hari ini 32 derajat.",
        },
        successFeedback:
          "Luar biasa! f-string adalah fitur favorit banyak programmer Python di seluruh dunia.",
      },
    },
    {
      id: "L8",
      slug: "tantangan-chapter-2",
      title: "Tantangan Chapter 2",
      theory: {
        explanation: `Saatnya menguji semua yang telah kamu pelajari di chapter ini!
Kamu akan membuat program profil pemain sederhana yang mencakup
pembuatan variabel (dengan berbagai tipe data dasar), perhitungan
matematika menggunakan operator +, serta menampilkan hasilnya dengan
cantik menggunakan f-string.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Tulis program dari awal dengan spesifikasi berikut:\n" +
          '1. Buat komentar "# Profil Karakter".\n' +
          '2. Buat variabel nama_karakter dan isi dengan "Arthur".\n' +
          "3. Buat variabel level_awal (integer) dan isi dengan 10.\n" +
          "4. Buat variabel bonus_level (integer) dan isi dengan 5.\n" +
          "5. Buat variabel vip_status (boolean) dan isi dengan True.\n" +
          "6. Buat variabel level_akhir yang berisi hasil penjumlahan " +
          "level_awal + bonus_level.\n" +
          "7. Cetak sebuah f-string yang formatnya sama persis seperti " +
          'ini: "Karakter Arthur telah mencapai level 15. Status VIP: True"',
        starterCode: `# Tulis seluruh kodemu di bawah ini secara berurutan

`,
        hints: [
          "Gunakan tipe data dasar dengan benar (perhatikan kapitalisasi pada True).",
          "Variabel level_akhir harus dihitung menggunakan +, bukan ditulis manual angkanya.",
          "Gunakan f-string di baris paling bawah dan panggil variabel nama_karakter, level_akhir, dan vip_status di dalam kurung kurawal {}.",
        ],
        checker: {
          type: "stdout_exact",
          expected: "Karakter Arthur telah mencapai level 15. Status VIP: True",
        },
        successFeedback:
          "Sempurna! Kamu telah menguasai konsep variabel, tipe data " +
          "dasar, perhitungan matematika, dan manipulasi teks. Kamu siap untuk Chapter 3!",
      },
    },
  ],
};
