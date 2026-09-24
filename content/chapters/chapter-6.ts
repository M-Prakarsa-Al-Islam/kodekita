import type { ChapterContent } from "@/content/types";

export const chapter6: ChapterContent = {
  slug: "6-computing",
  order: 6,
  title: "Komputasi dan Logika Mesin",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "otak-dan-ingatan-komputer",
      title: "Otak dan Ingatan Komputer",
      theory: {
        explanation: `Sebagai programmer, kamu perlu tahu sedikit tentang bagaimana
mesin mengeksekusi kodemu. Komputer memiliki dua komponen utama:

CPU (Central Processing Unit): otak komputer yang melakukan semua
perhitungan dan mengeksekusi instruksimu dari atas ke bawah.
RAM (Random Access Memory): ingatan jangka pendek. Saat kamu membuat
variabel di Python, variabel tersebut "hidup" dan disimpan di dalam
RAM.

Karena RAM bersifat sementara, semua variabel yang kamu buat akan
langsung musnah (dihapus) begitu programmu selesai berjalan atau jika
komputermu dimatikan.`,
      },
      practice: {
        kind: "quiz",
        question:
          "Mengapa variabel yang kita buat di dalam program Python tidak " +
          "tersimpan secara permanen di komputer?",
        options: [
          "Karena CPU terlalu sibuk untuk menyimpannya.",
          "Karena variabel disimpan di dalam penyimpanan permanen (Hard drive) yang diblokir oleh Python.",
          "Karena Python secara otomatis menghancurkan file kodemu setiap kali dijalankan.",
          "Karena variabel disimpan di dalam RAM (ingatan jangka pendek) yang isinya dikosongkan setelah program selesai.",
        ],
        correctIndex: 3,
        explanation:
          "Program yang sedang berjalan beroperasi di dalam RAM. Inilah " +
          'sebabnya aplikasi yang terlalu banyak menggunakan variabel ' +
          'bisa membuat komputermu "lag" karena RAM-nya penuh.',
      },
    },
    {
      id: "L2",
      slug: "berpikir-seperti-komputer",
      title: "Berpikir Seperti Komputer (Biner)",
      theory: {
        explanation: `Saat kamu menulis kode Python (contoh: print("Halo")),
komputer sebenarnya tidak mengerti apa itu huruf "H", "a", "l", dan "o".

Pada tingkat paling dasar, komputer terdiri dari miliaran saklar
listrik yang hanya memiliki dua status: Nyala (1) atau Mati (0).
Ini disebut bilangan Biner (Binary). Tugas utama bahasa pemrograman
seperti Python adalah bertindak sebagai "Penerjemah". Python mengambil
kodemu yang mudah dibaca oleh manusia, lalu menerjemahkannya menjadi
instruksi 1 dan 0 agar bisa dieksekusi oleh CPU.`,
      },
      practice: {
        kind: "quiz",
        question:
          "Jika komputer hanya mengerti angka 0 dan 1 (biner), apa fungsi utama Python sebagai bahasa pemrograman?",
        options: [
          "Sebagai jembatan penerjemah agar kita bisa memberikan perintah tanpa harus menulis kode biner secara manual.",
          "Untuk mengubah layar komputer menjadi hijau layaknya film hacker.",
          "Menggantikan peran CPU agar komputer bekerja lebih cepat.",
          "Menyimpan data ke dalam Hard drive secara manual tanpa melalui sistem operasi.",
        ],
        correctIndex: 0,
        explanation:
          "Python menerjemahkan sintaks yang menyerupai bahasa Inggris " +
          "menjadi instruksi mesin (machine code) di belakang layar " +
          "sehingga kita bisa bekerja lebih produktif.",
      },
    },
    {
      id: "L3",
      slug: "pangkat-dan-pembagian-bulat",
      title: "Pangkat dan Pembagian Bulat",
      theory: {
        explanation: `Sekarang mari kita kembali ke matematika. Di Python, kamu
sudah mengenal pembagian standar (/). Namun, Python memiliki dua
operator komputasi matematis lanjutan yang sangat sering digunakan
programmer:

Pangkat (**): digunakan untuk mengalikan angka dengan dirinya sendiri
berkali-kali. Contoh: 2 ** 3 artinya 2 pangkat 3 (2 * 2 * 2 hasilnya 8).
Pembagian Bulat atau Floor Division (//): membagi angka namun membuang
seluruh angka desimal di belakang koma. Contoh: 10 // 3 hasilnya
adalah 3 (bukan 3.333).`,
        example: {
          description: "Perbedaan pembagian standar dan pembagian bulat.",
          code: `print(10 / 3)   # Output: 3.3333333333333335 (Float)
print(10 // 3)  # Output: 3 (Integer)
print(-7 // 3)  # Output: -3 (dibulatkan kebawah dari -2.333)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sebuah virus laboratorium berkembang biak 2 kali lipat setiap " +
          "jamnya. Laboratorium memiliki vaksin, di mana 1 botol vaksin " +
          "hanya bisa membunuh tepat 100 virus (tidak bisa digunakan " +
          "setengah).\n" +
          "Tugasmu:\n" +
          "1. Hitung total virus setelah 8 jam (gunakan pangkat **), " +
          "simpan di total_virus. (Petunjuk: rumus perkembangbiakan " +
          "ganda adalah virus_awal dikali 2 pangkat jam).\n" +
          "2. Hitung berapa jumlah botol vaksin utuh yang dibutuhkan " +
          "(gunakan pembagian bulat //), simpan di botol_vaksin.\n" +
          "3. Cetak hasilnya menggunakan print().",
        starterCode: `virus_awal = 5
jam = 8
kapasitas_vaksin = 100

# 1. Hitung total virus (gunakan pangkat)
total_virus =

# 2. Hitung botol vaksin yang dibutuhkan (gunakan pembagian bulat)
botol_vaksin =

# 3. Cetak hasil
print(f"Total virus: {total_virus}")
print(f"Vaksin penuh: {botol_vaksin}")
`,
        hints: [
          "Gunakan tanda kurung pada perhitungan pangkatmu jika kamu ragu, misalnya virus_awal * (2 ** jam).",
          "Untuk menghitung botol vaksin, bagilah total_virus dengan kapasitas_vaksin menggunakan operator //.",
        ],
        answerHint: `virus_awal = 5
jam = 8
kapasitas_vaksin = 100

total_virus = virus_awal * 2 ** jam
botol_vaksin = total_virus // kapasitas_vaksin

print(f"Total virus: {total_virus}")
print(f"Vaksin penuh: {botol_vaksin}")`,
        checker: {
          type: "stdout_exact",
          expected: "Total virus: 1280\nVaksin penuh: 12",
        },
        successFeedback:
          "Hebat! Operator pembagian bulat (//) sangat berguna ketika " +
          "kamu tidak bisa memotong sesuatu menjadi desimal (seperti jumlah botol atau jumlah manusia).",
      },
    },
    {
      id: "L4",
      slug: "sisa-bagi-modulo",
      title: "Sisa Bagi / Modulo (%)",
      theory: {
        explanation: `Jika pembagian bulat (//) memberitahu kita hasil utuhnya,
bagaimana cara mengetahui sisanya? Jawabannya adalah operator Modulo
(%). Modulo mengembalikan sisa dari sebuah pembagian.

10 % 3 hasilnya 1 (karena 10 dibagi 3 adalah 9, dan sisanya 1).
10 % 2 hasilnya 0 (karena 10 dibagi 2 pas habis, tidak ada sisa).

Modulo sangat sering digunakan dalam pemrograman untuk mengecek angka
genap/ganjil, atau membatasi angka agar berputar layaknya jarum jam.`,
        example: {
          description: "Menggunakan modulo pada format jam.",
          code: `# Waktu saat ini jam 20:00. 10 jam dari sekarang jam berapa?
# Kita bisa menjumlahkan waktu saat ini dengan jumlah jam yang akan berlalu:
# 20 + 10 = 30. Namun, dalam sistem waktu 24 jam, tidak ada jam ke-30. Maka kita gunakan modulo.
print((20 + 10) % 24) # Output: 6 (Jam 6 pagi)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di dalam game, seorang pemain tertidur selama waktu yang " +
          "sangat lama. Waktu di game menggunakan format 24 jam. " +
          "Pemain tidur pada pukul 18 sore, dan durasi tidurnya adalah " +
          "100 jam penuh. Hitung pada pukul berapa (0-23) pemain " +
          "tersebut bangun menggunakan operator modulo, lalu cetak hasilnya.",
        starterCode: `waktu_tidur = 18
durasi = 100

# Hitung waktu bangun menggunakan modulo 24
waktu_bangun =

print(waktu_bangun)
`,
        hints: [
          "Jumlahkan terlebih dahulu waktu_tidur dengan durasi.",
          "Karena jam berulang setiap 24 jam sekali, operasikan hasil penjumlahan tadi dengan % 24.",
        ],
        answerHint: `waktu_tidur = 18
durasi = 100

waktu_bangun = (waktu_tidur + durasi) % 24

print(waktu_bangun)`,
        checker: {
          type: "stdout_exact",
          expected: "22",
        },
        successFeedback:
          "Luar biasa! Kamu telah menggunakan Modulo seperti programmer " +
          'sungguhan. Modulo adalah salah satu "cheat code" logika di dunia pemrograman.',
      },
    },
    {
      id: "L5",
      slug: "urutan-operasi-pemdas",
      title: "Urutan Operasi (PEMDAS)",
      theory: {
        explanation: `Sama seperti pelajaran matematika di sekolah, komputer
mengeksekusi operasi perhitungan berdasarkan hierarki PEMDAS
(Parentheses, Exponents, Multiplication/Division, Addition/
Subtraction). Artinya, kurung () dikerjakan pertama, lalu pangkat **,
lalu kali/bagi * /, dan terakhir tambah/kurang + -.

Banyak Logical Error (seperti yang kita pelajari di Chapter 5) terjadi
karena programmer lupa menggunakan tanda kurung, sehingga Python
mengerjakan perkalian/pembagian terlebih dahulu.`,
        example: {
          description: "Pentingnya tanda kurung untuk mengubah hierarki eksekusi.",
          code: `print(10 + 5 * 2)   # Output: 20 (Perkalian dikerjakan dulu)
print((10 + 5) * 2) # Output: 30 (Kurung dikerjakan dulu)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Programmer junior membuat fungsi konversi suhu dari " +
          "Fahrenheit ke Celsius dengan rumus (F - 32) * 5 / 9. Namun " +
          "ia lupa mengimplementasikan aturan PEMDAS, sehingga kodenya " +
          "menghasilkan Logical Error (karena Python menghitung 32 * 5 " +
          "/ 9 terlebih dahulu!). Perbaiki kodenya dengan menambahkan " +
          "tanda kurung agar perhitungan berjalan dengan benar.",
        starterCode: `def fahrenheit_ke_celsius(f):
    # Perbaiki logical error di baris ini!
    return f - 32 * 5 / 9

hasil = fahrenheit_ke_celsius(104)
print(hasil)
`,
        hints: [
          "Kita ingin pengurangan f - 32 dikerjakan paling pertama sebelum dikalikan 5.",
          "Apit operasi pengurangan tersebut dengan sepasang tanda kurung.",
        ],
        answerHint: `def fahrenheit_ke_celsius(f):
    return (f - 32) * 5 / 9

hasil = fahrenheit_ke_celsius(104)
print(hasil)`,
        checker: {
          type: "stdout_exact",
          expected: "40.0",
        },
        successFeedback:
          "Tepat sekali! Selalu gunakan tanda kurung secara eksplisit jika kodemu melibatkan banyak operator matematika.",
      },
    },
    {
      id: "L6",
      slug: "jalan-pintas-mengubah-variabel",
      title: "Jalan Pintas Mengubah Variabel",
      theory: {
        explanation: `Seringkali kita perlu memperbarui nilai sebuah variabel
berdasarkan nilai lamanya, misalnya skor = skor + 10. Karena operasi
pembaruan ini sangat sering dilakukan, Python menyediakan "jalan
pintas" yang disebut Assignment Operators (Operator Penugasan).

Kamu bisa menggunakan +=, -=, *=, hingga /= untuk melakukan operasi
matematika dan langsung menyimpan hasilnya ke variabel tersebut, tanpa
harus menulis nama variabelnya dua kali.`,
        example: {
          description: "Memperbarui variabel dengan jalan pintas.",
          code: `angka = 10
angka += 5   # Sama persis dengan: angka = angka + 5
print(angka) # Output: 15

angka *= 2   # Sama persis dengan: angka = angka * 2
print(angka) # Output: 30`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Karakter RPG kamu sedang bertarung melawan bos dan " +
          "menemukan harta karun! Gunakan jalan pintas (assignment " +
          "operators) untuk memperbarui statusnya:\n" +
          "1. Karakter terkena serangan beracun: kurangi variabel " +
          "health sebanyak 35 menggunakan -=.\n" +
          "2. Karakter meminum ramuan ajaib: kalikan variabel power " +
          "sebanyak 3 kali lipat menggunakan *=.\n" +
          "3. Karakter membagi rata emasnya dengan satu teman party: " +
          "bagi variabel gold dengan 2 menggunakan /=.\n" +
          "(PENTING: Di baris terakhir, cetak variabel health, power, " +
          "dan gold secara berurutan).",
        starterCode: `health = 100
power = 15
gold = 500

# 1. Kurangi health dengan 35


# 2. Kalikan power dengan 3


# 3. Bagi gold dengan 2


# 4. Cetak health, power, dan gold berurutan ke bawah

`,
        hints: [
          "Format penulisan jalan pintas yang tepat adalah variabel += nilai. Terapkan pola logika yang sama untuk kurang, kali, dan bagi.",
          "Ingat bahwa operasi bagi (termasuk /=) akan selalu otomatis mengubah hasilnya menjadi tipe data Float (desimal).",
        ],
        answerHint: `health = 100
power = 15
gold = 500

health -= 35
power *= 3
gold /= 2

print(health)
print(power)
print(gold)`,
        checker: {
          type: "stdout_exact",
          expected: "65\n45\n250.0",
        },
        successFeedback:
          "Sempurna! Penulisan jalan pintas ini membuat kodemu lebih singkat, rapi, dan terlihat sangat profesional.",
      },
    },
    {
      id: "L7",
      slug: "boolean-dan-not",
      title: "Logika Kebenaran dan Pembalikan (Boolean & Not)",
      theory: {
        explanation: `Tipe data Boolean sangatlah fundamental dalam komputasi
karena ia hanya menerima dua kemungkinan nilai mutlak: True (Benar)
dan False (Salah). Huruf pertamanya wajib menggunakan kapital.

Kamu bisa menyangkal atau "membalik" nilai logika tersebut
menggunakan operator not. Layaknya hierarki pada matematika (PEMDAS),
kamu juga bisa menggunakan tanda kurung () untuk membungkus (nesting)
operasi logika agar dievaluasi terlebih dahulu oleh Python sebelum
operasi di luarnya.`,
        example: {
          description:
            "Membalik logika Boolean dengan not dan memodifikasi urutan menggunakan kurung.",
          code: `lampu_hidup = True
print(not lampu_hidup) # Output: False

# Python akan mengerjakan yang di dalam kurung terlebih dahulu
print(not (not True))  # Output: True`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang mengkonfigurasi sistem pertahanan server milik " +
          "perusahaan.\n" +
          "1. Buat variabel bernama sistem_aman dan isi dengan nilai boolean True.\n" +
          "2. Tiba-tiba ada peretasan! Buat variabel status_darurat " +
          "yang nilainya diambil dari kebalikan (not) variabel sistem_aman.\n" +
          "3. Server mencoba melakukan pemulihan dengan sistem " +
          "validasi ganda. Buat variabel validasi_ganda yang nilainya " +
          "adalah hasil dari dua kali pembalikan variabel sistem_aman. " +
          "(Gunakan dua buah kata not dan bungkus pembalikan pertama " +
          "menggunakan tanda kurung ()).\n" +
          "4. Cetak ketiga variabel (sistem_aman, status_darurat, dan " +
          "validasi_ganda) secara berurutan.",
        starterCode: `# 1. Buat variabel sistem_aman


# 2. Buat status_darurat dengan membalikkan sistem_aman


# 3. Buat validasi_ganda menggunakan dua buah not beruntun dan kurung


# 4. Cetak ketiga variabel berurutan

`,
        hints: [
          "Nilai Boolean murni seperti True dan False tidak boleh diapit oleh tanda petik, karena mereka bukan String.",
          "Pada langkah 3, strukturnya mirip dengan contoh teori, tetapi gantilah kata True di dalam kurung dengan variabel milikmu.",
        ],
        answerHint: `sistem_aman = True
status_darurat = not sistem_aman

validasi_ganda = not (not sistem_aman)

print(sistem_aman)
print(status_darurat)
print(validasi_ganda)`,
        checker: {
          type: "stdout_exact",
          expected: "True\nFalse\nTrue",
        },
        successFeedback:
          "Brilian! Memahami gerbang logika (logical gates) dasar " +
          "seperti NOT dan cara membungkusnya dengan kurung adalah " +
          "fondasi terpenting sebelum kamu masuk ke pembuatan algoritma " +
          "pengambilan keputusan (If/Else).",
      },
    },
    {
      id: "L8",
      slug: "tantangan-chapter-6",
      title: "Tantangan Chapter 6",
      theory: {
        explanation: `Tiba saatnya menguji logikamu! Tantangan ini lebih sulit
dari sebelumnya dan membutuhkan kombinasi pemahamanmu tentang
pembagian bulat (//), modulo (%), variabel, dan pembuatan fungsi dari
Chapter sebelumnya.

Baca instruksi dengan pelan, kerjakan baris demi baris, dan
sering-sering gunakan tombol "Jalankan" beserta perintah print() untuk
melakukan debugging sebelum mengumpulkan jawaban.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu diminta membangun sistem mesin kasir otomatis untuk " +
          "menghitung kembalian uang pecahan besar. Lengkapi fungsi " +
          "hitung_kembalian() di bawah ini.\n" +
          "Langkah yang harus kamu lengkapi di dalam fungsi:\n" +
          "1. Hitung total kembalian (uang_bayar dikurangi total_belanja).\n" +
          "2. Hitung berapa lembar uang pecahan Rp50.000 yang bisa " +
          "didapat dari kembalian tersebut (gunakan // 50000).\n" +
          "3. Hitung sisa uang kembalian setelah diambil pecahan 50 " +
          "ribu tersebut (gunakan % 50000).\n" +
          "4. Dari sisa uang (langkah 3), hitung berapa lembar uang " +
          "pecahan Rp10.000 yang bisa didapat.\n" +
          "5. Terakhir, gunakan f-string untuk melakukan return sebuah " +
          "kalimat dengan format persis: Kembalian: [X], 50rb: [Y], 10rb: [Z]",
        starterCode: `def hitung_kembalian(uang_bayar, total_belanja):
    # 1. Hitung kembalian total
    kembalian_awal =

    # 2. Lembar 50rb
    lembar_50 =

    # 3. Sisa uang setelah diambil 50rb
    sisa_uang =

    # 4. Lembar 10rb
    lembar_10 =

    # 5. Return f-string sesuai instruksi format
    return

# Jangan ubah kode pemanggil di bawah ini
print(hitung_kembalian(200000, 115000))
`,
        hints: [
          "kembalian_awal adalah hasil dari 200000 - 115000 (yaitu 85000).",
          "Gunakan kembalian_awal // 50000 untuk lembar_50, dan kembalian_awal % 50000 untuk sisa_uang.",
          "Untuk nilai return, pastikan format kapital dan komanya persis seperti di instruksi (ganti [X] dengan variabelmu).",
        ],
        answerHint: `def hitung_kembalian(uang_bayar, total_belanja):
    kembalian_awal = uang_bayar - total_belanja
    lembar_50 = kembalian_awal // 50000
    sisa_uang = kembalian_awal % 50000
    lembar_10 = sisa_uang // 10000
    return f"Kembalian: {kembalian_awal}, 50rb: {lembar_50}, 10rb: {lembar_10}"

print(hitung_kembalian(200000, 115000))`,
        checker: {
          type: "stdout_exact",
          expected: "Kembalian: 85000, 50rb: 1, 10rb: 3",
        },
        successFeedback:
          "Sempurna! Algoritma kasir memecah uang ini adalah masalah " +
          "klasik dunia komputasi. Kemampuan analisismu sudah berkembang pesat!",
      },
    },
  ],
};
