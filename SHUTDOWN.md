# Menutup PyMula (runbook)

Dokumen ini untuk pengelola, termasuk "diri sendiri di masa depan" yang sudah lupa
bagaimana semuanya bekerja. Semua angka ada di `lib/site-config.ts`.

## Fakta singkat

| | |
|---|---|
| Tanggal akhir layanan (maksimal) | **1 Oktober 2027**, 23:59 WIB (`SERVICE_END_ISO`) |
| Domain `pymula.live` habis | **17 Oktober 2027** (`DOMAIN_EXPIRES_ISO`) |
| Pemberitahuan (pop-up) | otomatis mulai **45 hari** sebelum tanggal akhir (janji ke pengguna: minimal 30 hari) |
| Penjualan chapter berbayar | otomatis ditutup pada saat yang sama |
| Refund penuh | pembelian dalam **45 hari** terakhir sebelum tanggal akhir |
| Klaim refund diterima | sampai **30 hari** setelah tanggal akhir, lewat WhatsApp |

## Yang terjadi otomatis (tanpa tindakan apa pun)

1. **18 Agustus 2027:** pop-up pemberitahuan muncul sekali sehari; tombol beli hilang; halaman beli menampilkan "Penjualan sudah ditutup".
2. **2 Oktober 2027 (sehari setelah tanggal akhir):** setiap alamat di situs menampilkan halaman perpisahan. Tidak ada lagi panggilan ke Supabase.

Ini berjalan sendiri selama deployment di Vercel masih ada, jadi pemberitahuan tetap muncul walaupun pengelola sedang tidak bisa mengurus apa pun.

## Berhenti LEBIH AWAL dari rencana

1. Buka `lib/site-config.ts`, ubah `SERVICE_END_ISO` menjadi tanggal **minimal 30 hari ke depan** (disarankan 45, dengan jam `23:59:59+07:00`). Pastikan tetap sebelum `DOMAIN_EXPIRES_ISO` minus 14 hari.
2. Jalankan `npm test` (tes konfigurasi akan gagal kalau ada yang tidak masuk akal), lalu deploy.
3. Begitu tanggal baru berlaku, pop-up muncul dan penjualan ditutup **saat itu juga**. Karena itu jangan memilih tanggal kurang dari 30 hari ke depan: janji ke pengguna adalah minimal 30 hari.
4. Kirim email ke semua pengguna terdaftar (lihat bawah) dan balas permintaan refund dari pembeli dalam 45 hari terakhir.
5. Perbarui teks di bagian "Status" halaman Tentang jika perlu (tanggal diambil otomatis dari konfigurasi).

### Mengirim email ke pengguna

- Daftar email: Supabase Dashboard -> Authentication -> Users (atau SQL: `select email from auth.users;`).
- Kirim lewat Brevo (kampanye atau email transaksional). Cek batas kirim harian paket Brevo-mu.
- Isi email: tanggal akhir, bahwa penjualan sudah ditutup, aturan refund 45 hari, cara menghubungi lewat WhatsApp, dan (kalau sudah ada) cara mengunduh materi.

## Daftar tindakan manual saat/ setelah tanggal akhir

Lakukan **berurutan**. Domain terakhir, supaya tidak ada celah di mana domain sudah lepas tapi data masih ada.

- [ ] Proses semua pembayaran yang masih `pending` di `/admin/purchases` (setujui atau tolak/refund). Setelah tanggal akhir halaman admin tidak bisa dibuka lagi, jadi selesaikan sebelumnya.
- [ ] Ekspor tabel `purchases` (Supabase -> Table Editor -> Export CSV) dan simpan di komputermu untuk pembukuan.
- [ ] Hapus file di bucket Storage `payment-proofs` (kalau masih ada).
- [ ] **Hapus project Supabase** (Project Settings -> General -> Delete project). Ini menghapus semua akun dan data pengguna, sesuai janji di halaman Tentang.
- [ ] Hapus env var Supabase di Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Brevo: hapus SMTP key, hapus domain/sender, atau tutup akun.
- [ ] Opsional: jadikan materi repositori publik di GitHub, lalu isi `LEGACY_URL` di `lib/site-config.ts` supaya halaman perpisahan menautkannya.
- [ ] Vercel: biarkan project aktif agar halaman perpisahan tetap bisa dibuka di alamat gratis `*.vercel.app` (cek kebijakan Vercel terbaru untuk project tidak aktif), atau hapus kalau tidak diinginkan.
- [ ] name.com: matikan perpanjangan otomatis `pymula.live` dan biarkan habis pada 17 Oktober 2027. Alamat `halo@pymula.live` ikut mati; WhatsApp tetap menjadi kontak.
- [ ] Sampai 30 hari setelah tanggal akhir: layani klaim refund lewat WhatsApp.

## Pengingat keputusan

Pasang pengingat kalender di **Januari, April, dan Juli 2027**: "Masih sanggup memelihara PyMula sampai Oktober 2027? Kalau tidak, ubah `SERVICE_END_ISO` (minimal 30 hari ke depan)."

## Mencoba tampilan tiap keadaan secara lokal

Ubah `SERVICE_END_ISO` sementara, jalankan `npm run dev`, lalu **kembalikan sebelum commit**:

- sekitar 20 hari ke depan: keadaan "notice" (pop-up, penjualan ditutup);
- tanggal di masa lalu: keadaan "ended" (halaman perpisahan di semua alamat).

## Keterbatasan yang diketahui

- Penutupan penjualan dijaga di tampilan dan di halaman beli, tetapi tidak di database. Orang yang memanggil API langsung masih bisa membuat catatan `pending` setelah penjualan ditutup. Jangan menyetujuinya; tolak dan kembalikan uangnya kalau ada.
- Halaman perpisahan berusaha tetap tersedia di alamat gratis Vercel, tetapi itu bergantung pada kebijakan Vercel, bukan janji dari kami.
