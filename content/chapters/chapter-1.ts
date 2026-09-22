import type { ChapterContent } from "@/content/types";

export const chapter1: ChapterContent = {
  slug: "1-pengenalan",
  order: 1,
  title: "Pengenalan",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "selamat-datang",
      title: "Selamat Datang di Kelas Python Dasar!",
      theory: {
        explanation: `Programming adalah cara memberi instruksi ke komputer, langkah
demi langkah, agar komputer melakukan sesuatu yang kita mau. Python adalah
salah satu bahasa programming yang paling banyak dipakai — untuk website,
analisis data, otomasi, sampai AI — karena sintaksnya dekat dengan bahasa
manusia, jadi lebih mudah dibaca dan dipelajari dibanding banyak bahasa lain.

Di kelas ini kamu akan langsung menulis dan menjalankan kode sendiri, bukan
cuma membaca teori.`,
        example: {
          description: "Begini kira-kira tampilan satu baris program Python:",
          code: `print("Halo, dunia!")`,
        },
      },
      practice: {
        kind: "quiz",
        question: "Kenapa Python banyak dipakai, baik oleh pemula maupun profesional?",
        options: [
          "Karena sintaksnya dekat dengan bahasa manusia sehingga mudah dibaca",
          "Karena hanya bisa dipakai untuk membuat game",
          "Karena Python tidak bisa dijalankan di komputer biasa",
          "Karena Python adalah nama sebuah merek komputer",
        ],
        correctIndex: 0,
        explanation:
          "Betul. Python dirancang agar sintaksnya mudah dibaca, mirip bahasa " +
          "manusia, sehingga cocok untuk pemula maupun dipakai secara " +
          "profesional untuk website, data, otomasi, dan AI.",
      },
    },
    {
      id: "L2",
      slug: "program-pertama",
      title: "Menjalankan Program Python Pertamamu",
      theory: {
        explanation: `Fungsi print() adalah cara paling dasar untuk menampilkan teks
ke layar. Setiap kali kamu memanggil print(), Python menampilkan isinya lalu
pindah ke baris baru — jadi kalau kamu menulis dua print(), hasilnya dua
baris terpisah.

Program Python dijalankan baris demi baris, dari atas ke bawah.`,
        example: {
          description: "Dua print() menghasilkan dua baris output.",
          code: `print("Halo, dunia!")
print("Ini baris kedua.")`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buat program yang menampilkan dua baris ini, berurutan dari atas ke bawah:\n\nHalo, dunia!\nSaya baru belajar Python.",
        starterCode: `# Tulis dua print() di bawah ini
`,
        hints: [
          "Setiap print() menampilkan satu baris. Kamu butuh dua baris print().",
          'Contoh: print("teks di sini")',
        ],
        checker: {
          type: "stdout_exact",
          expected: "Halo, dunia!\nSaya baru belajar Python.",
        },
        successFeedback:
          "Program kamu berjalan dan outputnya sudah tepat. Lanjut ke Chapter 2.",
      },
    },
  ],
};
