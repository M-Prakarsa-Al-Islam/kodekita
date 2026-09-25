import type { ChapterContent } from "@/content/types";

export const chapter8: ChapterContent = {
  slug: "8-loop",
  order: 8,
  title: "Loop",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "for-loop-dan-range",
      title: "Pengenalan For Loop dan Range",
      theory: {
        explanation: `Dalam pemrograman, kita sering perlu mengulangi perintah yang
sama berkali-kali. Di Python, for loop digunakan untuk melakukan
iterasi (perulangan) pada sebuah urutan.

Untuk membuat urutan angka dengan mudah, kita menggunakan fungsi
bawaan range(). Fungsi range(start, stop) akan menghasilkan urutan
angka yang dimulai dari start dan berhenti tepat sebelum stop.`,
        example: {
          description: "Mengulangi perintah mencetak angka dari 1 sampai 3.",
          code: `# range(1, 4) berarti menghasilkan angka 1, 2, dan 3
for angka in range(1, 4):
    print(angka)

# Output:
# 1
# 2
# 3`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang mengembangkan aplikasi kalkulator otomatis. " +
          "Tugasmu adalah menghitung jumlah total dari seluruh angka " +
          "dari 1 hingga 5 (yaitu 1 + 2 + 3 + 4 + 5). Sebuah variable " +
          "total = 0 sudah disiapkan. Gunakan for loop dan range() " +
          "untuk menambahkan setiap angka ke dalam variable total. " +
          "Setelah loop selesai (di luar blok loop), cetak hasil akhir dari total.",
        starterCode: `total = 0

# Buat for loop di bawah ini menggunakan range dari 1 hingga 5 (inklusif)
`,
        hints: [
          "Gunakan for i in range(1, 6): karena range akan berhenti sebelum angka terakhir.",
          "Di dalam blok loop (dengan indentasi), tambahkan nilai i ke dalam total menggunakan operator += (yaitu total += i).",
          "Pastikan fungsi print(total) berada di luar/di bawah loop (tanpa indentasi) agar hanya hasil akhirnya saja yang dicetak.",
        ],
        answerHint: `total = 0

for i in range(1, 6):
    total += i
print(total)`,
        checker: {
          type: "stdout_exact",
          expected: "15",
        },
        successFeedback:
          "Sangat baik! Kamu telah berhasil menggabungkan perulangan " +
          "dengan operasi penambahan akumulatif. Teknik akumulasi " +
          "seperti variable total ini akan sangat sering kamu gunakan.",
      },
    },
    {
      id: "L2",
      slug: "argumen-step-range",
      title: "Argumen Step pada Range",
      theory: {
        explanation: `Fungsi range() sebenarnya memiliki argumen ketiga opsional
yaitu step, sehingga format lengkapnya adalah range(start, stop, step).

Argumen step menentukan seberapa besar lompatan antar angka di setiap
iterasinya. Jika tidak ditulis, nilai default-nya adalah 1.
Menariknya, kita juga bisa menggunakan step bernilai negatif untuk
menghitung mundur (pastikan nilai start lebih besar dari stop).`,
        example: {
          description: "Mencetak angka genap menggunakan argumen step bernilai 2, dan hitung mundur.",
          code: `# Lompat 2 angka (mencetak 0, 2, 4)
for i in range(0, 6, 2):
    print(i)

# Hitung mundur dari 3 ke 1
for i in range(3, 0, -1):
    print(i)`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Berdasarkan pemahamanmu tentang argumen step, angka apa " +
          "saja yang akan dicetak jika kita menjalankan kode " +
          "for i in range(5, 1, -1): print(i)?",
        options: ["5, 4, 3, 2, 1", "5, 4, 3, 2", "4, 3, 2, 1", "1, 2, 3, 4, 5"],
        correctIndex: 1,
        explanation:
          "Loop dimulai dari angka 5 (start) dan berhenti sebelum " +
          "angka 1 (stop), dengan pergerakan mundur -1 (step). Oleh " +
          "karena itu, angka 1 tidak akan ikut dicetak. Output " +
          "pastinya adalah 5, 4, 3, dan 2.",
      },
    },
    {
      id: "L3",
      slug: "iterasi-pada-string",
      title: "Iterasi pada String",
      theory: {
        explanation: `Selain rentang angka, for loop di Python juga bisa digunakan
untuk melakukan iterasi secara langsung pada karakter-karakter di
dalam sebuah string teks. Pada setiap perulangan, variable sementara
(seperti huruf) akan menyimpan satu karakter dari teks tersebut
secara berurutan.`,
        example: {
          description: "Mengakses setiap karakter dalam string satu per satu.",
          code: `for huruf in "Hai":
    print(huruf)

# Output:
# H
# a
# i`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Perhatikan blok kode di bawah ini. Berapakah angka yang " +
          "akan dicetak di layar pada akhir program?",
        codeSnippet: `x = 0
for karakter in "Kode":
    x = x + 1
print(x)`,
        options: ["0", "K", "4", "Kode"],
        correctIndex: 2,
        explanation:
          'String "Kode" memiliki 4 karakter. Oleh karena itu, loop ' +
          "akan berjalan sebanyak 4 kali. Di setiap perulangannya, " +
          "nilai x ditambah 1 (0 -> 1 -> 2 -> 3 -> 4). Ketika dicetak, " +
          "hasilnya adalah angka 4.",
      },
    },
    {
      id: "L4",
      slug: "while-loop",
      title: "Pengenalan While Loop",
      theory: {
        explanation: `Berbeda dengan for loop yang mengulang sebanyak jumlah item
yang pasti, while loop akan terus berulang selama kondisi yang
diujinya bernilai True.

Sangat penting untuk memastikan bahwa di dalam blok while, kamu
memperbarui variable yang sedang diuji kondisinya. Jika tidak,
kondisinya akan selalu bernilai True dan programmu akan terjebak
dalam kondisi infinite loop (perulangan tanpa henti) hingga crash.`,
        example: {
          description: "Menghitung mundur menggunakan while loop.",
          code: `hitung = 3
while hitung > 0:
    print(hitung)
    hitung -= 1  # Wajib ada agar nilai hitung mengecil

# Output:
# 3
# 2
# 1`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang membuat simulasi indikator pengurangan daya " +
          "baterai robot. Baterai dimulai dari kapasitas 15 persen. " +
          "Selama (while) baterai masih lebih besar dari 0, cetak " +
          "level kapasitas baterainya terlebih dahulu. Setelah " +
          "dicetak, kurangi kapasitas baterai tersebut sebanyak 5 " +
          "persen di setiap perulangannya.",
        starterCode: `baterai = 15

# Buat while loop di bawah ini
`,
        hints: [
          "Tulis kata kunci while dengan kondisi mengecek apakah baterai > 0:.",
          "Di dalam blok loop, hal pertama yang harus dilakukan adalah mencetak variable baterai dengan print(baterai).",
          "Setelah fungsi cetak, kurangi nilai baterai dengan baterai -= 5. Jangan lupa gunakan indentasi yang sejajar dengan perintah print sebelumnya.",
        ],
        answerHint: `baterai = 15

while baterai > 0:
    print(baterai)
    baterai -= 5`,
        checker: {
          type: "stdout_exact",
          expected: "15\n10\n5",
        },
        successFeedback:
          "Sempurna! Kamu telah memahami cara mengontrol siklus while " +
          "dengan mengelola variable kondisi dengan benar, sehingga " +
          "program bisa berhenti tepat pada waktunya tanpa infinite loop.",
      },
    },
    {
      id: "L5",
      slug: "break",
      title: "Menghentikan Iterasi dengan Break",
      theory: {
        explanation: `Dalam beberapa situasi, kita perlu menghentikan proses
perulangan di tengah jalan sebelum waktunya benar-benar selesai. Kita
bisa menggunakan perintah break untuk keluar sepenuhnya dari blok for
atau while secara instan.

Biasanya, break dipicu ketika sebuah pengkondisian if tertentu terpenuhi.`,
        example: {
          description: "Menghentikan pencarian jika sebuah angka ditemukan.",
          code: `for angka in range(1, 5):
    if angka == 3:
        print("Tiga ditemukan, hentikan!")
        break
    print(angka)

# Output:
# 1
# 2
# Tiga ditemukan, hentikan!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sensor suhu memantau panas mesin dari 90 hingga 105 derajat " +
          "celcius, yang suhunya selalu naik 5 derajat di setiap " +
          "pengukuran. Sistem memiliki fitur pengaman: jika suhu " +
          "mencapai atau lebih besar dari 100 derajat, mesin harus " +
          'mencetak teks "Overheat!" dan segera menghentikan loop ' +
          "(break). Di dalam loop yang telah disediakan, buatlah " +
          "logika if dan break. Perintah print(suhu) sudah diletakkan " +
          "untuk mencetak suhu normal.",
        starterCode: `# range(90, 110, 5) berarti: mulai 90, berhenti sebelum 110, naik sebesar 5
for suhu in range(90, 110, 5):
    # Cek apakah suhu >= 100. Jika ya, cetak "Overheat!" dan break

    print(suhu)
`,
        hints: [
          "Di bawah deklarasi for, sisipkan pengecekan pengkondisian if suhu >= 100:.",
          'Di dalam blok if tersebut, jalankan perintah print("Overheat!") kemudian tambahkan perintah break di baris berikutnya.',
          "Perintah print(suhu) tetap berada di luar blok if, namun masih di dalam blok for agar suhu normal tercetak.",
        ],
        answerHint: `for suhu in range(90, 110, 5):
    if suhu >= 100:
        print("Overheat!")
        break
    print(suhu)`,
        checker: {
          type: "stdout_exact",
          expected: "90\n95\nOverheat!",
        },
        successFeedback:
          "Luar biasa! Perintah break adalah alat yang sangat " +
          "fundamental untuk efisiensi sistem, karena dapat menghemat " +
          "performa komputer dari melakukan proses loop yang sudah tidak lagi diperlukan.",
      },
    },
    {
      id: "L6",
      slug: "continue",
      title: "Melewati Iterasi dengan Continue",
      theory: {
        explanation: `Jika break menghentikan loop sepenuhnya, perintah continue
digunakan untuk melewati sisa baris kode pada iterasi (putaran) saat
ini, dan langsung melompat untuk memulai iterasi berikutnya.

Ini sangat berguna ketika kita ingin melewati data tertentu di dalam
sebuah rentang tanpa menghentikan proses perulangan keseluruhan.`,
        example: {
          description: "Mencetak angka, tetapi melewati angka 2.",
          code: `for angka in range(1, 4):
    if angka == 2:
        continue
    print(angka)

# Output:
# 1
# 3`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sistem sedang memproses antrian angka dari 1 hingga 5. " +
          "Namun, mesin tidak boleh mencetak angka 3 (misalnya karena " +
          "sistem sedang error pada data tersebut). Gunakan sebuah " +
          "loop for, pengkondisian if, dan perintah continue untuk " +
          "mencetak semua angka dari 1 sampai 5, tetapi melewati " +
          "cetakan ketika angkanya bernilai persis 3.",
        starterCode: `for angka in range(1, 6):
    # Buat logika untuk mengabaikan angka 3 menggunakan continue di sini

    print(angka)
`,
        hints: [
          "Tambahkan pengecekan if angka == 3:.",
          "Jika kondisi tersebut True, panggil perintah continue.",
          "Ingat bahwa print(angka) harus berada sejajar dengan posisi if (berada di dalam loop, tapi di luar blok pengkondisian).",
        ],
        answerHint: `for angka in range(1, 6):
    if angka == 3:
        continue
    print(angka)`,
        checker: {
          type: "stdout_exact",
          expected: "1\n2\n4\n5",
        },
        successFeedback:
          "Tepat sekali! Perintah continue sangat bermanfaat untuk " +
          '"menyaring" atau melakukan "filter" pada data tanpa mengacaukan keseluruhan alur loop.',
      },
    },
    {
      id: "L7",
      slug: "tantangan-chapter-8",
      title: "Tantangan Chapter 8",
      theory: {
        explanation: `Kini saatnya menggabungkan perulangan (for loop), range(),
serta fungsi (def) untuk menyelesaikan sebuah masalah simulasi di
dunia nyata. Di Python, kamu bisa menjalankan loop di dalam sebuah
fungsi untuk menghitung nilai akumulatif, lalu mengembalikan hasilnya
dengan return.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Seseorang mulai menabung secara bertahap setiap bulan. " +
          "Pada bulan pertama (bulan ke-1), jumlah uang yang ditabung " +
          "adalah Rp0. Untuk setiap bulan berikutnya, jumlah uang yang " +
          "ditambahkan ke tabungan adalah nomor bulan saat ini dikali " +
          "Rp5.000.\n\n" +
          "Sebagai contoh:\n" +
          "- Pada bulan ke-1, total tabungan adalah Rp0.\n" +
          "- Untuk berpindah dari bulan ke-1 (bulan saat ini) ke bulan " +
          "ke-2, ditambahkan Rp5.000 (1 * 5.000), sehingga total menjadi Rp5.000.\n" +
          "- Untuk berpindah dari bulan ke-2 (bulan saat ini) ke bulan " +
          "ke-3, ditambahkan Rp10.000 (2 * 5.000), sehingga total menjadi Rp15.000.\n" +
          "- Untuk berpindah dari bulan ke-3 (bulan saat ini) ke bulan " +
          "ke-4, ditambahkan Rp15.000 (3 * 5.000), sehingga total menjadi Rp30.000.\n\n" +
          "Tugasmu: Lengkapi fungsi hitung_total_tabungan(bulan) di " +
          "bawah ini agar dapat menghitung total tabungan berdasarkan bulan yang diberikan.",
        starterCode: `def hitung_total_tabungan(bulan):
    # Hapus kata 'pass' dan lengkapi fungsinya
    pass

# Kode di bawah ini akan menguji fungsimu. Jangan dihapus.
print(hitung_total_tabungan(4))
`,
        hints: [
          "Di dalam fungsi, buat variable penampung awal: total = 0.",
          "Buat loop for menggunakan rentang bulan dengan range(1, bulan).",
          "Di dalam loop, tambahkan nilai tabungan ke variable total dengan rumus total += current_month * 5000. Pastikan untuk mengakhiri fungsimu dengan baris return total (sejajar dengan deklarasi awal for, bukan di dalam loop-nya).",
        ],
        answerHint: `def hitung_total_tabungan(bulan):
    total = 0
    for bulan_saat_ini in range(1, bulan):
        total += bulan_saat_ini * 5000
    return total

print(hitung_total_tabungan(4))`,
        checker: {
          type: "stdout_exact",
          expected: "30000",
        },
        successFeedback:
          "Fantastis! Kamu berhasil menerapkan iterasi dengan operasi " +
          "aritmatika akumulatif di dalam sebuah fungsi. Ini adalah " +
          "struktur algoritma penting yang akan sangat membantumu " +
          "membangun perhitungan finansial atau statistik di aplikasi sesungguhnya!",
      },
    },
  ],
};
