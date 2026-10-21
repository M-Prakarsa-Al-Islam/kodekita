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
      slug: "input-dari-pengguna",
      title: "Meminta Input dari Pengguna (input)",
      theory: {
        explanation: `Sejauh ini programmu selalu menghasilkan hal yang sama setiap kali dijalankan. Dengan fungsi input(), programmu bisa berhenti sejenak dan menunggu pengguna mengetik sesuatu. Teks di dalam kurung adalah pesan (prompt) yang tampil di layar, dan apa pun yang diketik pengguna dikembalikan sebagai teks yang bisa disimpan ke variabel.

Di editor ini, jawaban yang akan diketik pengguna kamu tulis di kotak Input program di bawah editor, satu baris untuk setiap input(). Hasilnya tampil seperti sesi di terminal: pesan, jawaban yang diketik, lalu hasil program.`,
        example: {
          description: "Menanyakan nama pengguna lalu menyapanya.",
          code: `nama = input("Siapa namamu? ")
print(f"Halo, {nama}!")

# Jika pengguna mengetik Budi, layar menampilkan:
# Siapa namamu? Budi
# Halo, Budi!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buat program yang menyapa pengguna. Jawaban Budi sudah ada di " +
          "kotak Input program.\n" +
          '1. Gunakan input() untuk bertanya "Siapa namamu? " (perhatikan ' +
          "spasi di akhir pesan) dan simpan jawabannya di variabel nama.\n" +
          '2. Cetak f-string persis seperti ini: "Halo, {nama}! Selamat ' +
          'belajar Python."',
        starterCode: `# 1. Minta nama pengguna dengan input(), simpan ke variabel nama

# 2. Sapa pengguna dengan f-string
`,
        stdin: ["Budi"],
        hints: [
          'Tulis nama = input("Siapa namamu? "). Jawaban pengguna akan tersimpan di variabel nama.',
          'Cetak dengan print(f"Halo, {nama}! Selamat belajar Python.").',
        ],
        answerHint: `nama = input("Siapa namamu? ")
print(f"Halo, {nama}! Selamat belajar Python.")`,
        checker: {
          type: "stdout_exact",
          expected: `Siapa namamu? Budi
Halo, Budi! Selamat belajar Python.`,
        },
        successFeedback:
          "Bagus! Sekarang programmu bisa berinteraksi dengan pengguna. " +
          "Perhatikan outputnya mirip sesi terminal sungguhan: pesan, " +
          "jawaban yang diketik, lalu hasil program.",
      },
    },
    {
      id: "L9",
      slug: "input-selalu-teks",
      title: "input() Selalu Berupa Teks, Ubah dengan int()",
      theory: {
        explanation: `Apa pun yang diketik pengguna diterima input() sebagai teks (string), termasuk angka. Jadi "5" yang diketik pengguna bukan angka 5 melainkan teks "5", dan teks tidak bisa dihitung seperti angka.

Untuk mengubah teks berisi angka menjadi bilangan bulat (int), bungkus dengan fungsi int(). Kamu juga boleh langsung menggabungkannya: int(input("Umur: ")).

Penting: lupa memakai int() adalah salah satu kesalahan paling umum pemula. Kalau hasil hitunganmu aneh (misalnya "3" dikali 3 menjadi 333), cek apakah angkanya masih berupa teks.`,
        example: {
          description: "Mengubah jawaban pengguna menjadi angka sebelum menghitung.",
          code: `umur_teks = input("Umur: ")   # pengguna mengetik 20, hasilnya teks "20"
umur = int(umur_teks)         # sekarang berupa angka 20
print(umur + 1)

# Layar menampilkan:
# Umur: 20
# 21`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Dua baris input() sudah ditulis untuk kamu, dan jawabannya sudah " +
          "ada di kotak Input program. Tugasmu:\n" +
          "1. Ubah harga dan jumlah menjadi bilangan bulat dengan int().\n" +
          "2. Hitung total, yaitu harga dikali jumlah.\n" +
          '3. Cetak f-string dengan format "Total: {total}".',
        starterCode: `harga = input("Harga satuan: ")
jumlah = input("Jumlah beli: ")

# Ubah harga dan jumlah menjadi angka (int), lalu hitung totalnya

# Cetak totalnya
`,
        stdin: ["5000", "3"],
        hints: [
          "Ubah dengan harga = int(harga) dan jumlah = int(jumlah).",
          'Hitung total = harga * jumlah, lalu cetak dengan print(f"Total: {total}").',
        ],
        answerHint: `harga = input("Harga satuan: ")
jumlah = input("Jumlah beli: ")

harga = int(harga)
jumlah = int(jumlah)
total = harga * jumlah

print(f"Total: {total}")`,
        checker: {
          type: "stdout_exact",
          expected: `Harga satuan: 5000
Jumlah beli: 3
Total: 15000`,
        },
        successFeedback:
          "Mantap! Ingat aturan emasnya: input() selalu menghasilkan teks, " +
          "jadi ubah dulu dengan int() sebelum menghitung.",
      },
    },
    {
      id: "L10",
      slug: "membaca-file",
      title: "Membaca File: open() dan read()",
      theory: {
        explanation: `Program sering perlu membaca data yang tersimpan di dalam sebuah file. Fungsi open("nama_file") membuka file untuk dibaca, lalu .read() mengambil seluruh isinya sebagai satu teks, dan .close() menutup file setelah selesai dipakai.

File dicari di folder yang sama dengan programmu. Jika nama file salah, Python menampilkan error FileNotFoundError.

Perhatikan tab di atas editor. Pada lesson ini ada dua file: main.py adalah kodemu, dan catatan.txt adalah file yang akan dibaca. Klik tab catatan.txt untuk melihat isinya (file ini hanya bisa dibaca).`,
        example: {
          description: "Membuka, membaca, lalu menutup file.",
          code: `file = open("catatan.txt")
isi = file.read()
file.close()

print(isi)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi main.py agar membaca dan mencetak isi catatan.txt:\n" +
          "1. Buka file catatan.txt dengan open().\n" +
          "2. Baca seluruh isinya dengan .read() dan simpan ke variabel isi.\n" +
          "3. Tutup file dengan .close().\n" +
          "4. Cetak isi.",
        files: [
          {
            name: "main.py",
            content: `# 1. Buka file catatan.txt dengan open()

# 2. Baca seluruh isinya dengan .read(), simpan ke variabel isi

# 3. Tutup file dengan .close()

# 4. Cetak isi
`,
          },
          {
            name: "catatan.txt",
            content: `Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
            editable: false,
          },
        ],
        hints: [
          'Buka file dengan file = open("catatan.txt").',
          "Baca dengan isi = file.read(), lalu tutup dengan file.close().",
          "Cetak dengan print(isi).",
        ],
        answerFiles: {
          "main.py": `file = open("catatan.txt")
isi = file.read()
file.close()

print(isi)`,
        },
        checker: {
          type: "stdout_exact",
          expected: `Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
          sourceRequirements: [
            {
              pattern: String.raw`open\s*\(`,
              message: "Outputnya sudah benar, tapi file belum dibuka dengan open().",
              file: "main.py",
            },
            {
              pattern: String.raw`\.read\s*\(`,
              message: "Outputnya sudah benar, tapi isi file belum dibaca dengan .read().",
              file: "main.py",
            },
          ],
        },
        successFeedback:
          "Berhasil! Sekarang programmu bisa membaca data dari luar kodenya sendiri.",
      },
    },
    {
      id: "L11",
      slug: "with-membuka-file",
      title: "with: Menutup File Secara Otomatis",
      theory: {
        explanation: `Pada lesson sebelumnya kita harus ingat menulis .close(). Kalau lupa, file tetap terbuka, dan di program yang besar itu bisa menimbulkan masalah. Python punya cara yang lebih aman: kata kunci with.

Dengan with open("nama_file") as file:, file otomatis ditutup begitu blok yang menjorok di bawahnya selesai, bahkan jika di tengah blok terjadi error. Hasil bacaan yang disimpan ke variabel tetap bisa dipakai setelah blok selesai.

with sangat cocok dipadukan dengan fungsi dan return, seperti pada contoh di bawah.`,
        example: {
          description: "Membaca file dengan with di dalam sebuah fungsi.",
          code: `def baca_file(nama_file):
    with open(nama_file) as file:
        return file.read()

isi = baca_file("catatan.txt")
print(isi)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi fungsi baca_file di main.py. Fungsi ini menerima nama " +
          "file, membukanya dengan with open(...) as file:, lalu me-return " +
          "seluruh isinya dengan .read(). Fungsi main() sudah memanggilnya " +
          "dan mencetak hasilnya.",
        files: [
          {
            name: "main.py",
            content: `def baca_file(nama_file):
    # Buka file dengan with, lalu return isinya (gunakan .read())
    pass

def main():
    isi = baca_file("catatan.txt")
    print(isi)

main()
`,
          },
          {
            name: "catatan.txt",
            content: `Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
            editable: false,
          },
        ],
        hints: [
          "Mulai dengan with open(nama_file) as file: dan beri indentasi pada baris berikutnya.",
          "Di dalam blok with, tulis return file.read().",
        ],
        answerFiles: {
          "main.py": `def baca_file(nama_file):
    with open(nama_file) as file:
        return file.read()

def main():
    isi = baca_file("catatan.txt")
    print(isi)

main()`,
        },
        checker: {
          type: "stdout_exact",
          expected: `Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
          sourceRequirements: [
            {
              pattern: String.raw`with\s+open\s*\(`,
              message: "Outputnya sudah benar, tapi file belum dibuka dengan with open(...).",
              file: "main.py",
            },
          ],
        },
        successFeedback:
          "Bagus! Memakai with adalah kebiasaan terbaik saat bekerja dengan file " +
          "karena kamu tidak perlu mengingat .close() lagi.",
      },
    },
    {
      id: "L12",
      slug: "menulis-file",
      title: "Menulis File: Mode w dan a",
      theory: {
        explanation: `Selain membaca, program juga bisa menulis file. Caranya, beri argumen kedua pada open() yang menentukan mode:
- "r" (read): membaca file. Ini mode bawaan jika kamu tidak menuliskannya.
- "w" (write): menulis file. Jika file sudah ada, isinya dihapus dan diganti. Jika belum ada, file dibuat.
- "a" (append): menambahkan teks di akhir file tanpa menghapus isi lama.

Gunakan .write("teks") untuk menulis. Perintah ini tidak otomatis pindah baris, jadi akhiri teks dengan \\n (kode untuk baris baru) bila ingin baris berikutnya muncul di baris baru.

Catatan: di editor ini file yang kamu buat hanya ada selama programmu berjalan, tidak tersimpan permanen. Namun kalau kamu buat dikomputermu sendiri, file hasil tulisan akan benar-benar tersimpan.`,
        example: {
          description: "Menulis, menambah, lalu membaca kembali sebuah file.",
          code: `with open("laporan.txt", "w") as file:
    file.write("Laporan harian\\n")
    file.write("Status: selesai\\n")

with open("laporan.txt", "a") as file:
    file.write("Dicek oleh: Budi\\n")

with open("laporan.txt") as file:
    print(file.read())`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi program agar membuat file laporan.txt:\n" +
          '1. Dengan mode "w", tulis dua baris: "Laporan harian" lalu ' +
          '"Status: selesai". Akhiri tiap baris dengan \\n.\n' +
          '2. Dengan mode "a", tambahkan satu baris: "Dicek oleh: Budi" ' +
          "(juga diakhiri \\n).\n" +
          "Bagian yang membaca dan mencetak isi file sudah disediakan.",
        starterCode: `# 1. Tulis dua baris ke laporan.txt dengan mode "w"

# 2. Tambahkan satu baris ke laporan.txt dengan mode "a"

# Bagian ini sudah disediakan: membaca dan mencetak isi file
with open("laporan.txt") as file:
    print(file.read())
`,
        hints: [
          'Mulai dengan with open("laporan.txt", "w") as file: lalu panggil file.write(...) dua kali di dalamnya.',
          'Untuk menambah, buat blok baru: with open("laporan.txt", "a") as file: lalu file.write("Dicek oleh: Budi\\n").',
          "Jangan lupa \\n di akhir setiap teks supaya tiap kalimat ada di barisnya sendiri.",
        ],
        answerHint: `with open("laporan.txt", "w") as file:
    file.write("Laporan harian\\n")
    file.write("Status: selesai\\n")

with open("laporan.txt", "a") as file:
    file.write("Dicek oleh: Budi\\n")

with open("laporan.txt") as file:
    print(file.read())`,
        checker: {
          type: "stdout_exact",
          expected: `Laporan harian
Status: selesai
Dicek oleh: Budi`,
          sourceRequirements: [
            {
              pattern: String.raw`open\s*\([^)]*["']w["']`,
              message: 'Outputnya sudah benar, tapi belum ada file yang ditulis dengan mode "w".',
              file: "main.py",
            },
            {
              pattern: String.raw`open\s*\([^)]*["']a["']`,
              message: 'Outputnya sudah benar, tapi belum ada teks yang ditambahkan dengan mode "a".',
              file: "main.py",
            },
          ],
        },
        successFeedback:
          'Hebat! Kamu sudah bisa membuat file baru ("w") dan menambah isinya ("a"). ' +
          "Hati-hati: mode \"w\" menghapus isi lama.",
      },
    },
    {
      id: "L13",
      slug: "import-modul-bawaan",
      title: "import: Memakai Modul Bawaan Python",
      theory: {
        explanation: `Python datang dengan banyak modul, yaitu kumpulan fungsi siap pakai yang tidak perlu kamu tulis sendiri. Untuk memakainya, tulis import di bagian paling atas programmu.

Ada dua cara memakainya:
- import math: kamu memanggil fungsinya dengan awalan nama modul, misalnya math.sqrt(16).
- from math import sqrt: kamu mengambil satu fungsi saja dan bisa memanggilnya langsung, yaitu sqrt(16).

Modul math berisi fungsi matematika seperti sqrt() (akar kuadrat) dan nilai pi.`,
        example: {
          description: "Memakai modul math dengan dua cara import.",
          code: `import math

print(math.sqrt(16))   # Output: 4.0
print(math.pi)         # Output: 3.141592653589793

from math import sqrt

print(sqrt(25))        # Output: 5.0`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Hitung panjang sisi miring segitiga siku-siku.\n" +
          "1. Tambahkan import untuk modul math di bagian atas.\n" +
          "2. Lengkapi fungsi hitung_sisi_miring agar me-return akar " +
          "kuadrat dari a * a + b * b, memakai sqrt dari modul math.\n" +
          "Fungsi main() sudah memanggilnya dengan sisi 3 dan 4.",
        starterCode: `# Tambahkan import untuk modul math di sini

def hitung_sisi_miring(a, b):
    # return akar kuadrat dari (a * a + b * b) memakai sqrt
    return

def main():
    sisi_miring = hitung_sisi_miring(3, 4)
    print(f"Sisi miring: {sisi_miring}")

main()
`,
        hints: [
          "Tulis import math di baris paling atas.",
          "Di dalam fungsi, tulis return math.sqrt(a * a + b * b).",
        ],
        answerHint: `import math

def hitung_sisi_miring(a, b):
    return math.sqrt(a * a + b * b)

def main():
    sisi_miring = hitung_sisi_miring(3, 4)
    print(f"Sisi miring: {sisi_miring}")

main()`,
        checker: {
          type: "stdout_exact",
          expected: "Sisi miring: 5.0",
          sourceRequirements: [
            {
              pattern: String.raw`(?:import\s+math|from\s+math\s+import)`,
              message: "Outputnya sudah benar, tapi modul math belum di-import.",
              file: "main.py",
            },
            {
              pattern: String.raw`sqrt\s*\(`,
              message: "Outputnya sudah benar, tapi akar kuadrat belum dihitung dengan sqrt().",
              file: "main.py",
            },
          ],
        },
        successFeedback:
          "Tepat sekali! Dengan import, kamu bisa memakai ribuan fungsi yang " +
          "sudah ditulis orang lain tanpa menulis ulang dari awal.",
      },
    },
    {
      id: "L14",
      slug: "modul-buatan-sendiri",
      title: "Memisahkan Fungsi ke File Lain (Modul)",
      theory: {
        explanation: `Semakin besar sebuah program, semakin sulit semuanya ditulis dalam satu file. Programmer memecahnya ke beberapa file. Setiap file berakhiran .py adalah sebuah modul, dan modul buatanmu sendiri di-import dengan cara yang sama seperti modul bawaan.

Kebiasaan yang rapi: simpan fungsi-fungsimu di satu file (misalnya fungsi.py), dan simpan alur utama programmu (fungsi main()) di main.py.

Di editor, klik tab di atas untuk berpindah antar file. Kedua file harus ada di tab yang sama, karena Python mencari modul di folder yang sama.

Penting: yang dijalankan Python adalah main.py. File fungsi.py baru dipakai kalau main.py meng-import-nya.`,
        sections: [
          {
            heading: "fungsi.py",
            code: `def sapa(nama):
    return f"Halo, {nama}!"`,
          },
          {
            heading: "main.py",
            code: `from fungsi import sapa

def main():
    print(sapa("Budi"))

main()
# Output: Halo, Budi!`,
          },
          {
            text: "Kamu juga bisa menulis import fungsi lalu memanggilnya dengan fungsi.sapa(\"Budi\"). Keduanya sah; from ... import ... biasanya lebih ringkas.",
          },
        ],
      },
      practice: {
        kind: "code",
        instructions:
          "Pisahkan fungsi ke file lain:\n" +
          "1. Di fungsi.py, buat fungsi sapa(nama) yang me-return teks " +
          '"Halo, {nama}! Selamat datang." (pakai f-string).\n' +
          "2. Di main.py, import fungsi sapa dari fungsi.py. Fungsi main() " +
          'di main.py sudah memanggil sapa("Budi").',
        files: [
          {
            name: "main.py",
            content: `# Import fungsi sapa dari file fungsi.py

def main():
    print(sapa("Budi"))

main()
`,
          },
          {
            name: "fungsi.py",
            content: `# Tulis fungsi sapa(nama) di sini.
# Fungsi ini me-return teks "Halo, {nama}! Selamat datang."
`,
          },
        ],
        hints: [
          'Klik tab fungsi.py lalu tulis def sapa(nama): dengan return f"Halo, {nama}! Selamat datang.".',
          "Klik tab main.py lalu tulis from fungsi import sapa di baris paling atas.",
        ],
        answerFiles: {
          "main.py": `from fungsi import sapa

def main():
    print(sapa("Budi"))

main()`,
          "fungsi.py": `def sapa(nama):
    return f"Halo, {nama}! Selamat datang."`,
        },
        checker: {
          type: "stdout_exact",
          expected: "Halo, Budi! Selamat datang.",
          sourceRequirements: [
            {
              pattern: String.raw`(?:from\s+fungsi\s+import|import\s+fungsi)`,
              message: "Outputnya sudah benar, tapi main.py belum meng-import fungsi dari fungsi.py.",
              file: "main.py",
            },
            {
              pattern: String.raw`def\s+sapa\s*\(`,
              message: "Outputnya sudah benar, tapi fungsi sapa belum ditulis di fungsi.py.",
              file: "fungsi.py",
            },
          ],
        },
        successFeedback:
          "Luar biasa! Kamu baru saja memecah programmu menjadi beberapa file. " +
          "Inilah cara program-program besar disusun agar tetap rapi.",
      },
    },
    {
      id: "L15",
      slug: "gabungan-input-file-modul",
      title: "Gabungkan: Input, File, dan Modul",
      theory: {
        explanation: `Saatnya menggabungkan semua yang sudah kamu pelajari menjadi sebuah program kecil yang utuh, yaitu pembaca catatan:
1. fungsi.py menyimpan fungsi baca_file() yang membuka file dengan with dan me-return isinya.
2. main.py meminta nama file lewat input(), memanggil baca_file(), lalu mencetak isinya.

Kombinasi inilah yang dipakai program nyata: meminta data dari pengguna, membaca file, dan menyusun kode ke beberapa modul.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi dua file berikut. Jawaban pengguna (catatan.txt) sudah " +
          "ada di kotak Input program.\n" +
          "1. Di fungsi.py, buat fungsi baca_file(nama_file): buka file " +
          "dengan with open(...) as file: lalu return file.read().\n" +
          "2. Di main.py, import baca_file dari fungsi.py.\n" +
          '3. Di dalam main(), minta nama file dengan input("Nama file: ") ' +
          "dan simpan di variabel nama_file.\n" +
          "4. Masih di main(), panggil baca_file(nama_file) lalu cetak hasilnya.",
        files: [
          {
            name: "main.py",
            content: `# Import baca_file dari file fungsi.py

def main():
    # 1. Minta nama file dengan input("Nama file: ")
    # 2. Baca isinya dengan baca_file(), lalu cetak
    pass

main()
`,
          },
          {
            name: "fungsi.py",
            content: `# Tulis fungsi baca_file(nama_file) di sini.
# Buka file dengan with, lalu return isinya.
`,
          },
          {
            name: "catatan.txt",
            content: `Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
            editable: false,
          },
        ],
        stdin: ["catatan.txt"],
        hints: [
          "Di fungsi.py: def baca_file(nama_file): lalu di dalamnya with open(nama_file) as file: dan return file.read().",
          "Di main.py baris pertama: from fungsi import baca_file.",
          'Di main(): nama_file = input("Nama file: "), lalu isi = baca_file(nama_file), lalu print(isi).',
        ],
        answerFiles: {
          "main.py": `from fungsi import baca_file

def main():
    nama_file = input("Nama file: ")
    isi = baca_file(nama_file)
    print(isi)

main()`,
          "fungsi.py": `def baca_file(nama_file):
    with open(nama_file) as file:
        return file.read()`,
        },
        checker: {
          type: "stdout_exact",
          expected: `Nama file: catatan.txt
Belajar Python itu menyenangkan.
Setiap hari satu langkah kecil.`,
          sourceRequirements: [
            {
              pattern: String.raw`(?:from\s+fungsi\s+import|import\s+fungsi)`,
              message: "Outputnya sudah benar, tapi main.py belum meng-import dari fungsi.py.",
              file: "main.py",
            },
            {
              pattern: String.raw`input\s*\(`,
              message: "Outputnya sudah benar, tapi nama file belum diminta lewat input().",
              file: "main.py",
            },
            {
              pattern: String.raw`def\s+baca_file\s*\(`,
              message: "Outputnya sudah benar, tapi fungsi baca_file belum ditulis di fungsi.py.",
              file: "fungsi.py",
            },
            {
              pattern: String.raw`with\s+open\s*\(`,
              message: "Outputnya sudah benar, tapi file di fungsi.py belum dibuka dengan with open(...).",
              file: "fungsi.py",
            },
          ],
        },
        successFeedback:
          "Fantastis! Programmu sekarang meminta input, membaca file, dan " +
          "tersusun rapi dalam beberapa modul. Ini adalah fondasi dari " +
          "program-program nyata.",
      },
    },
    {
      id: "L16",
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
