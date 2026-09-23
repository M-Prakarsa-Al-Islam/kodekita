import type { ChapterContent } from "@/content/types";

export const chapter1: ChapterContent = {
  slug: "1-pengenalan",
  order: 1,
  title: "Pengenalan Python",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "selamat-datang",
      title: "Selamat Datang di Dunia Python!",
      theory: {
        explanation: `Python adalah bahasa pemrograman yang sangat populer dan mudah
dibaca, mirip dengan bahasa Inggris. Di platform ini, kamu tidak perlu
menginstal apa pun di komputermu. Kamu bisa langsung menulis dan
menjalankan kode Python langsung di dalam browser.`,
        example: {
          description: "Menjalankan kode Python pertama ke layar.",
          code: `print("Halo, Dunia!")
# Output: Halo, Dunia!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Mari kita mulai! Cukup jalankan (Run) kode di bawah ini untuk " +
          "melihat bagaimana Python mencetak teks ke layar. Jangan ubah kodenya.",
        starterCode: `print("Halo, Indonesia!")
`,
        hints: ["Ini adalah pemanasan! Cukup tekan tombol Run."],
        checker: {
          type: "stdout_exact",
          expected: "Halo, Indonesia!",
        },
        successFeedback: "Kamu baru saja menjalankan program Python pertamamu!",
      },
    },
    {
      id: "L2",
      slug: "mengeluarkan-teks",
      title: "Mengeluarkan Teks dengan print()",
      theory: {
        explanation: `Untuk menampilkan teks ke layar, kita menggunakan fungsi print().
Teks yang ingin ditampilkan harus selalu diapit oleh tanda petik ganda
("...") atau tanda petik tunggal ('...'). Teks di dalam tanda petik ini
disebut sebagai string.`,
        example: {
          description: "Mencetak teks menggunakan tanda petik.",
          code: `print("Saya sedang belajar Python")
# Output: Saya sedang belajar Python`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          'Gunakan fungsi print() untuk mencetak teks "Semangat belajar ' +
          'koding!" ke layar. Pastikan penggunaan spasi, huruf besar, ' +
          "kecil, dan tanda bacanya sama persis!",
        starterCode: `# Tulis kode print kamu di bawah baris ini

`,
        hints: [
          "Jangan lupa gunakan tanda petik di awal dan akhir kalimat.",
          "Perhatikan huruf kapital di awal kalimat dan tanda seru di akhir.",
        ],
        answerHint: `print("Semangat belajar koding!")`,
        checker: {
          type: "stdout_exact",
          expected: "Semangat belajar koding!",
        },
        successFeedback: "Mantap! Kamu sudah bisa memberikan perintah kepada komputer.",
      },
    },
    {
      id: "L3",
      slug: "angka-dan-teks",
      title: "Mengenal Angka dan Teks",
      theory: {
        explanation: `Di dalam Python, teks dan angka dikelola secara berbeda. Teks
(string) harus menggunakan tanda petik (contoh: "100"), sedangkan angka
tidak boleh menggunakan tanda petik (contoh: 100). Jika kamu memasukkan
operasi matematika dasar seperti + ke dalam print() tanpa tanda petik,
Python akan bertindak seperti kalkulator dan langsung menghitung
hasilnya.`,
        example: {
          description: "Menghitung penjumlahan angka langsung di dalam print.",
          code: `print(5 + 3)
# Output: 8`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi kode di dalam print() untuk menghitung hasil dari " +
          'penjumlahan 15 dan 25. Ingat, jangan tulis teks "40", biarkan ' +
          "Python yang menghitung angka tersebut untukmu!",
        starterCode: `# Hitung hasil 15 ditambah 25
print( )
`,
        hints: [
          "Tulis angka dan lambang tambah + di dalam kurung.",
          "Jangan gunakan tanda petik karena kita sedang melakukan operasi matematika.",
        ],
        answerHint: `print(15 + 25)`,
        checker: {
          type: "stdout_exact",
          expected: "40",
        },
        successFeedback: "Bagus sekali! Python adalah kalkulator yang sangat cerdas.",
      },
    },
    {
      id: "L4",
      slug: "beberapa-baris-kode",
      title: "Menggabungkan Beberapa Baris Kode",
      theory: {
        explanation: `Program komputer dieksekusi secara berurutan dari baris paling
atas menuju baris paling bawah. Setiap kali kamu memanggil perintah
print(), Python akan secara otomatis mencetak hasilnya di baris teks
yang baru.`,
        example: {
          description: "Mencetak dua baris teks secara berurutan.",
          code: `print("Satu")
print("Dua")
# Output:
# Satu
# Dua`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buatlah dua baris kode menggunakan print(). Baris pertama harus " +
          'mencetak teks "Nama: Budi" dan baris kedua harus mencetak teks ' +
          '"Hobi: Koding".',
        starterCode: `# Cetak nama dan hobi di bawah

`,
        hints: [
          "Kamu membutuhkan dua buah pemanggilan fungsi print() di baris yang berbeda.",
          "Pastikan kedua teks tersebut diapit oleh tanda petik.",
        ],
        answerHint: `print("Nama: Budi")
print("Hobi: Koding")`,
        checker: {
          type: "stdout_exact",
          expected: "Nama: Budi\nHobi: Koding",
        },
        successFeedback:
          "Hebat! Kamu sudah paham bagaimana Python menjalankan alur program baris demi baris.",
      },
    },
    {
      id: "L5",
      slug: "tantangan-chapter-1",
      title: "Tantangan Chapter 1",
      theory: {
        explanation: `Kamu telah mempelajari dasar utama pemrograman Python:
menjalankan kode, mencetak teks (string), membedakannya dengan operasi
angka, dan memahami alur penulisan kode dari atas ke bawah. Saatnya
menguji pemahamanmu secara menyeluruh!`,
      },
      practice: {
        kind: "code",
        instructions:
          "Buat program yang mencetak 3 baris informasi ke layar secara " +
          'berurutan:\nBaris pertama mencetak teks "Modul: Python Dasar"\n' +
          'Baris kedua mencetak teks "Chapter: 1"\nBaris ketiga mencetak ' +
          "hasil matematika dari 2000 + 24 (gunakan perhitungan angka, bukan teks).",
        starterCode: `# Selesaikan tantangan di bawah ini

`,
        hints: [
          "Kamu butuh tiga buah fungsi print().",
          "Baris pertama dan kedua adalah teks (membutuhkan tanda petik).",
          "Baris ketiga adalah operasi matematika (jangan berikan tanda petik pada angkanya).",
        ],
        answerHint: `print("Modul: Python Dasar")
print("Chapter: 1")
print(2000 + 24)`,
        checker: {
          type: "stdout_exact",
          expected: "Modul: Python Dasar\nChapter: 1\n2024",
        },
        successFeedback:
          "Luar biasa! Kamu telah menyelesaikan Chapter 1 dengan sempurna. Lanjut ke Chapter berikutnya yuk!",
      },
    },
  ],
};
