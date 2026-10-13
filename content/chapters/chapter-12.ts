import type { ChapterContent } from "@/content/types";

export const chapter12: ChapterContent = {
  slug: "12-error",
  order: 12,
  title: "Error dan Exception Handling",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "bug-vs-error",
      title: "Bug vs Error (Exception)",
      theory: {
        explanation: `Dalam dunia pemrograman, sering terjadi kesalahpahaman antara istilah Bug dan Error (Exception). Keduanya adalah hal yang sangat berbeda.

- Bug: kecacatan pada logika kodemu. Program tetap bisa berjalan sampai selesai tanpa peringatan, namun hasil akhirnya salah (misal: rumus matematika yang terbalik). Ini adalah musuh terbesar programmer karena sulit dilacak.

- Error (Exception): sebuah kondisi penolakan saat program menghadapi instruksi yang mustahil (misal: membagi angka dengan nol, atau membuka file yang tidak ada). Exception justru sangat baik dan kita ekspektasikan karena ia langsung menghentikan program sebelum kerusakan yang lebih besar (seperti korupsi data) terjadi.`,
        example: {
          description:
            "Contoh Bug (logika salah, program tetap jalan) vs Exception (program dihentikan).",
          code: `# CONTOH BUG: Seharusnya ditambah, tapi malah dikurang
luas = 10 - 5
print("Luas:", luas) # Output: Luas: 5 (Program jalan, hasil salah)

# CONTOH EXCEPTION: Program langsung dihentikan oleh Python
pembagian = 10 / 0  # Akan memicu ZeroDivisionError`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Kamu menulis program untuk menghitung diskon sebesar 20%. Namun, " +
          "kamu tidak sengaja mengalikan harga dengan 20, bukan 0.2. Program " +
          "berjalan lancar tanpa terhenti, namun harga akhirnya menjadi " +
          "jutaan. Masalah ini dikategorikan sebagai...",
        options: ["SyntaxError", "Bug", "Exception", "ValueError"],
        correctIndex: 1,
        explanation:
          "Karena program tidak mengalami crash atau penolakan eksekusi, " +
          "melainkan menghasilkan logika perhitungan yang meleset dari tujuan " +
          "awal, masalah ini diklasifikasikan sebagai Bug.",
      },
    },
    {
      id: "L2",
      slug: "try-dan-except",
      title: "Menangani Error dengan Try dan Except",
      theory: {
        explanation: `Karena Exception memang diekspektasikan terjadi untuk melindungi program, kita perlu tahu cara menanganinya agar aplikasi kita tidak berhenti mendadak (crash) di hadapan pengguna.

Kita menggunakan struktur pelindung try dan except. Letakkan kode berisiko di dalam blok try. Jika kode tersebut gagal, Python tidak akan mematikan program, melainkan langsung melompat mengeksekusi instruksi penyelamatan di dalam blok except.`,
        example: {
          description: "Menggunakan try-except untuk menyelamatkan program dari crash.",
          code: `teks = "abc"

try:
    angka = int(teks)
    print("Berhasil diubah!")
except:
    print("Gagal mengubah teks ke angka!")

# Output:
# Gagal mengubah teks ke angka!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang membuat kalkulator pembagian. Jika pengguna " +
          "memasukkan angka pembagi 0, program akan crash.\n" +
          "Bungkus operasi pembagian 100 / pembagi beserta perintah " +
          "cetaknya ke dalam blok try. Kemudian, buat blok except di " +
          'bawahnya yang mencetak teks "Tidak bisa membagi angka".',
        starterCode: `pembagi = 0

# Tulis blok try pelindung di bawah ini
hasil = 100 / pembagi
print(hasil)

# Tulis penanganan except di bawah ini
`,
        hints: [
          "Ketik try: (dengan titik dua). Di baris bawahnya, berikan indentasi (masuk satu tab) untuk hasil dan print(hasil).",
          'Sejajar dengan posisi try, ketik except:. Di baris bawahnya, tambahkan print("Tidak bisa membagi angka").',
        ],
        answerHint: `pembagi = 0

try:
    hasil = 100 / pembagi
    print(hasil)
except:
    print("Tidak bisa membagi angka")`,
        checker: {
          type: "stdout_exact",
          expected: "Tidak bisa membagi angka",
        },
        successFeedback:
          "Sempurna! Kamu telah membuat jaring pengaman. Konsep penangkapan " +
          "error ini adalah fondasi dalam membangun aplikasi yang stabil.",
      },
    },
    {
      id: "L3",
      slug: "menangkap-error-spesifik",
      title: "Menangkap Error Spesifik",
      theory: {
        explanation: `Menggunakan except: biasa memang praktis karena akan menangkap jenis error apa pun. Namun, standar di dunia industri adalah menangkap nama error secara spesifik.

Berikut adalah beberapa nama error (Exception) yang sering ditemui beserta penyebab utamanya:
- ValueError: terjadi saat sebuah fungsi menerima tipe data yang tepat, tetapi isinya tidak masuk akal (contoh: memaksa teks huruf diubah menjadi angka dengan int("sepuluh")).
- ZeroDivisionError: terjadi saat program mencoba membagi sebuah angka dengan nol (contoh: 10 / 0).
- TypeError: terjadi saat operasi matematis atau penggabungan melibatkan tipe data yang tidak kompatibel (contoh: teks ditambah angka "Umur: " + 20).
- IndexError: terjadi saat mencoba mengakses urutan indeks List yang tidak tersedia (contoh: mengakses elemen ke-5 dari List yang hanya berisi 2 item).

Dengan menuliskan nama spesifiknya, kita bisa memberikan alur penanganan yang berbeda-beda tergantung dari masalah yang terjadi. Kamu bisa meletakkan lebih dari satu blok except spesifik di bawah satu blok try.`,
        example: {
          description:
            "Memberikan respons berbeda untuk ZeroDivisionError dan ValueError.",
          code: `data = "0"

try:
    angka = int(data) # Bisa memicu ValueError jika data bukan angka
    hasil = 10 / angka # Bisa memicu ZeroDivisionError jika angka adalah 0
    print(hasil)
except ValueError:
    print("Pastikan data berupa angka!")
except ZeroDivisionError:
    print("Angka tidak boleh nol!")

# int("0") berhasil (angka menjadi 0), tapi 10 / 0 memicu ZeroDivisionError.
# Output: Angka tidak boleh nol!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Diberikan sebuah variabel input permintaan = "sepuluh".\n' +
          "Bungkus proses konversi dan perhitungan pembagian ke dalam " +
          "struktur try yang memiliki dua buah except spesifik:\n" +
          '1. except ValueError: yang mencetak "Salah input".\n' +
          '2. except ZeroDivisionError: yang mencetak "Tidak bisa dibagi 0".',
        starterCode: `stok = 50
permintaan = "sepuluh"

# Mulai blok try
angka = int(permintaan)
hasil = stok / angka
print(hasil)

# Tangkap ValueError dan cetak pesan sesuai instruksi


# Tangkap ZeroDivisionError dan cetak pesan sesuai instruksi
`,
        hints: [
          "Letakkan baris angka, hasil, dan print menjorok ke dalam blok try:.",
          "Blok pertama adalah except ValueError: diikuti eksekusi pencetakannya di baris baru.",
          "Blok kedua adalah except ZeroDivisionError: diikuti eksekusi pencetakannya di baris baru.",
        ],
        answerHint: `stok = 50
permintaan = "sepuluh"

try:
    angka = int(permintaan)
    hasil = stok / angka
    print(hasil)
except ValueError:
    print("Salah input")
except ZeroDivisionError:
    print("Tidak bisa dibagi 0")`,
        checker: {
          type: "stdout_exact",
          expected: "Salah input",
        },
        successFeedback:
          'Tepat sekali! Karena kata "sepuluh" tidak bisa diubah menjadi ' +
          "bilangan integer, Python menghentikan eksekusi di baris konversi " +
          "dan langsung melompat ke blok ValueError.",
      },
    },
    {
      id: "L4",
      slug: "raise-exception",
      title: "Memunculkan Error (Raise Exception)",
      theory: {
        explanation: `Karena Exception adalah sinyal penolakan yang baik untuk mencegah aplikasi berjalan ke arah yang salah, kita sebagai pembuat program diizinkan untuk memunculkan error kita sendiri secara sengaja menggunakan perintah raise.

Misalnya, Python tidak menganggap variabel berisi angka negatif sebagai sebuah error matematis. Namun, jika kamu membuat program sistem umur, angka negatif adalah kemustahilan. Di sinilah kamu memunculkan penolakanmu secara manual. Kamu juga bisa menitipkan pesan teks di dalam tanda kurungnya.`,
        example: {
          description:
            "Memicu ValueError secara sengaja jika data tidak sesuai aturan kita.",
          code: `umur = -5

if umur < 0:
    raise ValueError("Umur tidak mungkin minus!")

# Output:
# ValueError: Umur tidak mungkin minus!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang membuat sistem pendaftaran akun. Terdapat pengecekan " +
          "tipe data boolean syarat_ketentuan.\n" +
          "Buat sebuah kondisi pengkondisian (if statement): jika nilai " +
          "syarat_ketentuan adalah False, munculkan penolakan menggunakan " +
          'raise ValueError("Harus menyetujui syarat").\n' +
          "(Sistem try-except di bawahnya sudah disiapkan untuk menangkap " +
          "error yang kamu munculkan).",
        starterCode: `syarat_ketentuan = False

def validasi_pendaftaran(syarat):
    # Tulis pengecekan if dan perintah raise di bawah ini


    print("Pendaftaran sukses")


# Blok ini digunakan untuk menjalankan dan menangkap error-mu
try:
    validasi_pendaftaran(syarat_ketentuan)
except ValueError as e:
    print(e)
`,
        hints: [
          "Gunakan pengecekan if syarat == False:.",
          'Di dalam blok if tersebut, jalankan perintah raise ValueError("Harus menyetujui syarat").',
          "Pesan error tersebut akan ditangkap oleh blok except terbawah sebagai variabel e dan dicetak.",
        ],
        answerHint: `syarat_ketentuan = False

def validasi_pendaftaran(syarat):
    if syarat == False:
        raise ValueError("Harus menyetujui syarat")
    print("Pendaftaran sukses")

try:
    validasi_pendaftaran(syarat_ketentuan)
except ValueError as e:
    print(e)`,
        checker: {
          type: "stdout_exact",
          expected: "Harus menyetujui syarat",
        },
        successFeedback:
          "Sangat bagus! Menghentikan eksekusi fungsi sedini mungkin secara " +
          "manual adalah praktik keamanan yang krusial. Pesan teks dari " +
          "eksepsimu juga bisa dipanggil menggunakan parameter opsional 'as' " +
          "pada except.",
      },
    },
    {
      id: "L5",
      slug: "guard-clauses-vs-nested-if",
      title: "Guard Clauses vs Nested If-Else",
      theory: {
        explanation: `Salah satu teknik arsitektur kode (clean code) yang paling populer adalah Guard Clauses (klausa pelindung). Teknik ini menggunakan banyak pernyataan if sejajar yang dipadukan dengan raise exception di bagian paling atas sebuah fungsi, dibandingkan menggunakan satu rantai if-elif-else yang bersarang panjang ke dalam (nested).

Manfaatnya:
1. Lebih mudah dibaca: kode tidak menjorok terlalu jauh ke kanan.
2. Fail-Fast: fungsi akan langsung dihentikan oleh raise di tahap paling awal (sebagai pelindung gerbang/bouncer) sebelum menyentuh kode perhitungan utama di bawahnya. Tidak perlu menggunakan perintah else.`,
        example: {
          description:
            "Perbedaan gaya penulisan Nested If (Tidak disarankan) vs Guard Clause (Pilihan Industri).",
          code: `# CONTOH BURUK (Membingungkan & Terlalu Banyak Identasi)
def proses_buruk(umur, saldo):
    if umur >= 18:
        if saldo >= 100:
            print("Berhasil proses")
        else:
            raise ValueError("Saldo kurang")
    else:
        raise ValueError("Masih di bawah umur")

# CONTOH BAIK (Guard Clause: Datar, Rapi, Langsung Menolak)
def proses_baik(umur, saldo):
    if umur < 18:
        raise ValueError("Masih di bawah umur")
    if saldo < 100:
        raise ValueError("Saldo kurang")

    print("Berhasil proses") # Tidak butuh 'else', dieksekusi jika aman`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          'Mengapa arsitektur "Guard Clauses" (banyak if di awal dengan ' +
          "fungsi raise atau return) lebih disukai oleh developer senior " +
          "dibandingkan rantai blok if-else bersarang (nested) untuk " +
          "melakukan pengecekan kesalahan data?",
        options: [
          "Karena menggunakan banyak 'if' akan membuat komputer memproses instruksi lebih cepat dari 'else'.",
          "Karena mencegah kode menjorok terlalu jauh ke dalam, mudah dibaca, dan memberhentikan program sedini mungkin jika ada kegagalan (Fail-Fast).",
          "Karena 'else' memicu masalah SyntaxError pada beberapa versi Python.",
          "Karena 'if' bisa menyembunyikan Bug, sementara Exception memperbaikinya secara otomatis.",
        ],
        correctIndex: 1,
        explanation:
          "Pola Guard Clauses mempertahankan struktur program agar tetap " +
          "lurus sejajar (flat) dan langsung menghentikan aliran (Fail-Fast) " +
          "menggunakan raise apabila kondisi validasi awal tidak terpenuhi. " +
          "Ini membuat baris kode inti tidak tenggelam di balik tumpukan " +
          "kurung/identasi else.",
      },
    },
    {
      id: "L6",
      slug: "blok-finally",
      title: "Blok Finally",
      theory: {
        explanation: `Selain try dan except, Python menyediakan satu blok penutup bernama finally.

Instruksi yang diletakkan di dalam blok finally: akan selalu dieksekusi, tidak peduli apakah blok try berhasil berjalan dengan mulus ataupun hancur karena error.
Blok ini paling sering digunakan di industri untuk fungsi penutupan keamanan (seperti menutup koneksi database yang terbuka, atau menghapus berkas sementara dari memori) yang tidak boleh dilewatkan sama sekali.`,
        example: {
          description: "Blok finally selalu mengeksekusi instruksi akhirnya.",
          code: `try:
    print("Buka file")
    angka = 10 / 0 # Error terjadi di sini!
    print("Baris ini terlewat")
except ZeroDivisionError:
    print("Menangkap error")
finally:
    print("Tutup file kembali")

# Output:
# Buka file
# Menangkap error
# Tutup file kembali`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi alur proses sederhana di bawah ini. Tambahkan blok " +
          'finally di akhir struktur, dan berikan perintah print("Sistem dimatikan").',
        starterCode: `try:
    print("Sistem menyala")
    print(10 / 2)
except ZeroDivisionError:
    print("Terjadi error pembagian")

# Tulis blok finally beserta perintah cetaknya di bawah ini
`,
        hints: [
          "Sejajar dengan try dan except, buat kata kunci finally:.",
          'Di dalam blok tersebut, ketikkan print("Sistem dimatikan").',
        ],
        answerHint: `try:
    print("Sistem menyala")
    print(10 / 2)
except ZeroDivisionError:
    print("Terjadi error pembagian")
finally:
    print("Sistem dimatikan")`,
        checker: {
          type: "stdout_exact",
          expected: `Sistem menyala
5.0
Sistem dimatikan`,
        },
        successFeedback:
          "Kerja bagus! Dengan memahami siklus Try-Except-Finally, kamu " +
          "menjamin keamanan infrastruktur aplikasi saat menghadapi masalah terburuk.",
      },
    },
    {
      id: "L7",
      slug: "tantangan",
      title: "Tantangan Chapter 12",
      theory: {
        explanation: `Di tantangan akhir ini, kamu akan membangun simulasi logika perbankan mutakhir. Kamu harus merangkai perulangan (for), jaring pengaman (try-except), dan membentengi fungsi utamamu menggunakan Guard Clauses (raise ValueError).`,
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang membangun sistem pemroses penarikan uang dari antrean " +
          "transaksi mesin ATM.\n" +
          "Diberikan saldo awal saldo = 150, dan antrean uang yang ingin " +
          "ditarik penarikan = [50, -10, 100, 200].\n\n" +
          "Tugasmu:\n" +
          "1. Lakukan loop untuk melihat setiap nominal transaksi di dalam List penarikan.\n" +
          "2. Di awal loop, buka pelindung try:.\n" +
          "3. Di dalam try, gunakan metode Guard Clause untuk menyeleksi 2 masalah umum " +
          "(gunakan perintah raise ValueError(pesan) sesuai ketentuan teks berikut):\n" +
          '   - Jika nominal penarikan lebih kecil dari 0 (negatif), tolak dengan teks: "Nominal tidak valid"\n' +
          '   - Jika nominal penarikan lebih besar dari saldo saat ini, tolak dengan teks: "Saldo tidak cukup"\n' +
          "4. Masih di dalam try, jika kedua penjagaan (Guard Clause) itu lolos, kurangi saldo " +
          'dengan nominal penarikan tersebut, lalu cetak teks "Berhasil tarik [nominal]".\n' +
          "5. Buat penangkap spesifik except ValueError as e:. Di dalam blok except ini, cetak pesan dari variabel e.\n" +
          "6. Terakhir, di luar lingkaran loop sepenuhnya, cetak nilai saldo akhir menggunakan print().",
        starterCode: `penarikan = [50, -10, 100, 200]
saldo = 150

# Bangun algoritma ATM di bawah ini


`,
        hints: [
          "Awali iterasi: for nominal in penarikan:",
          "Buka pelindung: try:",
          'Guard 1: if nominal < 0: diikuti baris baru raise ValueError("Nominal tidak valid")',
          'Guard 2: if nominal > saldo: diikuti baris baru raise ValueError("Saldo tidak cukup")',
          'Kurangi saldo: saldo -= nominal lalu print(f"Berhasil tarik {nominal}")',
          "Tangkap: except ValueError as e: dan di bawahnya print(e)",
          "Akhiri baris paling kiri luar dengan print(saldo).",
        ],
        answerHint: `penarikan = [50, -10, 100, 200]
saldo = 150

for nominal in penarikan:
    try:
        if nominal < 0:
            raise ValueError("Nominal tidak valid")
        if nominal > saldo:
            raise ValueError("Saldo tidak cukup")

        saldo -= nominal
        print(f"Berhasil tarik {nominal}")
    except ValueError as e:
        print(e)

print(saldo)`,
        checker: {
          type: "stdout_exact",
          expected: `Berhasil tarik 50
Nominal tidak valid
Berhasil tarik 100
Saldo tidak cukup
0`,
        },
        successFeedback:
          "Sangat Luar Biasa! Ini adalah representasi murni dari cara kerja " +
          'program tingkat industri (Enterprise Code). Kamu menerapkan "Guard ' +
          'Clause" untuk penolakan cepat (Fail-Fast), merangkainya dengan ' +
          'proteksi "Try-Except", tanpa sekalipun membutuhkan blok else. ' +
          "Komposisi kodemu terstruktur sangat datar (flat) namun memiliki " +
          "keamanan operasional yang solid!",
      },
    },
  ],
};
