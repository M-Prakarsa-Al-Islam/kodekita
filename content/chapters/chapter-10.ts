import type { ChapterContent } from "@/content/types";

export const chapter10: ChapterContent = {
  slug: "10-dictionary",
  order: 10,
  title: "Dictionary",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "pengenalan-dictionary",
      title: "Pengenalan Dictionary (Key-Value)",
      theory: {
        explanation: `Pada chapter sebelumnya, kita menyimpan banyak data di dalam List berdasarkan urutan indeks angka. Namun, jika kita ingin menyimpan data yang memiliki label atau nama (seperti profil pengguna), kita menggunakan Dictionary.

Dictionary menyimpan data dalam bentuk pasangan key (kunci) dan value (nilai). Dictionary dibuat menggunakan tanda kurung kurawal {}. Untuk mengakses sebuah value, kita memanggil key-nya menggunakan kurung siku [].

Sebagai catatan, penulisan dictionary bisa dilakukan secara horizontal (satu baris, cocok untuk data sedikit) maupun vertikal (berbaris-baris ke bawah, lebih rapi dan mudah dibaca untuk data panjang).`,
        example: {
          description:
            "Membuat dictionary (horizontal dan vertikal) serta mengakses nilainya.",
          code: `# Penulisan horizontal
koordinat = {"x": 10, "y": 20}

# Penulisan vertikal
profil = {
    "nama": "Andi",
    "umur": 24,
    "pekerjaan": "Developer"
}

# Mengakses data menggunakan key
print(profil["nama"]) # Output: Andi
print(koordinat["x"]) # Output: 10`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini terdapat dictionary server_config yang ditulis secara " +
          "vertikal. Cetak nama dari host server tersebut ke layar menggunakan " +
          "print() dan pengaksesan key.",
        starterCode: `server_config = {
    "host": "localhost",
    "port": 8080,
    "status": "active"
}

# Cetak nilai dari key "host" di bawah baris ini
`,
        hints: [
          "Sama seperti List, kamu menggunakan tanda kurung siku [] untuk mengakses data. Bedanya, isi kurung siku tersebut dengan teks key yang ingin dicari.",
          'Key yang menyimpan nilai "localhost" adalah "host".',
        ],
        answerHint: `print(server_config["host"])`,
        checker: {
          type: "stdout_exact",
          expected: "localhost",
        },
        successFeedback:
          "Kerja bagus! Menggunakan key berbentuk teks membuat data jauh " +
          "lebih mudah dibaca dan dipahami oleh manusia dibandingkan hanya " +
          "mengandalkan urutan angka.",
      },
    },
    {
      id: "L2",
      slug: "menambah-dan-mengubah-data",
      title: "Menambah dan Mengubah Data",
      theory: {
        explanation: `Dictionary bersifat mutable, artinya datanya dapat diubah setelah dibuat.

Untuk mengubah data, panggil key yang sudah ada dan berikan nilai baru menggunakan operator penugasan =.
Jika kamu memanggil key yang belum ada dan memberikannya nilai, Python secara otomatis akan menambahkan pasangan key dan value baru tersebut ke dalam dictionary.`,
        example: {
          description:
            "Mengubah nilai yang sudah ada dan menambahkan pasangan key-value baru.",
          code: `karyawan = {"nama": "Budi", "divisi": "Sales"}

# Mengubah data yang sudah ada
karyawan["divisi"] = "Marketing"

# Menambah data baru
karyawan["gaji"] = 5000000

print(karyawan["divisi"]) # Output: Marketing
print(karyawan["gaji"])   # Output: 5000000
print(karyawan) # {'nama': 'Budi', 'divisi': 'Marketing', 'gaji': 5000000}`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu diberikan data sebuah game di dalam dictionary. Lakukan dua " +
          "operasi ini secara berurutan:\n" +
          '1. Ubah nilai dari key "skor" menjadi 95.\n' +
          '2. Tambahkan key baru bernama "genre" dengan nilai "RPG".\n' +
          "Cetak dictionary game di baris paling akhir untuk melihat perubahannya.",
        starterCode: `game = {
    "judul": "Persona",
    "skor": 85
}

# Ubah skor menjadi 95

# Tambahkan key "genre" dengan nilai "RPG"

# Cetak dictionary game
print(game)
`,
        hints: [
          'Panggil game["skor"] dan berikan nilai integer 95.',
          'Lakukan hal yang sama untuk menambahkan "genre". Karena key ini belum ada, Python akan menambahkannya secara otomatis.',
        ],
        answerHint: `game = {
    "judul": "Persona",
    "skor": 85
}

game["skor"] = 95
game["genre"] = "RPG"

print(game)`,
        checker: {
          type: "stdout_exact",
          expected: "{'judul': 'Persona', 'skor': 95, 'genre': 'RPG'}",
        },
        successFeedback:
          "Sempurna! Kamu telah memahami cara memanipulasi data secara dinamis.",
      },
    },
    {
      id: "L3",
      slug: "kunci-ganda",
      title: "Kunci Ganda (Duplicate Keys)",
      theory: {
        explanation: `Aturan terpenting dalam Dictionary adalah sebuah key harus unik (tidak boleh ada yang sama).

Lalu, apa yang terjadi jika kita tidak sengaja membuat dua key yang persis sama saat menulis sebuah dictionary? Python tidak akan menghasilkan error. Alih-alih, nilai dari key yang terakhir akan menimpa (overwrite) nilai dari key sebelumnya.`,
        example: {
          description: "Dictionary yang ditulis dengan key ganda.",
          code: `# Terdapat dua key "warna"
mobil = {
    "merk": "Honda",
    "warna": "Hitam",
    "warna": "Putih"
}

# Python hanya akan menyimpan nilai yang paling terakhir
print(mobil)
# Output: {'merk': 'Honda', 'warna': 'Putih'}`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          'Jika kita mengeksekusi kode di bawah ini, apa hasil dari print(profil["id"])?',
        codeSnippet: `profil = {"id": 1, "nama": "Alex", "id": 99}
print(profil["id"])`,
        options: [
          "1",
          "99",
          "Mengembalikan list [1, 99]",
          "Terjadi Error karena duplikasi",
        ],
        correctIndex: 1,
        explanation:
          'Karena key harus unik, penulisan "id": 99 yang berada di akhir ' +
          'akan menimpa nilai "id": 1 yang ditulis sebelumnya. Sehingga nilai ' +
          "final dari id adalah 99.",
      },
    },
    {
      id: "L4",
      slug: "dictionary-kosong",
      title: "Dictionary Kosong",
      theory: {
        explanation: `Sama seperti List, kita juga bisa membuat dictionary kosong, yaitu dictionary tanpa data apapun di dalamnya dengan menuliskan {}.

Apa manfaatnya? Di dunia nyata program, kita jarang menulis seluruh isi dictionary secara manual (hardcode). Biasanya, kita menyiapkan dictionary kosong terlebih dahulu, lalu mengisinya dengan data secara dinamis (misalnya mengambil data dari hasil hitungan loop, input dari user, atau membaca file data).`,
        example: {
          description: "Membuat dictionary kosong dan mengisinya bertahap.",
          code: `keranjang = {} # Dictionary kosong

# Nanti di bagian kode lain, kita mengisinya
keranjang["buku"] = 2
keranjang["pena"] = 5

print(keranjang) # Output: {'buku': 2, 'pena': 5}`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Buatlah sebuah dictionary kosong bernama user_baru. Kemudian, " +
          'tambahkan dua data ke dalamnya: key "username" dengan nilai ' +
          '"admin_utama", dan key "aktif" dengan nilai boolean True. Cetak ' +
          "dictionary tersebut.",
        starterCode: `# Buat dictionary kosong bernama user_baru

# Tambahkan username dan status aktif


# Cetak hasilnya
`,
        hints: [
          "Deklarasikan user_baru = {}.",
          'Tambahkan data dengan user_baru["username"] = "admin_utama". Lakukan hal serupa untuk tipe boolean True.',
        ],
        answerHint: `user_baru = {}
user_baru["username"] = "admin_utama"
user_baru["aktif"] = True

print(user_baru)`,
        checker: {
          type: "stdout_exact",
          expected: "{'username': 'admin_utama', 'aktif': True}",
        },
        successFeedback:
          'Tepat sekali! Menyiapkan "wadah kosong" adalah teknik fundamental ' +
          "dalam pemrograman algoritma, terutama jika kamu nanti bekerja " +
          "dengan database.",
      },
    },
    {
      id: "L5",
      slug: "menghapus-data-dan-cek-keanggotaan",
      title: "Menghapus Data dan Cek Keanggotaan",
      theory: {
        explanation: `Kamu bisa menggunakan perintah del untuk menghapus pasangan key-value dari dictionary berdasarkan key-nya.

Selain itu, kamu bisa menggunakan operator in (dan not in) untuk mengecek apakah sebuah dictionary memiliki key tertentu. Penting: operator in pada dictionary secara baku hanya mengecek keberadaan key, bukan value.`,
        example: {
          description: "Mengecek keberadaan key, lalu menghapusnya.",
          code: `pesanan = {"kopi": 2, "teh": 1}

print("kopi" in pesanan) # Output: True
print(2 in pesanan)      # Output: False (karena 2 adalah value)

if "teh" in pesanan:
    del pesanan["teh"]

print(pesanan) # Output: {'kopi': 2}`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Di dalam program e-commerce, terdapat dictionary harga_barang. " +
          "Apa hasil jika kode di bawah ini dieksekusi?",
        codeSnippet: `harga_barang = {"Buku": 50000, "Tas": 150000}
print("Tas" in harga_barang)`,
        options: [
          'Menghasilkan False karena nilai "Tas" tidak sama dengan 150000.',
          'Menghasilkan True karena "Tas" terdaftar sebagai key di dalam dictionary.',
          "Menghasilkan Error karena kita harus mengecek nilai angkanya.",
          'Menghasilkan string "150000".',
        ],
        correctIndex: 1,
        explanation:
          "Operator in digunakan untuk mengecek apakah sebuah string/data " +
          'terdapat di dalam daftar key milik dictionary. Karena "Tas" adalah ' +
          "salah satu key, maka hasilnya True.",
      },
    },
    {
      id: "L6",
      slug: "iterasi-dasar",
      title: "Iterasi Dasar pada Dictionary",
      theory: {
        explanation: `Seringkali kita perlu melakukan looping untuk melihat seluruh isi dari dictionary.

Jika kita melakukan iterasi for secara langsung pada sebuah dictionary (misal: for x in nama_dict:), maka Python secara otomatis hanya akan melakukan iterasi pada bagian key-nya saja. Kamu kemudian bisa menggunakan key tersebut untuk memanggil value-nya di dalam blok loop.`,
        example: {
          description: "Melakukan perulangan langsung pada dictionary.",
          code: `stok = {"Apel": 10, "Jeruk": 5}

# Variabel "nama_buah" akan berisi key satu per satu
for nama_buah in stok:
    print(nama_buah) # Mencetak key

    # Mengakses value menggunakan key yang sedang dilooping
    jumlah = stok[nama_buah]
    print(jumlah)

# Output:
# Apel
# 10
# Jeruk
# 5`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Terdapat dictionary nilai berisi nama siswa dan angkanya. Lakukan " +
          "iterasi menggunakan for untuk mencetak kalimat " +
          "[nama] mendapat nilai [angka].",
        starterCode: `nilai = {"Budi": 85, "Siti": 90}

# Lakukan loop dasar pada dictionary
for siswa in nilai:
    # Ambil angkanya dan cetak sesuai format
    
`,
        hints: [
          "Di dalam loop, kamu bisa mendapatkan angka dengan angka = nilai[siswa].",
          'Gunakan f-string print(f"{siswa} mendapat nilai {angka}").',
        ],
        answerHint: `nilai = {"Budi": 85, "Siti": 90}

for siswa in nilai:
    angka = nilai[siswa]
    print(f"{siswa} mendapat nilai {angka}")`,
        checker: {
          type: "stdout_exact",
          expected: `Budi mendapat nilai 85
Siti mendapat nilai 90`,
        },
        successFeedback:
          "Hebat! Memahami perilaku iterasi default pada dictionary adalah " +
          "kunci untuk menghindari kebingungan saat membaca kode milik orang lain.",
      },
    },
    {
      id: "L7",
      slug: "metode-iterasi",
      title: "Metode Iterasi (.keys, .values, .items)",
      theory: {
        explanation: `Selain iterasi dasar, Python menyediakan fungsi (method) khusus untuk mengontrol bagian mana dari dictionary yang ingin di-iterasi:
1. .keys(): Mengambil daftar key saja (mirip seperti iterasi dasar).
2. .values(): Mengambil daftar value saja tanpa memedulikan key.
3. .items(): Mengambil pasangan key dan value secara bersamaan.

Catatan khusus untuk .items(): karena metode ini mengembalikan dua bagian (key dan value) di setiap putaran, kamu bisa menyiapkan dua variabel sekaligus di dalam pernyataan for loop-mu!`,
        example: {
          description:
            "Contoh penggunaan .values() dan penggunaan dua variabel di .items()",
          code: `gaji = {"Andi": 300, "Budi": 500}

# Menggunakan .values() - hanya peduli pada angkanya
for uang in gaji.values():
    print(f"Mengirim uang: {uang}")
# Output:
# Mengirim uang: 300
# Mengirim uang: 500

# Menggunakan .items() - butuh dua variabel (misal: nama dan uang)
for nama, uang in gaji.items():
    print(f"{nama} digaji {uang}")
# Output:
# Andi digaji 300
# Budi digaji 500`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Diberikan dictionary penjualan yang berisi jumlah terjual dari " +
          "beberapa barang. Gunakan fungsi iterasi yang paling tepat untuk " +
          "menghitung total keseluruhan barang yang terjual menggunakan pola " +
          "akumulator (menambahkan nilai ke sebuah variabel penampung).",
        starterCode: `penjualan = {
    "sepatu": 15,
    "topi": 8,
    "baju": 20
}

total = 0

# Tulis loop untuk menjumlahkan semua angka penjualan


print(total)
`,
        hints: [
          "Karena kita tidak peduli dengan nama barangnya, kita hanya butuh angkanya. Gunakan .values().",
          "for angka in penjualan.values():",
          "Tambahkan angka ke dalam variabel total di setiap perulangan menggunakan +=.",
        ],
        answerHint: `penjualan = {
    "sepatu": 15,
    "topi": 8,
    "baju": 20
}

total = 0

for angka in penjualan.values():
    total += angka

print(total)`,
        checker: {
          type: "stdout_exact",
          expected: "43",
        },
        successFeedback:
          "Brilian! Menggunakan .values() membuat programmu jauh lebih " +
          "ringkas saat memproses perhitungan statistik.",
      },
    },
    {
      id: "L8",
      slug: "nested-dictionary",
      title: "Nested Dictionary (Dictionary di Dalam Dictionary)",
      theory: {
        explanation: `Value dari sebuah dictionary tidak hanya berupa string, angka, atau boolean. Value tersebut juga bisa berupa dictionary lain! Struktur ini disebut Nested Dictionary (Dictionary bersarang).

Konsep ini sangat penting di dunia nyata untuk merepresentasikan data kompleks berlapis, contohnya seperti data format JSON dari sebuah Web API atau Database. Untuk mengakses nilai paling dalam, kita tinggal menulis dua tanda kurung siku secara berurutan [][].`,
        example: {
          description: "Membuat dan mengakses nested dictionary.",
          code: `# database_user Merupakan Dictionary utama yang menyimpan data beberapa pengguna
database_user = {
    "user_1": {         # Dictionary yang menyimpan data pengguna pertama
        "nama": "Andi",
        "umur": 20
    },
    "user_2": {         # Dictionary yang menyimpan data pengguna kedua
        "nama": "Siti",
        "umur": 25
    }
}

# Akses nama dari user_2
print(database_user["user_2"]["nama"])  # ["user_2"] memilih data milik dictionary user_2, lalu ["nama"] mengambil namanya
# Output: Siti

# Mengubah data dari dalam nested dictionary
database_user["user_1"]["umur"] = 21    # ["user_1"] memilih data milik dictionary user_1, lalu ["umur"] menentukan data yang ingin diubah
print(database_user["user_1"]["umur"])
# Output: 21`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini terdapat data nilai rapor berlapis bernama rapor. " +
          'Siswa bernama "Raka" ternyata mengikuti ujian susulan Fisika, ' +
          "sehingga nilainya berubah.\n" +
          "Tugasmu:\n" +
          '1. Ubah nilai "Fisika" milik "Raka" di dalam dictionary rapor menjadi 95.\n' +
          '2. Cetak nilai "Fisika" milik "Raka" yang baru.',
        starterCode: `rapor = {
    "Budi": {"Matematika": 80, "Fisika": 75},
    "Raka": {"Matematika": 90, "Fisika": 67}
}

# Ubah nilai Fisika milik Raka menjadi 95


# Cetak nilai Fisika milik Raka yang baru
`,
        hints: [
          'Kamu bisa mengakses posisi nilai aslinya dengan mengetik rapor["Raka"]["Fisika"].',
          "Gunakan operator penugasan = untuk memberikan angka baru.",
        ],
        answerHint: `rapor = {
    "Budi": {"Matematika": 80, "Fisika": 75},
    "Raka": {"Matematika": 90, "Fisika": 67}
}

rapor["Raka"]["Fisika"] = 95

print(rapor["Raka"]["Fisika"])`,
        checker: {
          type: "stdout_exact",
          expected: "95",
        },
        successFeedback:
          "Luar biasa! Pengaksesan data berlapis seperti ini adalah " +
          "rutinitas sehari-hari bagi seorang programmer backend atau " +
          "spesialis data.",
      },
    },
    {
      id: "L9",
      slug: "tantangan",
      title: "Tantangan Chapter 10",
      theory: {
        explanation: `Tantangan terakhir ini akan menguji kemampuan logika algoritmamu tingkat lanjut. Kamu harus menggabungkan konsep perulangan (Loop), pengkondisian (If-Else), List, serta pembentukan Nested Dictionary secara dinamis.

Perhatikan dan analisis pola penyelesaiannya, gunakan logika "Jika key belum ada, buat dictionary nya. Jika sudah ada, tambahkan isinya".`,
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu memiliki sebuah List bernama log_transaksi. Di dalamnya " +
          "terdapat beberapa dictionary yang merepresentasikan catatan " +
          "penjualan dari beberapa kasir.\n" +
          "Tugasmu adalah membangun sebuah Nested Dictionary bernama rekap " +
          "yang merangkum total porsi makanan per kasir.\n\n" +
          "Hasil akhir (rekap) yang diekspektasikan dari program ini harus " +
          "berbentuk seperti ini:\n" +
          "{'Andi': {'Ayam': 3, 'Soto': 1}, 'Siti': {'Soto': 2}}\n\n" +
          "Langkah pengerjaan:\n" +
          "1. Lakukan looping untuk membaca setiap catatan di dalam list log_transaksi.\n" +
          "2. Di dalam loop, periksa nama kasirnya: jika nama kasir belum ada di dalam dictionary rekap, buatkan dictionary kosong sebagai nilainya.\n" +
          "3. Masih di dalam loop, periksa nama makanannya: jika makanan tersebut belum ada di dalam dictionary spesifik milik kasir tersebut, inisialisasi nilainya dengan 0.\n" +
          "4. Terakhir, tambahkan jumlah porsi ke makanan kasir tersebut.\n" +
          "5. Cetak isi dictionary rekap di luar loop.",
        starterCode: `log_transaksi = [
    {"kasir": "Andi", "makanan": "Ayam", "porsi": 2},
    {"kasir": "Siti", "makanan": "Soto", "porsi": 2},
    {"kasir": "Andi", "makanan": "Soto", "porsi": 1},
    {"kasir": "Andi", "makanan": "Ayam", "porsi": 1}
]

rekap = {}

# Tulis algoritma rekapitulasi data di bawah ini


`,
        hints: [
          "Awali dengan for catatan in log_transaksi:",
          'Ambil variabel agar lebih mudah dibaca: k = catatan["kasir"], m = catatan["makanan"], p = catatan["porsi"].',
          "Pengecekan kasir: if k not in rekap: lalu buat wadahnya rekap[k] = {}.",
          "Pengecekan makanan kasir (perhatikan letak pengecekannya di dalam rekap[k] bukan rekap): if m not in rekap[k]: lalu berikan nilai awal rekap[k][m] = 0.",
          "Akumulasi porsinya: rekap[k][m] += p.",
        ],
        answerHint: `log_transaksi = [
    {"kasir": "Andi", "makanan": "Ayam", "porsi": 2},
    {"kasir": "Siti", "makanan": "Soto", "porsi": 2},
    {"kasir": "Andi", "makanan": "Soto", "porsi": 1},
    {"kasir": "Andi", "makanan": "Ayam", "porsi": 1}
]

rekap = {}

for catatan in log_transaksi:
    kasir = catatan["kasir"]
    makanan = catatan["makanan"]
    porsi = catatan["porsi"]

    if kasir not in rekap:
        rekap[kasir] = {}

    if makanan not in rekap[kasir]:
        rekap[kasir][makanan] = 0

    rekap[kasir][makanan] += porsi

print(rekap)`,
        checker: {
          type: "stdout_exact",
          expected: "{'Andi': {'Ayam': 3, 'Soto': 1}, 'Siti': {'Soto': 2}}",
        },
        successFeedback:
          "Sangat Brilian! Jika kamu bisa menyelesaikan kasus rekapitulasi " +
          "nested dictionary ini, logikamu sudah sangat matang. Banyak orang " +
          "dewasa kebingungan dalam memahami logika pembentukan struktur " +
          "berlapis ini secara dinamis. Kamu siap menghadapi proyek real-world!",
      },
    },
  ],
};
