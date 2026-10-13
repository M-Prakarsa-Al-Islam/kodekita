import type { ChapterContent } from "@/content/types";

export const chapter13: ChapterContent = {
  slug: "13-type-hints",
  order: 13,
  title: "Type Hints",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "pengenalan-type-hints",
      title: "Pengenalan Type Hints",
      theory: {
        explanation: `Secara bawaan (default), Python adalah bahasa pemrograman yang bertipe dinamis (Dynamic Typing). Artinya, kamu bisa membuat variabel dengan isi angka, lalu di baris berikutnya mengubah isinya menjadi teks tanpa masalah.

Namun, di dunia industri nyata, hal ini sering membuat programmer lain kesusahan membaca kode programnya dikarenakan seiring waktu program yang dibuat akan bertambah besar, yang mengakibatkan kodenya lebih susah untuk dibaca. Untuk mengatasinya, Python memiliki fitur Type Hints (Anotasi Tipe Data). Ini adalah "label" atau dokumentasi opsional yang disematkan pada variabel untuk memberi tahu programmer lain dan editor kodemu (IDE) tentang tipe data apa yang seharusnya masuk ke variabel tersebut.`,
        example: {
          description: "Menambahkan Type Hints pada variabel menggunakan titik dua (:).",
          code: `# Penulisan variabel biasa
umur = 25
nama = "Andi"

# Penulisan dengan Type Hints (Sangat disarankan untuk Clean Code)
umur: int = 25
nama: str = "Andi"
is_aktif: bool = True`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Apa yang akan terjadi jika kamu menjalankan kode di bawah ini di " +
          "Python? (Perhatikan bahwa nilai yang dimasukkan adalah teks " +
          "string, padahal labelnya int).",
        codeSnippet: `harga: int = "Sepuluh"`,
        options: [
          "Program akan langsung crash dengan pesan TypeError.",
          "Program akan langsung crash dengan pesan SyntaxError.",
          "Program berjalan normal (Type Hint hanyalah label dokumentasi, tidak memicu error secara otomatis saat program dijalankan).",
          'Teks "Sepuluh" akan otomatis diubah menjadi angka 10 oleh Python.',
        ],
        correctIndex: 2,
        explanation:
          "Type Hints tidak memaksa (enforce) aturan tipe data saat program " +
          'berjalan. Mereka murni bertindak sebagai "catatan" atau label ' +
          "bantuan. Untuk memunculkan error dari Type Hints, programmer " +
          "biasanya menggunakan alat pemeriksa tambahan di luar Python " +
          "seperti mypy.",
      },
    },
    {
      id: "L2",
      slug: "type-hints-pada-fungsi",
      title: "Type Hints pada Fungsi",
      theory: {
        explanation: `Manfaat terbesar Type Hints adalah saat digunakan di dalam Fungsi. Kamu bisa memberikan label pada parameter input, dan juga pada nilai kembalian (Return) dari fungsi tersebut.

Untuk melabeli parameter, gunakan titik dua :. Untuk melabeli nilai kembalian, gunakan tanda panah -> sebelum titik dua pembuka fungsi.`,
        example: {
          description:
            "Menulis Type Hints untuk parameter dan return value fungsi.",
          code: `# Fungsi ini menerima teks (str) dan mengembalikan teks (str)
def sapa_user(nama: str) -> str:
    return f"Halo, {nama}!"

# Fungsi ini menerima dua bilangan bulat (int) dan mengembalikan boolean (bool)
def cek_kelulusan(nilai: int, kkm: int) -> bool:
    return nilai >= kkm`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini terdapat fungsi hitung_diskon yang belum memiliki " +
          "label tipe data.\n" +
          "Lengkapi fungsi tersebut dengan aturan Type Hints berikut:\n" +
          "1. Parameter harga harus dilabeli sebagai int.\n" +
          "2. Parameter persen harus dilabeli sebagai int.\n" +
          "3. Nilai kembalian fungsi (return) harus dilabeli sebagai angka desimal float.",
        starterCode: `# Tambahkan anotasi tipe data pada baris 'def' di bawah ini
def hitung_diskon(harga, persen):
    diskon = harga * (persen / 100)
    return harga - diskon

# Jangan ubah baris cetak ini
print(hitung_diskon(100000, 20))
`,
        hints: [
          "Ubah bagian parameter menjadi (harga: int, persen: int).",
          "Tambahkan tanda panah sebelum titik dua di akhir baris definisi fungsi: -> float:.",
        ],
        answerHint: `def hitung_diskon(harga: int, persen: int) -> float:
    diskon = harga * (persen / 100)
    return harga - diskon

print(hitung_diskon(100000, 20))`,
        checker: {
          type: "stdout_exact",
          expected: "80000.0",
          sourceRequirements: [
            {
              pattern: String.raw`def\s+hitung_diskon\s*\([^)]*\bharga\s*:\s*int\b`,
              message: "Outputnya sudah benar, tapi parameter harga belum dilabeli int.",
            },
            {
              pattern: String.raw`def\s+hitung_diskon\s*\([^)]*\bpersen\s*:\s*int\b`,
              message: "Outputnya sudah benar, tapi parameter persen belum dilabeli int.",
            },
            {
              pattern: String.raw`def\s+hitung_diskon\s*\([^)]*\)\s*->\s*float\s*:`,
              message:
                "Outputnya sudah benar, tapi nilai kembalian fungsi belum dilabeli float (gunakan tanda panah ->).",
            },
          ],
        },
        successFeedback:
          "Kerja bagus! Dengan menuliskan -> float, kolega kerjamu yang " +
          "menggunakan fungsi ini akan langsung tahu bahwa mereka akan " +
          "mendapatkan nilai desimal tanpa perlu membaca isi rumus " +
          "matematikamu di dalam fungsi.",
      },
    },
    {
      id: "L3",
      slug: "type-hints-struktur-data",
      title: "Type Hints untuk Struktur Data",
      theory: {
        explanation: `Bagaimana cara melabeli struktur data yang memiliki isi di dalamnya, seperti List atau Dictionary? Di Python modern (versi 3.9 ke atas), kamu bisa menggunakan kurung siku [] tepat di sebelah nama tipe datanya untuk merinci isi struktur data tersebut.

Contoh penulisan:
- list[str] : List yang berisi sekumpulan teks string.
- set[int] : Set yang berisi sekumpulan angka integer.
- dict[str, int] : Dictionary dengan key berupa teks (str) dan value berupa angka (int).`,
        example: {
          description: "Menulis Type Hints pada List dan Dictionary.",
          code: `# Parameter berupa List berisi int, dan mengembalikan int
def hitung_total(keranjang: list[int]) -> int:
    total = 0
    for harga in keranjang:
        total += harga
    return total

# Parameter berupa Dictionary (Key: teks, Value: angka)
def cetak_rapor(nilai_siswa: dict[str, int]) -> str:
    return f"Data diterima untuk {len(nilai_siswa)} siswa."`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Lengkapi Type Hints pada fungsi gabung_nama di bawah ini.\n" +
          "Fungsi ini menerima parameter daftar_nama yang merupakan sebuah " +
          "List berisi sekumpulan string. Fungsi ini kemudian mengembalikan " +
          "sebuah string tunggal hasil penggabungan kata.\n" +
          "Berikan label list[str] pada parameter, dan label str pada " +
          "return value-nya.",
        starterCode: `# Berikan Type Hints pada baris definisi fungsi di bawah ini
def gabung_nama(daftar_nama):
    return " & ".join(daftar_nama)

print(gabung_nama(["Andi", "Budi", "Citra"]))
`,
        hints: [
          "Ubah nama parameter menjadi daftar_nama: list[str].",
          "Tambahkan -> str sebelum titik dua di akhir definisi fungsi.",
        ],
        answerHint: `def gabung_nama(daftar_nama: list[str]) -> str:
    return " & ".join(daftar_nama)

print(gabung_nama(["Andi", "Budi", "Citra"]))`,
        checker: {
          type: "stdout_exact",
          expected: "Andi & Budi & Citra",
          sourceRequirements: [
            {
              pattern: String.raw`def\s+gabung_nama\s*\([^)]*\bdaftar_nama\s*:\s*list\[\s*str\s*\]`,
              message:
                "Outputnya sudah benar, tapi parameter daftar_nama belum dilabeli list[str].",
            },
            {
              pattern: String.raw`def\s+gabung_nama\s*\([^)]*\)\s*->\s*str\s*:`,
              message:
                "Outputnya sudah benar, tapi nilai kembalian fungsi belum dilabeli str (gunakan tanda panah ->).",
            },
          ],
        },
        successFeedback:
          "Hebat! Penulisan list[str] sangat membantu IDE (seperti VS Code " +
          "atau PyCharm) untuk memunculkan rekomendasi fitur secara otomatis " +
          "saat kamu mengetikkan kode (auto-complete).",
      },
    },
    {
      id: "L4",
      slug: "tipe-data-ganda-union",
      title: "Tipe Data Ganda (Union Type)",
      theory: {
        explanation: `Terkadang, sebuah parameter atau variabel bisa menerima lebih dari satu jenis tipe data. Misalnya, fungsi kalkulator matematikamu mampu memproses baik itu bilangan bulat (int) maupun desimal (float).

Untuk situasi ini, kamu bisa menggunakan simbol garis vertikal | (dibaca "atau") yang merepresentasikan Union Type (Gabungan).`,
        example: {
          description: "Menggunakan simbol | untuk menerima dua jenis tipe data.",
          code: `# Parameter sisi bisa berupa int atau float
def hitung_luas_persegi(sisi: int | float) -> int | float:
    return sisi * sisi

# Fungsi di atas sah menerima angka 5 (int) maupun 5.5 (float)`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Di sebuah dokumentasi kode Python milik seniormu, kamu melihat " +
          'sebuah fungsi dengan definisi "def proses_data(id_user: int | str) -> bool:". ' +
          "Apa arti dari baris tersebut?",
        options: [
          "Fungsi tersebut menerima List yang berisi gabungan angka dan teks, lalu mengembalikan nilai boolean.",
          "Fungsi tersebut menerima parameter id_user yang bisa berupa integer ATAU string, dan mengembalikan nilai boolean.",
          "Fungsi tersebut akan mengubah paksa integer menjadi string.",
          "Fungsi tersebut mengembalikan boolean atau string, tergantung inputnya.",
        ],
        correctIndex: 1,
        explanation:
          "Simbol | menandakan Union (atau). Penulisan int | str pada bagian " +
          "parameter berarti id_user sah diisi menggunakan bilangan bulat " +
          "maupun teks. Simbol panah -> bool menandakan keluaran pastinya " +
          "adalah boolean.",
      },
    },
    {
      id: "L5",
      slug: "memperbaiki-type-hint",
      title: "Memperbaiki Type Hint yang Tidak Sesuai",
      theory: {
        explanation: `Ketika kamu menulis Type Hint, IDE (editor kode seperti VS Code atau PyCharm) akan terus memantau apakah data yang mengalir sesuai dengan "janji" label yang kamu buat.

Jika kamu melabeli nilai kembalian fungsi sebagai int, tetapi kodemu justru mengembalikan float (misalnya karena operasi pembagian tunggal /) atau mengembalikan tipe data lain, editor akan memberikan peringatan berupa garis bawah pada kodemu. Untuk memperbaikinya, kamu harus memastikan anotasi Type Hint selalu selaras dengan realitas tipe data yang sebenarnya dihasilkan.`,
        example: {
          description: "Memperbaiki konflik antara Type Hint dan realitas hasil kode.",
          code: `# SALAH: Editor akan protes karena a / b selalu menghasilkan float, bukan int.
def bagi_angka(a: int, b: int) -> int:
    return a / b

# BENAR: Label disesuaikan dengan realitas hasilnya.
def bagi_angka(a: int, b: int) -> float:
    return a / b`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Terdapat fungsi filter_genap di bawah ini yang bertugas menyaring " +
          "angka genap. IDE memunculkan peringatan karena return type hint " +
          "pada fungsi tersebut salah (tertulis -> int).\n" +
          "Perbaiki return type hint tersebut menjadi tipe data yang benar, " +
          "yaitu sebuah List yang berisi sekumpulan bilangan bulat, lalu " +
          "jalankan kodenya.",
        starterCode: `# Perbaiki anotasi tipe kembalian (setelah tanda panah) di bawah ini
def filter_genap(daftar_angka: list[int]) -> int:
    hasil = []
    for angka in daftar_angka:
        if angka % 2 == 0:
            hasil.append(angka)
    return hasil

# Jangan ubah baris cetak ini
print(filter_genap([1, 2, 3, 4, 5]))
`,
        hints: [
          "Perhatikan variabel hasil yang dikembalikan oleh fungsi melalui return. Variabel tersebut diinisialisasi sebagai kurung siku [] yang menandakan ia adalah sebuah List.",
          "Karena ia adalah List yang menampung bilangan bulat, ubah anotasi -> int: menjadi -> list[int]: agar selaras dengan data yang dikembalikan.",
        ],
        answerHint: `def filter_genap(daftar_angka: list[int]) -> list[int]:
    hasil = []
    for angka in daftar_angka:
        if angka % 2 == 0:
            hasil.append(angka)
    return hasil

print(filter_genap([1, 2, 3, 4, 5]))`,
        checker: {
          type: "stdout_exact",
          expected: "[2, 4]",
          sourceRequirements: [
            {
              pattern: String.raw`def\s+filter_genap\s*\([^)]*\)\s*->\s*list\[\s*int\s*\]\s*:`,
              message:
                "Outputnya sudah benar, tapi return type hint belum diperbaiki menjadi List berisi bilangan bulat.",
            },
          ],
        },
        successFeedback:
          "Tepat sekali! Menyelaraskan Type Hint dengan proses logika di " +
          "dalam fungsi sangatlah krusial. Jika kamu memberikan label yang " +
          "salah, fitur bantu editor kode justru akan memunculkan peringatan " +
          "merah palsu yang bisa membingungkan rekan satu timmu.",
      },
    },
    {
      id: "L6",
      slug: "tantangan",
      title: "Tantangan Chapter 13",
      theory: {
        explanation: `Pada tantangan akhir di seri dasar ini, kamu akan membangun sebuah fungsi pengelompokan data berlapis (Nested Data Grouping). Kamu harus menggunakan perulangan (Loop), pengkondisian pada Dictionary (seperti di Chapter 10), fungsi manipulasi teks (Indeks), dan menuliskan Type Hints kompleks.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Buatlah fungsi bernama kelompokkan_huruf. Fungsi ini menerima " +
          "daftar kata acak, dan bertugas mengelompokkan kata-kata tersebut " +
          "berdasarkan huruf pertama dari masing-masing kata.\n\n" +
          "Langkah pengerjaan:\n" +
          "1. Tambahkan Type Hints pada definisi fungsi: parameter daftar_kata " +
          "menerima List berisi string (list[str]), dan mengembalikan " +
          "Dictionary dengan Key berupa string dan Value berupa List berisi " +
          "string (dict[str, list[str]]).\n" +
          "2. Di dalam fungsi, lakukan iterasi pada daftar_kata.\n" +
          "3. Ambil huruf pertama dari setiap kata (menggunakan indeks [0]).\n" +
          "4. Jika huruf tersebut belum ada di dalam kamus hasil, buat kunci " +
          "huruf tersebut dengan nilai awal berupa List kosong [].\n" +
          "5. Tambahkan kata tersebut ke dalam List milik kunci huruf yang " +
          "sesuai menggunakan .append().\n" +
          "6. Kembalikan kamus hasil tersebut menggunakan return.",
        starterCode: `# Lengkapi Type Hints fungsi di bawah ini
def kelompokkan_huruf(daftar_kata):
    hasil = {}

    # Tulis logika perulangan dan pengelompokan dictionary di bawah ini


    return hasil

# Jangan ubah baris cetak di bawah
kumpulan_teks = ["apel", "ayam", "buku", "batu", "cacing"]
print(kelompokkan_huruf(kumpulan_teks))
`,
        hints: [
          "Definisi fungsimu harus berbentuk: def kelompokkan_huruf(daftar_kata: list[str]) -> dict[str, list[str]]:.",
          "Lakukan iterasi for kata in daftar_kata:.",
          "Ambil huruf depannya dengan huruf = kata[0].",
          "Lakukan pengecekan keberadaan struktur dengan if huruf not in hasil:, lalu inisialisasi list kosongnya: hasil[huruf] = [].",
          "Di luar blok if namun masih di dalam loop, masukkan kata ke dalam list yang sesuai: hasil[huruf].append(kata).",
        ],
        answerHint: `def kelompokkan_huruf(daftar_kata: list[str]) -> dict[str, list[str]]:
    hasil = {}

    for kata in daftar_kata:
        huruf = kata[0]
        if huruf not in hasil:
            hasil[huruf] = []
        hasil[huruf].append(kata)

    return hasil

kumpulan_teks = ["apel", "ayam", "buku", "batu", "cacing"]
print(kelompokkan_huruf(kumpulan_teks))`,
        checker: {
          type: "stdout_exact",
          expected:
            "{'a': ['apel', 'ayam'], 'b': ['buku', 'batu'], 'c': ['cacing']}",
          sourceRequirements: [
            {
              pattern: String.raw`def\s+kelompokkan_huruf\s*\([^)]*\bdaftar_kata\s*:\s*list\[\s*str\s*\]`,
              message:
                "Outputnya sudah benar, tapi parameter daftar_kata belum dilabeli list[str].",
            },
            {
              pattern: String.raw`def\s+kelompokkan_huruf\s*\([^)]*\)\s*->\s*dict\[\s*str\s*,\s*list\[\s*str\s*\]\s*\]\s*:`,
              message:
                "Outputnya sudah benar, tapi nilai kembalian fungsi belum dilabeli Dictionary dengan Key string dan Value List berisi string.",
            },
          ],
        },
        successFeedback:
          "Sempurna yang Luar Biasa! Kamu baru saja mengimplementasikan " +
          "logika Indexing & Grouping bersarang, memecah belah dan " +
          "menyatukan kembali data dinamis, sekaligus mendeklarasikan " +
          "arsitektur fungsimu menggunakan Type Hints skala industri. " +
          "Selamat, kamu telah menyelesaikan seluruh materi Python Dasar!",
      },
    },
  ],
};
