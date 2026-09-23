import type { ChapterContent } from "@/content/types";

export const chapter5: ChapterContent = {
  slug: "5-testing-debugging",
  order: 5,
  title: "Testing dan Debugging",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "apa-itu-bug-dan-debugging",
      title: "Apa Itu Bug dan Debugging?",
      theory: {
        explanation: `Dalam dunia pemrograman, masalah atau kesalahan pada program
yang menyebabkan program tidak bekerja sesuai dengan yang diharapkan
disebut sebagai Bug. Hampir tidak ada programmer yang bisa menulis
kode dengan sempurna pada percobaan pertama. Menemukan dan memperbaiki
bug adalah rutinitas sehari-hari, dan proses pencarian masalah ini
disebut Debugging.

Bug dapat muncul dalam berbagai bentuk. Misalnya, kesalahan penulisan
sintaks, penggunaan variabel yang tidak sesuai, kesalahan dalam logika
program, hingga program yang menghasilkan keluaran yang berbeda dari
yang diharapkan. Tidak semua bug langsung menyebabkan program berhenti
atau menampilkan pesan error. Ada juga bug yang membuat program tetap
berjalan, tetapi menghasilkan perilaku atau hasil yang salah.

Mendapatkan pesan error berwarna merah bukanlah tanda bahwa kamu
gagal, melainkan cara komputer berkomunikasi untuk memberitahu bagian
mana yang perlu diperbaiki.`,
      },
      practice: {
        kind: "quiz",
        question: "Apa yang dimaksud dengan proses debugging dalam pemrograman?",
        options: [
          "Menghapus seluruh kode dan menulis ulang dari awal.",
          "Menggunakan program pihak ketiga untuk menulis kode secara otomatis.",
          "Proses mencari dan memperbaiki kesalahan (bug) di dalam kode.",
          "Proses mengubah teks bahasa Inggris menjadi bahasa mesin.",
        ],
        correctIndex: 2,
        explanation:
          "Debugging adalah aktivitas utama programmer untuk melacak dan " +
          "membasmi error agar program berjalan sesuai harapan.",
      },
    },
    {
      id: "L2",
      slug: "syntax-error",
      title: "Jangan Takut Pesan Error (Syntax Error)",
      theory: {
        explanation: `Jenis bug yang paling sering ditemui pemula adalah Syntax
Error (kesalahan sintaks/tata bahasa). Ini terjadi karena ada salah
ketik, tanda petik yang lupa ditutup, atau tanda kurung yang hilang.

Saat ini terjadi, Python akan berhenti bekerja dan memberikan pesan
error. Jangan panik! Biasakan membaca pesannya, karena Python biasanya
memberi tahu di baris mana kesalahan itu terjadi.`,
        example: {
          description: "Kode dengan Syntax Error karena tidak ada tanda petik di akhir teksnya.",
          code: `# Jika dijalankan, baris di bawah akan menghasilkan SyntaxError
print("Halo Dunia!) # Output: SyntaxError: unterminated string literal`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Pada starter code, program ini seharusnya mencetak dua baris " +
          "kalimat. Namun, kodenya rusak dan akan menghasilkan " +
          "SyntaxError jika kamu mencoba menjalankannya. Bertindaklah " +
          "sebagai debugger: temukan tanda baca yang kurang di baris " +
          "pertama dan kedua, lalu perbaiki!",
        starterCode: `print("Program dimulai!)
    print(Sistem berjalan lancar.")
`,
        hints: [
          'Periksa tanda petik ganda (") di akhir baris pertama.',
          'Periksa indentasi dan tanda petik ganda (") di awal teks baris kedua.',
        ],
        answerHint: `print("Program dimulai!")
print("Sistem berjalan lancar.")`,
        checker: {
          type: "stdout_exact",
          expected: "Program dimulai!\nSistem berjalan lancar.",
        },
        successFeedback:
          "Hebat! Memperbaiki Syntax Error adalah langkah pertama menjadi programmer yang tangguh.",
      },
    },
    {
      id: "L3",
      slug: "jalankan-vs-periksa-jawaban",
      title: 'Menggunakan Tombol "Jalankan" vs "Periksa Jawaban"',
      theory: {
        explanation: `Di platform ini, kamu memiliki dua tombol utama. Sangat
penting untuk memahami perbedaannya:

Jalankan (Run): Ini adalah area bermain dan alat debugging utamamu.
Saat kamu menekan Jalankan, platform hanya akan mengeksekusi kodemu.
Kamu bisa menambahkan perintah print() sebanyak mungkin untuk melihat
nilai variabel dan menguji kodemu secara bebas.
Periksa Jawaban (Submit/Test): Ini ibarat merilis aplikasimu ke dunia
nyata (production). Tombol ini akan menjalankan sistem auto-grader
kami untuk menilai apakah kodemu memenuhi semua syarat (mencetak
output yang tepat).

Biasakan untuk menggunakan tombol Jalankan berulang kali selama proses
menulis kode, dan hanya klik Periksa Jawaban ketika kamu yakin hasil
akhirnya sudah benar.`,
      },
      practice: {
        kind: "quiz",
        question: 'Kapan waktu yang paling tepat untuk menggunakan tombol "Jalankan"?',
        options: [
          "Hanya di akhir ketika kode sudah selesai 100%.",
          "Saat saya ingin melihat kunci jawaban.",
          "Berkali-kali selama proses menulis kode untuk bereksperimen, menguji print(), dan menemukan bug.",
          "Ketika saya ingin merilis kode ke production.",
        ],
        correctIndex: 2,
        explanation:
          'Tombol "Jalankan" adalah kotak pasirmu (sandbox). Gunakan ' +
          "sesering mungkin saat coding untuk melihat apa yang sedang terjadi di balik layar.",
      },
    },
    {
      id: "L4",
      slug: "logical-error",
      title: "Kesalahan Terselubung (Logical Error)",
      theory: {
        explanation: `Jenis cacat kedua adalah Logical Error (kesalahan logika). Ini
jauh lebih berbahaya karena program tidak akan memunculkan pesan error
merah sama sekali. Program berjalan lancar dari awal sampai akhir,
tetapi hasil perhitungannya salah! Ini biasanya terjadi karena kita
salah menggunakan rumus matematika atau keliru memanggil nama
variabel.`,
        example: {
          description: "Kode yang berjalan mulus tetapi menghasilkan logika yang salah.",
          code: `uang = 100000
belanja = 75000
sisa = belanja - uang

print("Sisa uang:", sisa)
# Output: Sisa uang: -25000

# Tidak ada error, tetapi logikanya salah. Seharusnya:
sisa = uang - belanja`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di editor, fungsi hitung_luas_persegi(sisi) seharusnya " +
          "mengembalikan luas (sisi dikali sisi). Tetapi, programmer " +
          "sebelumnya mendapatkan hasil yang tidak sesuai. Perbaiki lalu jalankan!",
        starterCode: `def hitung_luas_persegi(sisi):
    return sisi + sisi

# Jangan ubah kode di bawah ini
luas = hitung_luas_persegi(10)
print(luas)
`,
        hints: [
          "Ganti operator + menjadi operator perkalian.",
          "Di Python, perkalian menggunakan simbol bintang *.",
        ],
        answerHint: `def hitung_luas_persegi(sisi):
    return sisi * sisi

luas = hitung_luas_persegi(10)
print(luas)`,
        checker: {
          type: "stdout_exact",
          expected: "100",
        },
        successFeedback:
          "Tepat sekali! Selalu periksa kembali rumus matematikamu untuk menghindari Logical Error.",
      },
    },
    {
      id: "L5",
      slug: "proses-memecahkan-masalah",
      title: "Proses Memecahkan Masalah Koding yang Sulit",
      theory: {
        explanation: `Saat menghadapi tantangan koding yang terasa sulit, programmer
profesional menggunakan proses sistematis berikut:

1. Baca materinya terlebih dahulu! Pahami contoh-contoh kode yang
diberikan sebelum mulai menulis kodemu sendiri.
2. Baca instruksi tugasnya. Pahami apa tujuan akhir dari tugas
tersebut sebelum mengetik apa pun.
3. Mulai menulis kode secara bertahap.
4. Tambahkan perintah print(). Jangan menunggu sampai kamu menulis
banyak baris kode baru mulai menguji. Tambahkan perintah print() dan
gunakan tombol Jalankan untuk melihat apakah kodemu berjalan sesuai
harapan di setiap langkahnya. Mencari masalah di 2 baris kode jauh
lebih mudah daripada di 20 baris kode!
5. Terus jalankan, cetak, dan perbaiki sampai kamu yakin kodemu
berfungsi dengan baik.`,
      },
      practice: {
        kind: "quiz",
        question:
          "Berdasarkan proses di atas, manakah kebiasaan yang paling " +
          "dihindari oleh programmer saat memecahkan masalah koding?",
        options: [
          "Membaca instruksi sampai selesai sebelum menulis kode.",
          "Menulis seluruh kode sekaligus dari awal hingga akhir, lalu baru mengujinya (Jalankan) di akhir.",
          "Menambahkan perintah print() di tengah-tengah fungsi untuk mengintip nilai variabel.",
          "Menjalankan kode sedikit demi sedikit setiap kali selesai menulis beberapa baris.",
        ],
        correctIndex: 1,
        explanation:
          "Menulis ratusan baris kode tanpa pernah mengujinya adalah " +
          "mimpi buruk. Jika terjadi error, kamu akan sangat kesulitan " +
          "mencari tahu di baris mana bug tersebut bersembunyi.",
      },
    },
    {
      id: "L6",
      slug: "print-debugging",
      title: "Teknik Debugging Andalan (Print Debugging)",
      theory: {
        explanation: `Menyambung pelajaran sebelumnya, bagaimana cara menerapkan
langkah ke-4 (menambahkan print())? Teknik ini disebut Print
Debugging.

Daripada menebak-nebak di mana logical error terjadi, sisipkan
perintah print() di tengah-tengah fungsi (sebelum return). Dengan
menekan tombol Jalankan, kamu bisa "mengintip" nilai sementara dari
sebuah variabel dan melihat di langkah mana perhitungan mulai kacau.
Setelah kodemu benar, barulah klik Periksa Jawaban.`,
        example: {
          description: "Menggunakan print debugging untuk mengintip nilai.",
          code: `def proses_gaji(pokok, bonus):
    total = pokok + bonus
    print(f"DEBUG: nilai sementara = {total}") # Mengintip nilai
    # Output saat di-Jalankan: DEBUG: nilai sementara = 5500
    return total`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Fungsi kalkulasi_stok() di bawah melakukan perhitungan " +
          "matematis. Sebelum fungsi tersebut melakukan return, " +
          "tambahkan sebuah perintah print() yang mencetak variabel " +
          "stok_sementara. Gunakan tombol Jalankan untuk melihat " +
          "bagaimana print() membantumu mengintip proses yang terjadi di balik layar.",
        starterCode: `def kalkulasi_stok(awal, terjual):
    stok_sementara = awal - terjual
    # Tambahkan perintah print(stok_sementara) di bawah ini

    return stok_sementara

hasil = kalkulasi_stok(100, 20)
`,
        hints: [
          "Letakkan print(stok_sementara) tepat di bawah variabelnya dan di atas baris return.",
          "Pastikan indentasi/spasinya sama rata dengan baris di sekitarnya.",
        ],
        answerHint: `def kalkulasi_stok(awal, terjual):
    stok_sementara = awal - terjual
    print(stok_sementara)
    return stok_sementara

hasil = kalkulasi_stok(100, 20)`,
        checker: {
          type: "stdout_exact",
          expected: "80",
        },
        successFeedback:
          "Pintar! Kamu sekarang tahu cara \"mengintip\" ke dalam fungsi. " +
          "Jangan lupa hapus (atau jadikan #komentar) print " +
          "debugging-mu saat kode sudah siap dipakai secara nyata.",
      },
    },
    {
      id: "L7",
      slug: "tantangan-chapter-5",
      title: "Tantangan Chapter 5",
      theory: {
        explanation: `Saatnya menguji kemampuan detektifmu! Kamu mengambil alih
kode dari programmer yang ceroboh. Program ini seharusnya menjumlahkan
dua harga barang dan mengurangi hasilnya dengan sebuah diskon.
Sayangnya, kodenya penuh bug.

Ingat proses penyelesaian masalah kita: perbaiki sedikit demi
sedikit, tambahkan print() bila perlu, dan sering-sering gunakan
tombol Jalankan!`,
      },
      practice: {
        kind: "code",
        instructions:
          "Perbaiki starter code berikut agar bisa berjalan dan " +
          "menghasilkan hasil yang benar yaitu 70000. Perbaiki semua " +
          "bug tersebut hingga outputnya tercetak sempurna!",
        starterCode: `def hitung_belanja(barang1, barang2, diskon)
    total = barang1 - barang2
   harga_akhir = total / diskon
    return harga_akhir

def main():
    hasil = hitung_belanja(50000, 30000  10000)
      print(hasil)

main()
`,
        hints: [
          "Sebuah fungsi harus diakhiri dengan :.",
          "Jika sebuah fungsi menerima lebih dari satu argumen, gunakan tanda koma (,) untuk memisahkan setiap argumen.",
          "Cek logika total dan harga_akhir di fungsi hitung_belanja.",
        ],
        answerHint: `def hitung_belanja(barang1, barang2, diskon):
    total = barang1 + barang2
    harga_akhir = total - diskon
    return harga_akhir

def main():
    hasil = hitung_belanja(50000, 30000, 10000)
    print(hasil)

main()`,
        checker: {
          type: "stdout_exact",
          expected: "70000",
        },
        successFeedback:
          "Selamat! Kamu telah berhasil memecahkan dan memperbaiki kode " +
          "yang rusak secara sistematis. Kemampuan ini adalah aset " +
          "terbesarmu sebagai seorang programmer!",
      },
    },
  ],
};
