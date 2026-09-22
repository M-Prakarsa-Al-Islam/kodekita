import type { ChapterContent } from "@/content/types";

export const chapter2: ChapterContent = {
  slug: "2-variabel",
  order: 2,
  title: "Variabel",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "menyimpan-nilai",
      title: "Menyimpan Nilai ke Variabel",
      theory: {
        explanation: `Variabel adalah cara menyimpan nilai supaya bisa dipakai lagi
nanti, tanpa menulis ulang nilainya. Menulis umur = 21 artinya kita
menyimpan angka 21 ke dalam variabel bernama umur.

Nama variabel di Python tidak boleh diawali angka, dan tidak boleh
mengandung spasi atau tanda minus — biasanya ditulis huruf kecil dengan
garis bawah, seperti nama_lengkap.`,
        example: {
          description: "Menyimpan dua nilai ke variabel.",
          code: `nama = "Sari"
umur = 21`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Manakah nama variabel yang valid dan sesuai kebiasaan penulisan di Python?",
        options: ["umur_saya", "1umur", "umur saya", "umur-saya"],
        correctIndex: 0,
        explanation:
          "Nama variabel di Python tidak boleh diawali angka atau mengandung " +
          "spasi/tanda minus. umur_saya adalah penulisan yang valid dan umum dipakai.",
      },
    },
    {
      id: "L2",
      slug: "f-string",
      title: "Menggabungkan Variabel ke dalam Teks (f-string)",
      theory: {
        explanation: `Kita bisa memasukkan nilai variabel ke dalam teks menggunakan
f-string: menulis huruf f sebelum tanda kutip, lalu menulis nama variabel
di dalam kurung kurawal {}. Ini lebih rapi daripada menggabungkan teks
dengan tanda +.`,
        example: {
          description: "Menampilkan variabel di dalam kalimat dengan f-string.",
          code: `nama = "Sari"
umur = 21

print(f"Halo, {nama}!")
print(f"Umur kamu {umur} tahun.")`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Sebuah persegi panjang punya panjang 8 dan lebar 5. Simpan kedua " +
          "angka itu ke variabel panjang dan lebar, hitung luasnya (panjang " +
          "dikali lebar), lalu tampilkan tepat seperti ini:\n\nLuas: 40",
        starterCode: `panjang = 8
lebar = 5

# Hitung luas, lalu print() dengan format "Luas: <hasil>"
`,
        hints: [
          "Luas persegi panjang = panjang dikali lebar.",
          'Gunakan f-string: print(f"Luas: {luas}")',
        ],
        checker: {
          type: "stdout_exact",
          expected: "Luas: 40",
        },
        successFeedback: "Tepat, 40. Variabel dan f-string kamu sudah benar.",
      },
    },
  ],
};
