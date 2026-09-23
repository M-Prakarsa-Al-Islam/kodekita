import type { ChapterContent } from "@/content/types";

export const chapter3: ChapterContent = {
  slug: "3-fungsi",
  order: 3,
  title: "Fungsi",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "apa-itu-fungsi",
      title: "Apa Itu Fungsi?",
      theory: {
        explanation: `Fungsi (function) adalah kumpulan baris kode yang diberi nama,
sehingga kamu bisa memanggil dan menggunakannya berkali-kali tanpa
harus menulis ulang. Di Python, kita menggunakan kata kunci def (dari
kata define) untuk membuat fungsi baru.`,
        example: {
          description: "Membuat fungsi sederhana.",
          code: `def sapa_dunia():
    print("Halo Dunia!")
    # Output: (Tidak ada output sampai fungsi ini dipanggil)`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Kata kunci apa yang wajib digunakan di Python untuk mulai membuat sebuah fungsi baru?",
        options: ["func", "def", "function", "define"],
        correctIndex: 1,
        explanation: "Python menggunakan kata kunci def untuk mendefinisikan sebuah fungsi.",
      },
    },
    {
      id: "L2",
      slug: "memanggil-fungsi",
      title: "Memanggil Fungsi (Calling a Function)",
      theory: {
        explanation: `Fungsi yang baru saja dibuat tidak akan berjalan dengan
sendirinya; program hanya menyimpannya di memori. Agar kodenya
dijalankan, kita harus "memanggilnya" (calling) dengan cara menuliskan
nama fungsi tersebut diikuti tanda kurung ().`,
        example: {
          description: "Memanggil fungsi yang sudah didefinisikan.",
          code: `def mulai():
    print("Sistem diaktifkan")

mulai()
# Output: Sistem diaktifkan`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini sudah tersedia fungsi bernama tampilkan_pesan(). " +
          "Tugasmu hanya satu: panggil fungsi tersebut di baris paling " +
          "bawah agar teksnya tercetak ke layar.",
        starterCode: `def tampilkan_pesan():
    print("Selamat datang di aplikasi!")

# Panggil fungsinya di bawah baris ini

`,
        hints: [
          "Tulis nama fungsinya.",
          "Jangan lupa tambahkan tanda kurung () di akhir nama fungsi.",
        ],
        answerHint: `def tampilkan_pesan():
    print("Selamat datang di aplikasi!")

tampilkan_pesan()`,
        checker: {
          type: "stdout_exact",
          expected: "Selamat datang di aplikasi!",
        },
        successFeedback: "Bagus! Sekarang kamu tahu cara menjalankan fungsi yang sudah dibuat.",
      },
    },
    {
      id: "L3",
      slug: "indentasi-python",
      title: "Indentasi di Python (Indentation)",
      theory: {
        explanation: `Di Python, indentasi (spasi/tab di awal baris) sangat krusial karena digunakan untuk menentukan blok kode atau isi dari suatu fungsi. Jika bahasa lain menggunakan kurung kurawal {}, Python menggunakan spasi (biasanya 4 spasi). Baris kode yang sejajar berarti berada di blok yang sama.`,
        example: {
          description: "Contoh penulisan indentasi yang benar dan contoh kesalahan (IndentationError).",
          code: `def sapa():
    # Benar: kode di dalam fungsi diberi indentasi (4 spasi)
    print("Halo, selamat belajar!")

sapa()

# Contoh Error 1: Lupa memberi indentasi di dalam blok fungsi
def sapa_error():
print("Halo!") 
# Output: IndentationError: expected an indented block after function definition on line 1

# Contoh Error 2: Indentasi tidak konsisten/selevel
def hitung_error():
    print("Mulai")
   print("Selesai") 
# Output: IndentationError: unindent does not match any outer indentation level`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kode di bawah ini mengalami error karena baris print() di dalam fungsi tidak memiliki indentasi. " +
          "Perbaiki kode tersebut dengan menambahkan indentasi (spasi) sebelum perintah print().",
        starterCode: `def cetak_status():
print("Status: Aktif")

cetak_status()`,
        hints: [
          "Tambahkan spasi di awal baris `print(\"Status: Aktif\")`.",
          "Gunakan 4 spasi atau tekan tombol Tab di awal baris print agar masuk ke dalam blok fungsi.",
        ],
        answerHint: `def cetak_status():
    print("Status: Aktif")

cetak_status()`,
        checker: {
          type: "stdout_exact",
          expected: "Status: Aktif",
        },
        successFeedback: "Keren! Kamu sudah paham betapa pentingnya indentasi di Python.",
      },
    },
    {
      id: "L4",
      slug: "parameter-vs-argumen",
      title: "Parameter vs Argumen",
      theory: {
        explanation: `Banyak pemula kebingungan membedakan parameter dan argumen.
Perbedaannya sangat penting:

Parameter adalah variabel penampung yang kamu letakkan di dalam tanda
kurung saat membuat (mendefinisikan) fungsi.
Argumen adalah data atau nilai asli yang kamu masukkan ke dalam tanda
kurung saat memanggil fungsi tersebut.`,
        example: {
          description: "Membedakan parameter dan argumen.",
          code: `# 'nama' di bawah ini adalah Parameter
def sapa_user(nama):
    print(f"Halo {nama}")

# "Andi" di bawah ini adalah Argumen
sapa_user("Andi")
# Output: Halo Andi`,
        },
      },
      practice: {
        kind: "quiz",
        question: "Berdasarkan penjelasan di atas, pernyataan manakah yang paling tepat?",
        options: [
          "Parameter dan argumen adalah hal yang sama dan istilahnya bisa ditukar-tukar.",
          "Parameter digunakan saat memanggil fungsi, argumen digunakan saat membuat fungsi.",
          "Parameter adalah variabel penampung saat fungsi dibuat, sedangkan argumen adalah nilai nyata yang diberikan saat fungsi dipanggil.",
          "Argumen wajib ditulis menggunakan angka, sedangkan parameter menggunakan teks.",
        ],
        correctIndex: 2,
        explanation:
          "Ingat aturannya: Parameter ada di baris 'def' (saat dibuat), " +
          "Argumen ada saat pemanggilan (saat digunakan).",
      },
    },
    {
      id: "L5",
      slug: "kuis-parameter-argumen",
      title: "Kuis: Mengidentifikasi Parameter dan Argumen",
      theory: {
        explanation: `Mari kita uji pemahamanmu tentang perbedaan parameter dan
argumen. Perhatikan potongan kode berikut:

def hitung(angka_pertama):
    print(angka_pertama + 10)

hitung(5)`,
      },
      practice: {
        kind: "quiz",
        question: "Pada kode di atas, angka 5 bertindak sebagai apa?",
        options: ["Variabel", "Fungsi", "Parameter", "Argumen"],
        correctIndex: 3,
        explanation:
          "Angka 5 adalah nilai nyata yang dikirimkan saat memanggil " +
          "fungsi, sehingga ia disebut argumen. Sementara angka_pertama " +
          "adalah parameternya.",
      },
    },
    {
      id: "L6",
      slug: "return-multiple-parameter",
      title: "Mengembalikan Nilai dari Banyak Parameter",
      theory: {
        explanation: `Sebuah fungsi bisa menerima lebih dari satu parameter
(dipisahkan tanda koma). Selain itu, fungsi jarang menggunakan print()
secara langsung di dunia nyata. Biasanya fungsi akan menghitung
sesuatu lalu menggunakan kata kunci return untuk mengembalikan
hasilnya ke luar fungsi, agar bisa disimpan ke dalam variabel.`,
        example: {
          description: "Fungsi dengan dua parameter yang mengembalikan hasil hitungan.",
          code: `def tambah(a, b):
    return a + b  # Mengembalikan hasil, tidak langsung dicetak

hasil = tambah(10, 5) # Argumen 10 masuk ke 'a', 5 masuk ke 'b'
print(hasil)
# Output: 15`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi fungsi hitung_luas agar bisa menerima dua parameter: " +
          "panjang dan lebar. Fungsi tersebut harus melakukan return " +
          "hasil perkalian keduanya. Kemudian panggil fungsi tersebut " +
          "dengan argumen 10 dan 8, simpan hasilnya di variabel " +
          "luas_tanah, dan cetak variabelnya.",
        starterCode: `# Tambahkan parameter di dalam kurung dan lengkapi return
def hitung_luas( ):
    return

# Panggil fungsinya, simpan ke variabel, lalu cetak

`,
        hints: [
          "Tulis panjang, lebar di dalam kurung def hitung_luas.",
          "Kembalikan hasil panjang * lebar.",
        ],
        answerHint: `def hitung_luas(panjang, lebar):
    return panjang * lebar

luas_tanah = hitung_luas(10, 8)
print(luas_tanah)`,
        checker: {
          type: "stdout_exact",
          expected: "80",
        },
        successFeedback: "Luar biasa! Kamu sudah menguasai cara kerja return dengan multiple parameter.",
      },
    },
    {
      id: "L7",
      slug: "fungsi-main",
      title: "Fungsi Utama (Entry Point)",
      theory: {
        explanation: `Programmer Python memiliki kebiasaan baik untuk membungkus
kode utama mereka ke dalam sebuah fungsi khusus yang dinamakan main()
(entry point atau titik masuk). Ini membuat kode menjadi sangat rapi
karena variabel dan proses utama tidak berceceran di luar fungsi. Di
akhir baris (script), kita tinggal memanggil main().`,
        example: {
          description: "Menggunakan fungsi main() untuk merapikan alur program.",
          code: `def sapa(nama):
    return f"Halo {nama}"

def main():
    pesan = sapa("Budi")
    print(pesan)

main() # Memulai program secara keseluruhan
# Output: Halo Budi`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di dalam starter code sudah ada fungsi " +
          "kuadrat(). Tugasmu:\n" +
          "1. Buat sebuah fungsi bernama main().\n" +
          "2. Di dalam main(), panggil kuadrat() dengan argumen 6, dan " +
          "simpan hasilnya di variabel hasil_kuadrat.\n" +
          "3. Masih di dalam main(), cetak f-string persis seperti ini: " +
          '"Hasilnya adalah {hasil_kuadrat}".\n' +
          "4. Terakhir, panggil main() di baris paling bawah.",
        starterCode: `def kuadrat(angka):
    return angka * angka

# Buat fungsi main() beserta isinya di bawah ini



# Panggil main() di bawah ini

`,
        hints: [
          "Deklarasi fungsi main ditulis dengan def main():.",
          "Jangan lupa indentasi (spasi ke dalam) saat menulis isi di dalam main().",
          "Panggil main() tanpa indentasi di baris paling bawah.",
        ],
        answerHint: `def kuadrat(angka):
    return angka * angka

def main():
    hasil_kuadrat = kuadrat(6)
    print(f"Hasilnya adalah {hasil_kuadrat}")

main()`,
        checker: {
          type: "stdout_exact",
          expected: "Hasilnya adalah 36",
        },
        successFeedback:
          "Cerdas! Menggunakan main() adalah standar industri yang dipakai programmer profesional untuk menstruktur kode mereka.",
      },
    },
    {
      id: "L8",
      slug: "tantangan-chapter-3",
      title: "Tantangan Chapter 3",
      theory: {
        explanation: `Waktunya ujian akhir untuk Chapter Fungsi! Kamu akan bekerja
layaknya programmer sesungguhnya dengan merangkai beberapa fungsi
sekaligus, termasuk fungsi main(). Ikuti instruksi dengan teliti.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi starter code di bawah dengan aturan berikut:\n" +
          "1. Lengkapi fungsi hitung_harga_total agar me-return hasil " +
          "dari argumen harga_satuan dikalikan argumen jumlah_barang.\n" +
          "2. Lengkapi fungsi terapkan_diskon agar me-return hasil dari " +
          "argumen total_harga dikurangi argumen potongan.\n" +
          "3. Di dalam fungsi main() yang masih kosong, buat tiga " +
          "variabel berikut:\n" +
          "   - harga_laptop = 5000000\n" +
          "   - jumlah_beli = 2\n" +
          "   - diskon_member = 500000\n" +
          "4. Masih di dalam main(), panggil hitung_harga_total (gunakan " +
          "argumen harga_laptop dan jumlah_beli) lalu simpan ke variabel " +
          "bernama total_awal.\n" +
          "5. Panggil terapkan_diskon (gunakan argumen total_awal dan " +
          "diskon_member) lalu simpan ke variabel total_akhir.\n" +
          "6. Cetak hasilnya menggunakan f-string yang formatnya sama " +
          'persis: "Total bayar: 9500000"',
        starterCode: `def hitung_harga_total(harga_satuan, jumlah_barang):
    # Tulis kodemu di sini
    return

def terapkan_diskon(total_harga, potongan):
    # Tulis kodemu di sini
    return

def main():
    # Buat variabel dan panggil ke dua fungsi tadi di sini
    pass

main()
`,
        hints: [
          "Ganti kata return yang kosong di dua fungsi pertama dengan operasi matematika yang diminta.",
          "Hapus kata pass di dalam fungsi main() dan ganti dengan deklarasi variabel serta pemanggilan fungsi.",
        ],
        answerHint: `def hitung_harga_total(harga_satuan, jumlah_barang):
    return harga_satuan * jumlah_barang

def terapkan_diskon(total_harga, potongan):
    return total_harga - potongan

def main():
    harga_laptop = 5000000
    jumlah_beli = 2
    diskon_member = 500000
    total_awal = hitung_harga_total(harga_laptop, jumlah_beli)
    total_akhir = terapkan_diskon(total_awal, diskon_member)
    print(f"Total bayar: {total_akhir}")

main()`,
        checker: {
          type: "stdout_exact",
          expected: "Total bayar: 9500000",
        },
        successFeedback:
          "Fantastis! Kamu baru saja merangkai sebuah alur program yang " +
          "solid menggunakan fungsi-fungsi dengan multiple parameters, " +
          "return value, dan sistem entry point (main). Level " +
          "pemrogramanmu baru saja naik drastis!",
      },
    },
  ],
};
