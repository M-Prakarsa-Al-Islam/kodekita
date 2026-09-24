import type { ChapterContent } from "@/content/types";

export const chapter7: ChapterContent = {
  slug: "7-perbandingan",
  order: 7,
  title: "Perbandingan",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "kesamaan-dan-ketidaksamaan",
      title: "Kesamaan dan Ketidaksamaan",
      theory: {
        explanation: `Operator perbandingan digunakan untuk membandingkan dua buah
nilai. Hasil akhirnya selalu berupa nilai boolean: True (benar) atau
False (salah).

Untuk mengecek apakah dua nilai persis sama, kita menggunakan
operator kesamaan == (dua tanda sama dengan, berbeda dengan = yang
digunakan untuk menetapkan nilai variable). Untuk mengecek apakah dua
nilai berbeda, gunakan operator ketidaksamaan !=.

Penting untuk diingat bahwa tipe data sangat berpengaruh di Python.
Angka 10 (integer) tidak sama dengan teks "10" (string), namun Python
cukup pintar untuk mengetahui bahwa 10 sama dengan 10.0 (float).`,
        example: {
          description: "Contoh perbandingan nilai yang memperhatikan tipe data.",
          code: `print(100 == 100.0) # Output: True
print(5 != 8)       # Output: True
print(10 == "10")   # Output: False`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sistem keamanan bank membutuhkan pencocokan PIN yang sangat " +
          "akurat. Di bawah ini terdapat pin_sistem yang tersimpan " +
          "sebagai integer, dan pin_input dari pengguna yang masuk " +
          "sebagai string (teks). Gunakan operator kesamaan (==) untuk " +
          "membandingkan keduanya secara langsung di dalam fungsi " +
          "print(). Amati apakah tipe data yang berbeda mempengaruhi hasil perbandingan.",
        starterCode: `pin_sistem = 123456
pin_input = "123456"

# Bandingkan kedua variable di bawah ini dan cetak hasilnya
`,
        hints: [
          "Kamu tidak perlu mengubah tipe data variable tersebut. Cukup bandingkan keduanya apa adanya.",
          "Tempatkan ekspresi pin_sistem == pin_input di dalam kurung fungsi print().",
        ],
        answerHint: `pin_sistem = 123456
pin_input = "123456"

print(pin_sistem == pin_input)`,
        checker: {
          type: "stdout_exact",
          expected: "False",
        },
        successFeedback:
          "Tepat sekali! Meskipun secara kasat mata terlihat sama, " +
          "string dan integer adalah dua tipe data yang berbeda, " +
          "sehingga operator == mengembalikan nilai False. Ini adalah " +
          "sumber error logika yang paling umum di kalangan pemula!",
      },
    },
    {
      id: "L2",
      slug: "operator-relasional",
      title: "Operator Relasional (Besar/Kecil)",
      theory: {
        explanation: `Selain mengecek kesamaan, kamu juga bisa membandingkan
ukuran dua nilai menggunakan operator relasional:

> (lebih besar dari)
< (lebih kecil dari)
>= (lebih besar atau sama dengan - inklusif)
<= (lebih kecil atau sama dengan - inklusif)

Operator relasional sangat berguna setelah kamu melakukan komputasi
matematika, misalnya untuk mengecek apakah sebuah hasil kalkulasi
melewati ambang batas (threshold) tertentu.`,
        example: {
          description: "Mengecek apakah kapasitas muatan melebihi batas maksimal.",
          code: `berat_kargo = 850.5
batas_maksimal = 1000.0
# Apakah berat melebihi batas?
print(berat_kargo > batas_maksimal)
# Output: False`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Dalam sebuah game RPG, sebuah serangan hanya akan melukai " +
          "musuh jika total damage secara ketat lebih besar (strictly " +
          "greater) dari armor musuh (jika nilainya sama, serangan " +
          "berhasil ditahan). Diberikan base_damage, combo_multiplier, " +
          "dan armor_musuh. Hitunglah total damage (kalikan " +
          "base_damage dengan combo_multiplier), lalu bandingkan " +
          "hasilnya dengan armor_musuh. Cetak hasil evaluasi " +
          "perbandingannya dalam bentuk boolean.",
        starterCode: `base_damage = 50
combo_multiplier = 1.6
armor_musuh = 80

# 1. Hitung total damage
# 2. Cek apakah total damage lebih besar dari armor musuh lalu cetak (print) hasilnya
`,
        hints: [
          "Pertama, buat variable baru misalnya total_damage = base_damage * combo_multiplier.",
          "Kedua, gunakan operator > untuk mengecek apakah total_damage lebih besar dari armor_musuh.",
          "Ingat bahwa 50 * 1.6 adalah 80.0. Apakah 80.0 > 80? Jika nilainya sama, berarti ia tidak lebih besar secara ketat.",
        ],
        answerHint: `base_damage = 50
combo_multiplier = 1.6
armor_musuh = 80

total_damage = base_damage * combo_multiplier
print(total_damage > armor_musuh)`,
        checker: {
          type: "stdout_exact",
          expected: "False",
        },
        successFeedback:
          "Kerja bagus! Hasil kalkulasi adalah 80.0, dan karena 80.0 " +
          "tidak lebih besar secara ketat dari 80 (nilainya persis " +
          "sama), maka evaluasinya adalah False. Logika komputasi " +
          "sangat sering digunakan untuk mekanik seperti ini di dunia nyata.",
      },
    },
    {
      id: "L3",
      slug: "perbandingan-string",
      title: "Perbandingan String",
      theory: {
        explanation: `Operator perbandingan juga dapat diterapkan pada tipe data
string teks. Di Python, string dibandingkan secara leksikografis
(seperti urutan abjad di kamus) yang didasarkan pada nilai standar
ASCII karakter.

Hal yang paling penting adalah perbandingan string bersifat
case-sensitive. Karakter huruf kapital ("A" sampai "Z") memiliki
bobot/nilai ASCII yang lebih rendah (atau berada lebih awal
urutannya) dibandingkan huruf kecil ("a" sampai "z"). Jadi, "Z"
dianggap lebih kecil dari "a".`,
        example: {
          description: "Membandingkan urutan karakter berdasarkan standar abjad/ASCII.",
          code: `print("apel" == "Apel")   # Output: False
print("pisang" > "mangga") # Output: True
print("B" < "a")          # Output: True`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Dari pilihan ekspresi perbandingan di bawah ini, manakah " +
          "yang akan menghasilkan nilai evaluasi True?",
        options: ['"Budi" < "Andi"', '"10" == 10', '"Zebra" < "alfa"', '"data" != "data"'],
        correctIndex: 2,
        explanation:
          "Di Python, huruf kapital diurutkan sebelum huruf kecil. Oleh " +
          'karena itu, huruf kapital "Z" memiliki urutan numerik (ASCII) ' +
          'yang lebih awal dibandingkan huruf kecil "a". Sehingga, ' +
          'string "Zebra" secara nilai dianggap lebih kecil dari string "alfa".',
      },
    },
    {
      id: "L4",
      slug: "perbandingan-berantai",
      title: "Perbandingan Berantai (Chained Comparison)",
      theory: {
        explanation: `Seringkali kita perlu mengecek apakah sebuah nilai berada di
dalam sebuah rentang (misalnya: apakah nilai ujian berada antara 0
sampai 100). Python memiliki fitur yang sangat elegan bernama Chained
Comparison (Perbandingan Berantai).

Kamu bisa menulis ekspresi matematika rentang layaknya perhitungan di
atas kertas, seperti a <= b <= c. Python akan mengevaluasi apakah b
lebih besar atau sama dengan a dan sekaligus lebih kecil atau sama
dengan c.`,
        example: {
          description: "Mengecek validitas sebuah nilai di dalam suatu rentang minimum dan maksimum.",
          code: `batas_bawah = 0
batas_atas = 100
nilai_siswa = 85

valid = batas_bawah <= nilai_siswa <= batas_atas
print(valid)
# Output: True`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sensor laboratorium memantau suhu mesin reaktor nuklir. " +
          'Mesin dianggap beroperasi dalam kondisi "Aman" jika suhunya ' +
          "berada di rentang minimal -10 derajat dan maksimal 50 " +
          "derajat (inklusif/termasuk batas). Diberikan nilai variable " +
          "suhu_saat_ini bernilai 55. Gunakan chained comparison untuk " +
          "mengecek apakah suhu berada di dalam rentang yang aman, lalu " +
          "cetak hasil boolean-nya.",
        starterCode: `suhu_saat_ini = 55

# Cek apakah suhu di rentang -10 hingga 50, lalu cetak hasilnya
`,
        hints: [
          "Susun perbandingannya seperti logika matematika biasa: angka paling kecil di kiri, suhu di tengah, dan batas angka maksimal di kanan.",
          "Gunakan operator <= di kedua sisinya. Letakkan langsung seluruh perbandingan di dalam kurung print().",
        ],
        answerHint: `suhu_saat_ini = 55

print(-10 <= suhu_saat_ini <= 50)`,
        checker: {
          type: "stdout_exact",
          expected: "False",
        },
        successFeedback:
          "Sangat elegan! Chained comparison adalah salah satu fitur " +
          "Python yang paling disukai developer karena membuat kode " +
          "sangat bersih dan mudah dibaca (readable) dibandingkan bahasa pemrograman lainnya.",
      },
    },
    {
      id: "L5",
      slug: "pernyataan-if",
      title: "Pernyataan Kondisional (If Statement)",
      theory: {
        explanation: `Pernyataan if (if statement) digunakan untuk membuat alur
keputusan dalam program. Blok kode di dalam if hanya akan dieksekusi
jika kondisi perbandingan bernilai True. Jika bernilai False, blok
kode tersebut akan dilewati.

if KONDISINYA:
--4 spasi-- # kode yang akan dieksekusi jika kondisinya True

# kode diluar if akan tetap dijalankan seperti biasa

Aturan penulisan sintaks if di Python:
1. Diawali dengan kata kunci if diikuti ekspresi kondisi perbandingan.
2. Diakhiri dengan tanda titik dua (:).
3. Baris perintah di dalam blok if wajib menggunakan indentasi (spasi
menjorok ke dalam, standar 4 spasi).`,
        example: {
          description: "Menjalankan perintah jika nilai memenuhi syarat kelulusan.",
          code: `nilai = 80

if nilai >= 75:
    print("Selamat, Anda Lulus!")
    print("Pertahankan prestasi Anda.")

# Output:
# Selamat, Anda Lulus!
# Pertahankan prestasi Anda.`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sebuah sistem alarm akan memberikan peringatan jika tingkat " +
          "kecepatan angin melebihi batas aman 60 km/jam. Diberikan " +
          "variabel kecepatan_angin sebesar 75. Buatlah struktur if " +
          "untuk mengecek apakah kecepatan_angin lebih besar dari 60. " +
          'Jika True, cetak pesan "Bahaya: Angin Kencang!".',
        starterCode: `kecepatan_angin = 75

# Buat kondisi if di bawah ini untuk mengecek kecepatan angin
`,
        hints: [
          "Gunakan kata kunci if diikuti dengan ekspresi kecepatan_angin > 60:.",
          "Jangan lupa memberikan tanda titik dua (:) di akhir baris if.",
          'Gunakan indentasi (4 spasi) untuk baris print("Bahaya: Angin Kencang!") di dalam blok if.',
        ],
        answerHint: `kecepatan_angin = 75

if kecepatan_angin > 60:
    print("Bahaya: Angin Kencang!")`,
        checker: {
          type: "stdout_exact",
          expected: "Bahaya: Angin Kencang!",
        },
        successFeedback:
          "Bagus sekali! Kamu telah berhasil memahami dasar " +
          "pengkondisian dengan if dan pentingnya aturan indentasi di Python.",
      },
    },
    {
      id: "L6",
      slug: "if-else",
      title: "Percabangan Ganda (If-Else)",
      theory: {
        explanation: `Seringkali kita ingin program melakukan tindakan alternatif
ketika kondisi if bernilai False. Di sinilah kita menggunakan blok
else.

Sintaks else ditulis setelah blok if selesai. Kata kunci else tidak
memiliki kondisi sendiri dan selalu diakhiri dengan titik dua (:).
Kode di dalam blok else hanya akan dieksekusi jika seluruh kondisi if
sebelumnya bernilai False.`,
        example: {
          description: "Menentukan status kelulusan berdasarkan nilai ujian.",
          code: `nilai = 65

if nilai >= 75:
    print("Status: Lulus")
else:
    print("Status: Remedial")

# Output:
# Status: Remedial`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buatlah sistem pemeriksaan usia untuk pembelian tiket film " +
          "kategori Dewasa (minimal 17 tahun). Diberikan variabel " +
          "usia_penonton bernilai 15. Jika usia_penonton lebih besar " +
          'atau sama dengan 17, cetak "Akses Diterima". Jika tidak ' +
          '(kurang dari 17), cetak "Akses Ditolak".',
        starterCode: `usia_penonton = 15

# Buat percabangan if-else di bawah ini
`,
        hints: [
          "Gunakan if usia_penonton >= 17: untuk mengecek syarat usia minimal.",
          'Di dalam blok if, cetak "Akses Diterima".',
          'Sejajar dengan kata kunci if, tulis else: lalu cetak "Akses Ditolak" di dalam blok else.',
        ],
        answerHint: `usia_penonton = 15

if usia_penonton >= 17:
    print("Akses Diterima")
else:
    print("Akses Ditolak")`,
        checker: {
          type: "stdout_exact",
          expected: "Akses Ditolak",
        },
        successFeedback:
          "Luar biasa! Kamu sudah bisa membuat program yang mengambil " +
          "dua jalur keputusan berbeda secara otomatis berdasarkan logika data.",
      },
    },
    {
      id: "L7",
      slug: "elif-vs-else",
      title: "Perbedaan Elif dan Else",
      theory: {
        explanation: `Ketika terdapat lebih dari dua cabang kondisi, kita
menggunakan elif (singkatan dari else if). Penting untuk memahami
perbedaan mendasar antara elif dan else:

1. elif (Else If): Digunakan untuk menguji kondisi baru/spesifik jika
kondisi sebelumnya bernilai False. elif wajib diikuti oleh ekspresi
kondisi perbandingan. Kamu bisa menggunakan banyak elif dalam satu
rangkaian percabangan.
2. else: Adalah cabang penampung terakhir (fallback) yang mengeksekusi
kode jika TIDAK ADA SATUPUN kondisi if maupun elif di atasnya yang
bernilai True. else tidak boleh memiliki ekspresi kondisi perbandingan
dan hanya boleh ada satu di akhir rantai.`,
        example: {
          description: "Menentukan kategori harga berdasarkan status keanggotaan.",
          code: `kategori = "silver"

if kategori == "gold":
    print("Diskon 20%")
elif kategori == "silver":
    print("Diskon 10%")
elif kategori == "copper":
    print("Diskon 5%")
else:
    print("Tidak Ada Diskon")

# Output:
# Diskon 10%`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Pernyataan manakah di bawah ini yang BENAR mengenai " +
          "perbedaan elif dan else dalam Python?",
        options: [
          "else membutuhkan ekspresi kondisi perbandingan, sedangkan elif tidak.",
          "elif dipergunakan untuk menguji kondisi spesifik baru, sedangkan else berjalan saat semua kondisi di atasnya bernilai False.",
          "Kita bisa memiliki beberapa blok else dalam satu percabangan, tetapi hanya satu elif.",
          "elif hanya bisa ditulis jika tidak ada blok if sebelumnya.",
        ],
        correctIndex: 1,
        explanation:
          "elif memungkinkan pengujian kondisi spesifik berikutnya " +
          "(sehingga membutuhkan ekspresi kondisi), sedangkan else " +
          "bekerja sebagai penampung akhir yang berjalan tanpa syarat " +
          "jika seluruh kondisi if dan elif di atasnya bernilai False.",
      },
    },
    {
      id: "L8",
      slug: "tantangan-chapter-7",
      title: "Tantangan Chapter 7",
      theory: {
        explanation: `Dalam pengembangan perangkat lunak tingkat nyata, kita
sering mengombinasikan logika komputasi matematika (seperti
persentase atau perbandingan) ke dalam rantai percabangan
if-elif-else untuk menyelesaikan aturan bisnis yang kompleks.`,
        example: {
          description: "Evaluasi kondisi skor dengan kalkulasi bonus.",
          code: `skor = 80
bonus = 10
total = skor + bonus

if total >= 100:
    print("Predikat: S")
elif total >= 80:
    print("Predikat: A")
else:
    print("Predikat: B")

# Output:
# Predikat: A`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu diminta membuat sistem penilaian otomatis untuk " +
          "aplikasi e-learning. Sistem ini menentukan batas angka " +
          "nilai akhir berdasarkan kombinasi nilai tugas dan nilai " +
          "ujian akhir, lalu mengategorikan grade sesuai aturan berikut:\n" +
          "1. Hitung nilai_akhir dengan formula: (40% dari nilai_tugas) + (60% dari nilai_ujian).\n" +
          '2. Jika nilai_akhir lebih besar atau sama dengan 85.0, cetak "Grade: A".\n' +
          "3. Jika nilai_akhir lebih besar atau sama dengan 70.0 " +
          '(tetapi kurang dari 85.0), cetak "Grade: B".\n' +
          '4. Jika nilai_akhir kurang dari 70.0, cetak "Grade: C".\n\n' +
          "Diberikan nilai_tugas = 70 dan nilai_ujian = 90. Hitung " +
          "nilai_akhir terlebih dahulu, kemudian tentukan jalurnya " +
          "menggunakan percabangan if-elif-else.",
        starterCode: `nilai_tugas = 70
nilai_ujian = 90

# 1. Hitung nilai_akhir (40% tugas + 60% ujian)
# 2. Buat percabangan kondisional untuk menentukan Grade dan cetak hasilnya
`,
        hints: [
          "Hitung nilai akhir: nilai_akhir = (nilai_tugas * 0.4) + (nilai_ujian * 0.6). Hasil perhitungan dari contoh di atas adalah 82.0.",
          "Evaluasi kondisi pertama: if nilai_akhir >= 85.0:.",
          "Evaluasi kondisi kedua: elif nilai_akhir >= 70.0:. Gunakan else: untuk kondisi selain kedua hal di atas.",
        ],
        answerHint: `nilai_tugas = 70
nilai_ujian = 90

nilai_akhir = (nilai_tugas * 0.4) + (nilai_ujian * 0.6)

if nilai_akhir >= 85.0:
    print("Grade: A")
elif nilai_akhir >= 70.0:
    print("Grade: B")
else:
    print("Grade: C")`,
        checker: {
          type: "stdout_exact",
          expected: "Grade: B",
        },
        successFeedback:
          "Hebat sekali! Kamu berhasil mengintegrasikan komputasi " +
          "persentase, operator perbandingan, serta percabangan logis " +
          "if-elif-else dengan sangat rapi dan fungsional.",
      },
    },
  ],
};
