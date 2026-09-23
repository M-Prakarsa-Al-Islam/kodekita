import type { ChapterContent } from "@/content/types";

export const chapter4: ChapterContent = {
  slug: "4-scope",
  order: 4,
  title: "Ruang Lingkup Variabel (Scope)",
  isFree: true,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "apa-itu-scope",
      title: "Apa Itu Scope?",
      theory: {
        explanation: `Saat kamu membuat variabel di Python, variabel tersebut tidak
selalu bisa diakses atau dipanggil dari bagian mana saja di dalam
kodemu. Konsep tata letak dan ketersediaan variabel ini disebut Scope
(ruang lingkup).

Bayangkan scope seperti batasan wilayah: ada variabel yang bersifat
"publik" dan bisa dibaca oleh siapa saja di baris mana pun (global
scope), serta ada variabel "privat" yang hanya bisa diakses di dalam
ruangan tertentu, misalnya dibatasi hanya di dalam sebuah fungsi
(local scope).`,
      },
      practice: {
        kind: "quiz",
        question: "Apa yang dimaksud dengan scope dalam pemrograman Python?",
        options: [
          "Kecepatan program saat mengeksekusi dan menjalankan sebuah fungsi.",
          "Alat otomatis di dalam Python untuk menghapus variabel yang tidak terpakai.",
          "Syarat penamaan variabel yang mengharuskan penggunaan huruf kapital.",
          "Wilayah atau batasan di mana sebuah variabel dikenali dan bisa diakses oleh komputer.",
        ],
        correctIndex: 3,
        explanation:
          "Scope menentukan di bagian kode sebelah mana sebuah variabel " +
          "itu \"hidup\" dan bisa dibaca oleh Python.",
      },
    },
    {
      id: "L2",
      slug: "variabel-lokal",
      title: "Variabel Lokal (Local Scope)",
      theory: {
        explanation: `Variabel yang dibuat di dalam sebuah fungsi disebut variabel
lokal (local variable). Variabel ini ibarat rahasia yang hanya
diketahui oleh fungsi itu sendiri. Begitu fungsi selesai menjalankan
tugasnya, variabel lokal tersebut akan langsung dihancurkan dan
dihapus dari memori komputer.

Karena sifatnya yang sangat "terkurung", jika kamu mencoba memanggil
atau mencetak variabel lokal tersebut dari luar fungsinya, Python
akan menghasilkan error (kesalahan) karena ia merasa variabel itu
tidak pernah ada.`,
        example: {
          description:
            "Mengakses variabel lokal dari dalam fungsi (Berhasil) vs dari luar fungsi (Error).",
          code: `def brankas():
    pin = "1234" # Ini adalah variabel lokal
    print(f"PIN di dalam fungsi: {pin}")
    # Output: PIN di dalam fungsi: 1234

brankas() # Output: PIN di dalam fungsi: 1234
print(pin) # akan ERROR karena 'pin' tidak dikenali di luar fungsi!`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di dalam editor, terdapat fungsi tampilkan_pesan() yang " +
          "mendefinisikan variabel lokal pesan_rahasia. Namun, kodenya " +
          "saat ini error karena perintah print(pesan_rahasia) diletakkan " +
          "di luar fungsi sehingga variabelnya tidak ditemukan. Pindahkan " +
          "perintah print tersebut ke dalam fungsi agar bisa berjalan, " +
          "lalu panggil fungsinya di baris paling bawah.",
        starterCode: `def tampilkan_pesan():
    pesan_rahasia = "Pesan ini rahasia!"

# Pindahkan print di bawah ini ke dalam fungsi
print(pesan_rahasia)

# Panggil fungsinya di bawah baris ini

`,
        hints: [
          "Hapus print(pesan_rahasia) yang ada di luar, lalu tulis ulang di dalam blok fungsi.",
          "Ingat aturan indentasi (spasi ke dalam) agar print masuk ke dalam wilayah fungsi.",
        ],
        answerHint: `def tampilkan_pesan():
    pesan_rahasia = "Pesan ini rahasia!"
    print(pesan_rahasia)

tampilkan_pesan()`,
        checker: {
          type: "stdout_exact",
          expected: "Pesan ini rahasia!",
        },
        successFeedback:
          "Luar biasa! Sekarang kamu paham bahwa variabel di dalam fungsi " +
          "tidak bisa sembarangan dipanggil dari luar.",
      },
    },
    {
      id: "L3",
      slug: "variabel-global",
      title: "Variabel Global (Global Scope)",
      theory: {
        explanation: `Sebaliknya, variabel yang dibuat di luar fungsi apa pun
disebut sebagai variabel global (global variable). Variabel global ini
bersifat "publik". Ia bisa dibaca dan digunakan oleh fungsi mana saja
secara bebas di seluruh bagian kodemu.`,
        example: {
          description: "Membaca variabel global dari dalam sebuah fungsi.",
          code: `nama_game = "Python Quest" # Ini adalah variabel global

def mulai_game():
    print(f"Selamat datang di {nama_game}")
    # Output: Selamat datang di Python Quest

mulai_game()`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buatlah sebuah variabel global bernama cuaca dan isi dengan " +
          'teks "Cerah". Kemudian, di dalam fungsi cek_cuaca(), gunakan ' +
          "f-string untuk mencetak variabel tersebut agar menghasilkan " +
          "kalimat Hari ini cuaca: Cerah. Jangan lupa panggil fungsinya " +
          "di baris paling bawah!",
        starterCode: `# Buat variabel global cuaca di sini


def cek_cuaca():
    # Cetak cuaca menggunakan f-string di sini
    pass

# Panggil fungsinya di sini

`,
        hints: [
          "Variabel global harus ditulis tanpa indentasi (menempel lurus di pinggir kiri).",
          "Hapus kata pass di dalam fungsi dan ganti dengan perintah print.",
        ],
        answerHint: `cuaca = "Cerah"

def cek_cuaca():
    print(f"Hari ini cuaca: {cuaca}")

cek_cuaca()`,
        checker: {
          type: "stdout_exact",
          expected: "Hari ini cuaca: Cerah",
        },
        successFeedback:
          "Tepat sekali! Variabel global sangat berguna untuk menyimpan " +
          "data yang perlu diakses oleh banyak fungsi sekaligus.",
      },
    },
    {
      id: "L4",
      slug: "kesalahan-umum-shadowing",
      title: "Kesalahan Umum: Variabel \"Kembar\" (Shadowing)",
      theory: {
        explanation: `Apa yang terjadi jika kamu membuat variabel lokal di dalam
fungsi dengan nama yang sama persis dengan nama variabel global?

Python tidak akan mengubah variabel global tersebut. Sebaliknya,
Python akan membuat variabel lokal baru yang hanya berlaku di dalam
fungsi itu, dan seolah menutupi variabel globalnya untuk sementara.
Kejadian ini disebut Shadowing dan sangat sering membuat programmer
pemula kebingungan saat mencari bug.`,
        example: {
          description: "Menggunakan nama variabel lokal yang sama dengan global (Shadowing).",
          code: `poin = 100 # Variabel global

def mainkan():
    poin = 50 # Membuat variabel lokal baru, TIDAK mengubah variabel global!
    print(f"Poin di fungsi: {poin}")

mainkan() # Output: Poin di fungsi: 50
print(f"Poin global: {poin}") # Output: Poin global: 100 (Variabel global tetap utuh tidak berubah)`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          'Pada contoh kode di atas, mengapa perintah print(f"Poin global: {poin}") ' +
          "di baris terakhir tetap mencetak angka 100 dan bukan 50?",
        options: [
          "Karena fungsi mainkan() mengalami error secara diam-diam.",
          "Karena membuat variabel dengan nama yang sama di dalam fungsi akan menghasilkan variabel lokal baru, sehingga variabel global aslinya tidak tertimpa.",
          "Karena operasi matematika gagal dijalankan oleh komputer.",
          "Karena Python selalu otomatis mengutamakan nilai angka yang lebih besar.",
        ],
        correctIndex: 1,
        explanation:
          "Ingat aturan penting ini: ketika kamu menggunakan tanda sama " +
          "dengan (=) untuk variabel di dalam fungsi, kamu selalu membuat " +
          "variabel lokal yang baru.",
      },
    },
    {
      id: "L5",
      slug: "tantangan-chapter-4",
      title: "Tantangan Chapter 4",
      theory: {
        explanation: `Tantangan kali ini akan menguji pemahamanmu dalam merangkai
variabel global dan lokal di dalam satu program utuh. Kamu akan
membuat sistem kalkulator skor yang membaca data dari luar (global
scope), menghitungnya menggunakan memori di dalam (local scope), dan
mengembalikan hasilnya (return).`,
      },
      practice: {
        kind: "code",
        instructions:
          "Tulis kodemu dari awal dengan urutan instruksi berikut:\n" +
          "1. Buat variabel global bernama bonus_poin dan isi dengan angka 500.\n" +
          "2. Buat fungsi bernama hitung_skor yang menerima satu parameter bernama skor_dasar.\n" +
          "3. Di dalam fungsi tersebut, buat variabel lokal bernama total. " +
          "Isi variabel total ini dengan hasil penjumlahan antara parameter " +
          "skor_dasar dan variabel global bonus_poin.\n" +
          "4. Masih di dalam fungsi, lakukan return pada variabel total.\n" +
          "5. Di baris paling bawah (luar fungsi), panggil fungsi hitung_skor " +
          "tersebut dan berikan argumen angka 1000. Simpan hasil " +
          "pemanggilannya ke dalam variabel bernama skor_akhir.\n" +
          "6. Terakhir, cetak isi variabel skor_akhir.",
        starterCode: `# Tulis kodemu di bawah baris ini

`,
        hints: [
          "Deklarasi fungsimu harus berupa def hitung_skor(skor_dasar):.",
          "Variabel total wajib diletakkan di dalam fungsi (menggunakan spasi/indentasi).",
          "Pemanggilan fungsi hitung_skor di baris bawah harus diletakkan sejajar tanpa spasi di pinggir kiri.",
        ],
        answerHint: `bonus_poin = 500

def hitung_skor(skor_dasar):
    total = skor_dasar + bonus_poin
    return total

skor_akhir = hitung_skor(1000)
print(skor_akhir)`,
        checker: {
          type: "stdout_exact",
          expected: "1500",
        },
        successFeedback:
          "Sempurna! Memahami konsep Scope akan menyelamatkanmu dari " +
          "ratusan kebingungan (bug) di masa depan. Kamu sudah siap " +
          "melangkah ke Chapter 5!",
      },
    },
  ],
};
