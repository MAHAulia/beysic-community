# Refined Mockups — Website Komunitas Beyblade

> Fase: Inception · Stage: Refined Mockups
> Wireframe low-fidelity berbasis teks (ASCII) untuk tiap halaman. Mengacu ke requirements-analysis (FR). Responsif mobile & desktop (NFR7). Istilah bonus khusus: **Monarch**.

## Navigasi Global

Header di semua halaman:
```
+---------------------------------------------------------------+
| [LOGO Beysic]   Home  Event  Leaderboard  Membership   [Login]|
+---------------------------------------------------------------+
```
- Saat login → tombol [Login] berubah jadi [Foto ▾] (menu: Profil, Logout, dan "Admin" bila email di whitelist).
- Di mobile: menu jadi hamburger (≡).

---

## 1. Home Page — FR1.1 / FR1.2
```
+---------------------------------------------------------------+
| HERO: Nama komunitas + tagline + [Gabung Jadi Member]         |
+---------------------------------------------------------------+
| Tentang Komunitas (teks dikelola admin)                       |
+---------------------------------------------------------------+
| Pengumuman / Berita Terbaru                                   |
|  - [tgl] Judul pengumuman ...                                 |
|  - [tgl] Judul pengumuman ...                                 |
+---------------------------------------------------------------+
| Galeri Foto Event   [img][img][img][img]                      |
+---------------------------------------------------------------+
```

## 2. Event — FR2.1 / FR2.2
```
+---------------------------------------------------------------+
| Tab:  [ Ongoing ]  [ Upcoming ]                               |
+---------------------------------------------------------------+
| Kartu Event                                                   |
|  Nama Event | Tanggal | Lokasi | Status                       |
|  [Lihat Detail]  [Daftar]                                     |
+---------------------------------------------------------------+

Modal/Halaman "Daftar Event":
+-----------------------------------------+
| Form Pendaftaran Event: <Nama Event>    |
|  Nama pemain: [__________]              |
|  Kontak:      [__________]              |
|  (field lain sesuai kebutuhan)          |
|  [Batal]            [Kirim Pendaftaran] |
+-----------------------------------------+
  -> sukses: "Pendaftaran berhasil" (FR2.2)
```

## 3. Leaderboard — FR3.1 / FR3.2
```
+---------------------------------------------------------------+
| LEADERBOARD                       Filter: [Semua Event ▾]     |
+------+---------------------+---------+---------+--------+------+
| Rank | Member              | Poin    | Event   | Podium | Mon. |
+------+---------------------+---------+---------+--------+------+
| 1    | [foto] NamaA        | 42.5    | 6       | 3x     | 2    |
| 2    | [foto] NamaB        | 38.0    | 5       | 2x     | 1    |
| ...  |                     |         |         |        |      |
+------+---------------------+---------+---------+--------+------+
  (urut poin desc; kolom "Mon." = jumlah penghargaan Monarch)
```

## 4. Membership — FR4.1 / FR4.2
```
+---------------------------------------------------------------+
| Kenapa Jadi Member? (benefit list)                            |
|  - Tercatat di leaderboard                                    |
|  - Profil & achievement                                       |
|  - Ikut event resmi                                           |
+---------------------------------------------------------------+
| Cara Daftar + [Daftar Sekarang]                               |
+-----------------------------------------+
| Form Signup Member                      |
|  Nama:  [__________]                    |
|  Email (Google): terisi dari login      |
|  (field profil awal)                    |
|  [Kirim Pendaftaran]                     |
+-----------------------------------------+
  -> data calon member tersimpan utk diproses admin (FR4.2)
```

## 5. Login Google — FR5.1 / FR5.2
```
+-----------------------------------------+
|  Masuk ke Beysic                        |
|   [  Lanjut dengan Google  ]            |
|  (admin dikenali otomatis dari whitelist|
|   email, divalidasi server-side)        |
+-----------------------------------------+
```

## 6. Profil Member — FR6.1 / FR6.2
```
+---------------------------------------------------------------+
| [ FOTO ]   Nama Member            [Edit Profil]               |
|            Posisi Leaderboard: #3                             |
+---------------------------------------------------------------+
| Latest Deck:  <teks/daftar>                                   |
| Top Blade:    <teks>                                          |
+---------------------------------------------------------------+
| Achievements (otomatis dari event — FR10):                    |
|  🏆 Juara 1 - Event X (tgl)                                   |
|  🏆 Monarch - Event Y (tgl)                                   |
+---------------------------------------------------------------+

Mode Edit (FR6.2): foto (URL), latest deck, top blade dapat diubah.
```

## 7. Halaman Pengelolaan Admin — FR9 / FR10
```
+---------------------------------------------------------------+
| ADMIN PANEL (hanya email whitelist — FR5.2)                   |
| Sidebar: Home | Event | Input Poin | Member                   |
+---------------------------------------------------------------+
| > Input Poin Leaderboard (dari hasil event)                   |
|   Pilih Event: [________ ▾]                                   |
|   Total Peserta: [ 48 ]  -> bracket terdeteksi: "31–59"       |
|   Tabel hasil:                                                |
|   +------+-----------+--------+---------+----------+          |
|   | Rank | Member    | Topcut | Monarch | Hadir    |          |
|   | 1    | [member▾] | [x]    | [ ]     | [x]      |          |
|   | 2    | [member▾] | [x]    | [x]     | [x]      |          |
|   +------+-----------+--------+---------+----------+          |
|   [Hitung & Simpan Poin]                                      |
|     -> poin dihitung sesuai leaderboard-point-distribution    |
|     -> achievement pemenang tercatat otomatis (FR10)          |
|     -> idempoten: submit ulang tidak menggandakan (FR9.2)     |
+---------------------------------------------------------------+
| > Kelola Event   : buat/edit event (FR2.3)                    |
| > Kelola Home    : edit pengumuman & foto (FR1.2)             |
| > Member         : proses pendaftaran member baru (FR4.2)     |
+---------------------------------------------------------------+
```

---

## Catatan Desain
- Semua data diambil via Apps Script; read di-cache di klien (MANDATED#3).
- Tombol/fitur admin disembunyikan utk non-admin DAN ditolak server-side (NFR1).
- Email member tidak ditampilkan di halaman publik (NFR6).
- Layout kolom tunggal di mobile (NFR7).

## Traceability
Tiap mockup diberi label FR terkait di judul section. Perhitungan poin & bracket mengacu `leaderboard-point-distribution.md`.

## Open Questions (dibawa ke domain-design)
- Field pasti form pendaftaran event & signup member.
- Apakah "Mon." (Monarch) tampil sebagai kolom leaderboard atau hanya di profil.
- Deteksi bracket otomatis dari total peserta — konfirmasi batas bracket final.
