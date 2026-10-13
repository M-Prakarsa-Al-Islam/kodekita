import type { ChapterContent } from "@/content/types";

export const chapter11: ChapterContent = {
  slug: "11-set",
  order: 11,
  title: "Set",
  isFree: false,
  status: "published",
  lessons: [
    {
      id: "L1",
      slug: "pengenalan-set",
      title: "Pengenalan Set dan Keunikan Data",
      theory: {
        explanation: `Tipe data struktur keempat di Python adalah Set. Set dibuat menggunakan tanda kurung kurawal {}. Set ini sama seperti list. Bedanya, Set memiliki dua sifat utama yang sangat penting:
1. Unik (Tidak Menerima Duplikat): jika kamu memasukkan nilai yang sama berkali-kali ke dalam Set, Python akan otomatis membuang duplikatnya dan hanya menyimpan satu.
2. Tidak Berurutan (Unordered): Set tidak memiliki nomor indeks. Kamu tidak bisa memanggil data menggunakan data[0].

Dikarenakan {} digunakan untuk membuat Dictionary kosong, maka untuk membuat Set kosong, kamu harus menggunakan set().`,
        example: {
          description: "Membuat set dan melihat sifat keunikannya.",
          code: `angka = {1, 2, 2, 3, 3, 3}
kosong = set()  # Membuat Set kosong

print(angka)
# Output: {1, 2, 3} (duplikat otomatis dihapus)

print(kosong)
# Output: set()`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Apa yang akan terjadi jika kita membuat set yang berisi data string berikut ini?",
        codeSnippet: `warna = {"Merah", "Kuning", "Merah", "Hijau"}`,
        options: [
          "Python akan menghasilkan Error karena ada data duplikat.",
          "Panjang Set (len) tersebut akan menjadi 4.",
          'String "Merah" yang kedua akan diabaikan, sehingga Set hanya berisi "Merah", "Kuning", "Hijau".',
          "Set akan berubah bentuk menjadi List.",
        ],
        correctIndex: 2,
        explanation:
          "Sifat utama Set adalah menolak data duplikat. Python tidak akan " +
          "menampilkan error, melainkan secara diam-diam membuang data " +
          'duplikat yang dimasukkan sehingga hanya tersisa satu "Merah".',
      },
    },
    {
      id: "L2",
      slug: "menambah-dan-menghapus-elemen",
      title: "Menambah dan Menghapus Elemen",
      theory: {
        explanation: `Karena Set tidak memiliki urutan indeks, kita tidak bisa menggunakan .append() seperti pada List. Sebagai gantinya, kita menggunakan metode .add() untuk menambah satu elemen.

Untuk menghapus elemen, kita menggunakan .remove(). Jika nilai yang ingin dihapus tidak ada di dalam Set, .remove() akan menghasilkan error.

Penting: karena Set tidak memiliki urutan tetap, mencetak Set menggunakan print() dapat menghasilkan susunan teks yang berubah-ubah di layar. Agar hasil cetakan selalu pasti (deterministik), biasakan membungkus Set dengan fungsi sorted() saat melakukan print. Fungsi ini akan mengubah Set sementara menjadi sebuah List yang terurut.`,
        example: {
          description: "Menambah, menghapus, dan mencetak dengan sorted().",
          code: `keranjang = {"apel", "mangga"}
keranjang_kosong = set()

keranjang.add("jeruk")
keranjang.remove("mangga")

keranjang_kosong.add("pisang")
# keranjang_kosong.remove("apel") akan menghasilkan error karena "apel" tidak ada di dalam keranjang_kosong

# Cetak dengan sorted agar urutannya pasti
print(sorted(keranjang))
# Output: ['apel', 'jeruk']

print(sorted(keranjang_kosong))
# Output: ['pisang']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Di bawah ini terdapat Set bernama roles. Lakukan tiga hal " +
          "berikut secara berurutan:\n" +
          '1. Tambahkan hak akses "moderator" menggunakan .add().\n' +
          '2. Hapus hak akses "user" menggunakan .remove().\n' +
          "3. Cetak variabel roles menggunakan fungsi sorted() agar output alfabetnya terurut sempurna.",
        starterCode: `roles = {"admin", "user"}

# Tambahkan role "moderator"

# Hapus role "user"

# Cetak variabel roles menggunakan print(sorted(...))
`,
        hints: [
          'Gunakan roles.add("moderator").',
          'Gunakan roles.remove("user").',
          "Fungsi cetak harus persis seperti ini: print(sorted(roles)) agar output sesuai ekspektasi.",
        ],
        answerHint: `roles = {"admin", "user"}
roles.add("moderator")
roles.remove("user")
print(sorted(roles))`,
        checker: {
          type: "stdout_exact",
          expected: "['admin', 'moderator']",
        },
        successFeedback:
          "Bagus! Sekarang kamu sudah tahu cara mengelola isi Set. Ingat, " +
          "sorted() mengembalikan sebuah List, itulah sebabnya output-mu " +
          "dibungkus dengan kurung siku [].",
      },
    },
    {
      id: "L3",
      slug: "irisan-intersection",
      title: "Irisan (Intersection)",
      theory: {
        explanation: `Kekuatan terbesar dari Set dibandingkan List atau Dictionary adalah kemampuannya melakukan Operasi Himpunan Matematika dengan sangat cepat.

Operasi pertama adalah Irisan (Intersection). Operasi ini digunakan untuk mencari elemen apa saja yang sama-sama dimiliki oleh dua buah Set. Kamu bisa menggunakan operator &.`,
        example: {
          description:
            "Mencari elemen yang sama antara dua Set menggunakan operator &",
          code: `hobi_andi = {"Membaca", "Lari", "Coding"}
hobi_siti = {"Coding", "Renang", "Membaca"}

# Mencari hobi yang sama-sama disukai Andi dan Siti
hobi_bersama = hobi_andi & hobi_siti

print(sorted(hobi_bersama))
# Output: ['Coding', 'Membaca']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Dua kelompok siswa sedang belajar di perpustakaan. Kelompok A ada " +
          "di variabel kelas_a, dan Kelompok B di kelas_b.\n" +
          "Cari tahu siapa saja nama siswa yang bergabung di kedua kelompok " +
          "tersebut secara bersamaan menggunakan operasi irisan &. Simpan " +
          "hasilnya di variabel irisan, lalu cetak dengan sorted().",
        starterCode: `kelas_a = {"Raka", "Budi", "Siti", "Ayu"}
kelas_b = {"Bima", "Ayu", "Joko", "Raka"}

# Cari siswa yang ada di kelas_a dan kelas_b, simpan di variabel irisan


# Cetak irisan menggunakan sorted()
`,
        hints: [
          "Gunakan operator ampersand & di antara kedua variabel himpunan.",
          "Simpan dengan bentuk irisan = kelas_a & kelas_b.",
          "Cetak dengan print(sorted(irisan)).",
        ],
        answerHint: `kelas_a = {"Raka", "Budi", "Siti", "Ayu"}
kelas_b = {"Bima", "Ayu", "Joko", "Raka"}

irisan = kelas_a & kelas_b

print(sorted(irisan))`,
        checker: {
          type: "stdout_exact",
          expected: "['Ayu', 'Raka']",
        },
        successFeedback:
          "Tepat sekali! Bayangkan jika kamu menggunakan List, kamu harus " +
          "menulis pengkondisian for loop yang panjang untuk mencari " +
          "kesamaan data ini. Dengan Set, cukup satu simbol &!",
      },
    },
    {
      id: "L4",
      slug: "gabungan-union",
      title: "Gabungan (Union)",
      theory: {
        explanation: `Operasi matematika himpunan kedua adalah Gabungan (Union). Operasi ini digunakan untuk menggabungkan seluruh elemen dari dua buah Set menjadi satu kesatuan. Tentu saja, duplikat dari hasil gabungan tersebut akan otomatis dibuang.

Untuk melakukan Gabungan, kamu bisa menggunakan operator garis vertikal |.`,
        example: {
          description: "Menggabungkan dua Set menggunakan operator |",
          code: `tim_backend = {"Andi", "Budi"}
tim_frontend = {"Siti", "Budi", "Eka"} # Budi ada di kedua tim

# Menggabungkan seluruh anggota proyek
semua_anggota = tim_backend | tim_frontend

print(sorted(semua_anggota))
# Output: ['Andi', 'Budi', 'Eka', 'Siti'] (Budi hanya muncul satu kali)`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu sedang mengumpulkan seluruh daftar menu dari dua restoran " +
          "cabang yang berbeda. Gabungkan isi dari set menu_pusat dan " +
          "menu_cabang menggunakan operator |. Simpan hasilnya ke dalam " +
          "variabel semua_menu, lalu cetak menggunakan sorted().",
        starterCode: `menu_pusat = {"Nasi Goreng", "Sate", "Soto"}
menu_cabang = {"Soto", "Mie Ayam", "Nasi Goreng"}

# Gabungkan kedua set ke variabel semua_menu


# Cetak semua_menu menggunakan sorted()
`,
        hints: [
          "Gunakan semua_menu = menu_pusat | menu_cabang.",
          "Jangan lupa mencetaknya dengan print(sorted(semua_menu)).",
        ],
        answerHint: `menu_pusat = {"Nasi Goreng", "Sate", "Soto"}
menu_cabang = {"Soto", "Mie Ayam", "Nasi Goreng"}

semua_menu = menu_pusat | menu_cabang

print(sorted(semua_menu))`,
        checker: {
          type: "stdout_exact",
          expected: "['Mie Ayam', 'Nasi Goreng', 'Sate', 'Soto']",
        },
        successFeedback:
          "Kerja bagus! Menggabungkan data kompleks tanpa perlu repot " +
          "memilah duplikasi adalah keunggulan utama dari fungsi Gabungan di Python.",
      },
    },
    {
      id: "L5",
      slug: "selisih-difference",
      title: "Selisih (Difference)",
      theory: {
        explanation: `Operasi himpunan ketiga adalah Selisih (Difference) menggunakan simbol minus -.

Operasi A - B digunakan untuk mencari elemen-elemen yang ada di Set A, tetapi tidak ada di Set B.
Penting untuk diingat bahwa urutan penulisan sangat berpengaruh: hasil dari A - B bisa berbeda dengan hasil B - A.`,
        example: {
          description:
            "Menggunakan operator selisih untuk membuang data yang beririsan.",
          code: `karyawan = {"Andi", "Budi", "Citra"}
sedang_cuti = {"Budi"}

# Mencari karyawan yang sedang aktif bekerja (Karyawan dikurangi yang Cuti)
aktif = karyawan - sedang_cuti

print(sorted(aktif)) # Output: ['Andi', 'Citra']`,
        },
      },
      practice: {
        kind: "quiz",
        question:
          "Seorang pelamar membawa dokumen yang tercatat pada variabel " +
          "dokumen, sedangkan persyaratan lengkap ada pada variabel syarat. " +
          "Setelah kode di bawah ini dijalankan, apa isi dari variabel kurang?",
        codeSnippet: `syarat = {"KTP", "KK", "Pasfoto"}
dokumen = {"KTP"}
kurang = syarat - dokumen`,
        options: ["KTP", "KK, Pasfoto", "KTP, KK, Pasfoto", "Error"],
        correctIndex: 1,
        explanation:
          "Variabel kurang mengeksekusi operasi himpunan syarat dikurangi " +
          'dokumen. Karena dokumen membawa irisan "KTP", maka "KTP" ' +
          "dihilangkan dari syarat. Hasil akhirnya adalah elemen yang " +
          'tersisa di himpunan syarat: "KK" dan "Pasfoto".',
      },
    },
    {
      id: "L6",
      slug: "konversi-list-ke-set",
      title: "Konversi List ke Set (Menghilangkan Duplikat)",
      theory: {
        explanation: `Di dunia nyata, data mentah yang kita miliki umumnya berformat List dan sangat rentan memiliki banyak duplikat.

Salah satu trik tercepat dan paling sering ditanyakan di sesi technical interview adalah cara menghilangkan semua duplikat pada List. Jawabannya sangat mudah: cukup konversi List tersebut menjadi sebuah Set menggunakan fungsi set().`,
        example: {
          description: "Mengubah List menjadi Set untuk menghilangkan duplikasi.",
          code: `log_pengunjung = ["Andi", "Budi", "Andi", "Andi", "Citra"]

# Konversi List menjadi Set
pengunjung_unik = set(log_pengunjung)

print(sorted(pengunjung_unik))
# Output: ['Andi', 'Budi', 'Citra']`,
        },
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu diberikan log_ip, yaitu daftar List alamat IP komputer yang " +
          "mengakses sebuah website. Sebuah alamat IP bisa muncul puluhan " +
          "kali karena me-refresh halaman.\n\n" +
          "Tugasmu:\n" +
          "1. Konversikan log_ip menjadi sebuah set untuk menghapus semua " +
          "duplikat, simpan di variabel ip_unik.\n" +
          "2. Gunakan fungsi len() untuk mencetak total jumlah alamat IP unik " +
          "yang mengakses website tersebut. Ingat, fungsi len() akan " +
          "mengembalikan angka, bukan teks.",
        starterCode: `log_ip = ["192.168.1.1", "10.0.0.1", "192.168.1.1", "10.0.0.5", "10.0.0.1"]

# Ubah log_ip menjadi set dan simpan ke variabel ip_unik


# Cetak jumlah elemen di dalam ip_unik menggunakan len()
`,
        hints: [
          "Konversi list dengan ip_unik = set(log_ip).",
          "Karena instruksi memintamu untuk mencetak jumlah total (angkanya saja), gunakan print(len(ip_unik)). Kamu tidak perlu menggunakan sorted() karena kita hanya mencetak perhitungan matematis berupa angka, bukan isi himpunannya.",
        ],
        answerHint: `log_ip = ["192.168.1.1", "10.0.0.1", "192.168.1.1", "10.0.0.5", "10.0.0.1"]

ip_unik = set(log_ip)
print(len(ip_unik))`,
        checker: {
          type: "stdout_exact",
          expected: "3",
        },
        successFeedback:
          "Luar Biasa! Trik konversi tipe data seperti ini sangat sering " +
          "digunakan dalam ilmu Data Science (Data Cleaning) untuk " +
          "membersihkan data kotor secara cepat.",
      },
    },
    {
      id: "L7",
      slug: "tantangan",
      title: "Tantangan Chapter 11",
      theory: {
        explanation: `Tantangan bab ini akan menguji seluruh pemahamanmu tentang Set. Kamu harus menggabungkan trik Konversi List ke Set, perhitungan Irisan (&), dan perhitungan Selisih (-).

Ingat, pastikan untuk selalu menggunakan fungsi sorted() hanya pada saat melakukan perintah pencetakan (print) hasil akhir agar formatnya divalidasi dengan benar oleh sistem.`,
      },
      practice: {
        kind: "code",
        instructions:
          "Kamu adalah panitia acara seminar 2 hari. Absensi dari peserta " +
          "hari pertama dicatat di dalam List absensi_h1, dan absensi hari " +
          "kedua dicatat di List absensi_h2. Di dalam list tersebut ada " +
          "banyak nama ganda karena beberapa orang mengisi absen lebih dari " +
          "satu kali.\n\n" +
          "Tugasmu:\n" +
          "1. Bersihkan absensi_h1 dan absensi_h2 dengan mengubah keduanya " +
          "menjadi tipe data Set. Simpan di variabel set_h1 dan set_h2.\n" +
          "2. Cari nama orang yang hadir di kedua hari (hari pertama DAN hari " +
          "kedua). Simpan hasilnya di variabel hadir_penuh.\n" +
          "3. Cari nama orang yang HANYA hadir di hari pertama (tidak hadir " +
          "di hari kedua). Simpan hasilnya di variabel hanya_h1.\n" +
          "4. Cetak variabel hadir_penuh menggunakan print(sorted(...)).\n" +
          "5. Cetak variabel hanya_h1 menggunakan print(sorted(...)).\n" +
          "(Penting: lakukan cetak baris demi baris, jangan digabung dalam satu print).",
        starterCode: `absensi_h1 = ["Raka", "Budi", "Citra", "Raka", "Siti"]
absensi_h2 = ["Siti", "Andi", "Eka", "Budi", "Siti"]

# Ubah List absensi menjadi Set


# Hitung irisan untuk mendapat peserta yang hadir penuh


# Hitung selisih untuk mendapat peserta yang hanya hadir hari 1


# Cetak hadir_penuh (Gunakan sorted!)


# Cetak hanya_h1 (Gunakan sorted!)
`,
        hints: [
          "Buat set_h1 = set(absensi_h1) dan set_h2 = set(absensi_h2).",
          "Gunakan operasi irisan & untuk peserta hadir penuh (set_h1 & set_h2).",
          "Gunakan operasi selisih - untuk peserta yang hanya hadir di hari pertama (set_h1 - set_h2).",
          "Cetak menggunakan format print(sorted(nama_variabel)).",
        ],
        answerHint: `absensi_h1 = ["Raka", "Budi", "Citra", "Raka", "Siti"]
absensi_h2 = ["Siti", "Andi", "Eka", "Budi", "Siti"]

set_h1 = set(absensi_h1)
set_h2 = set(absensi_h2)

hadir_penuh = set_h1 & set_h2
hanya_h1 = set_h1 - set_h2

print(sorted(hadir_penuh))
print(sorted(hanya_h1))`,
        checker: {
          type: "stdout_exact",
          expected: `['Budi', 'Siti']
['Citra', 'Raka']`,
        },
        successFeedback:
          "Sangat impresif! Kamu berhasil mengombinasikan Data Cleaning " +
          "sederhana dan manipulasi logika matematika himpunan dalam satu " +
          "alur. Pekerjaan kompleks ini bahkan diselesaikan hanya dalam " +
          "beberapa baris kode singkat berkat keistimewaan tipe data Set di Python.",
      },
    },
  ],
};
