# NFR Requirements — Website Komunitas Beyblade

> Fase: Construction · Stage: NFR Requirements
> Merinci NFR1–NFR7 (requirements-analysis) menjadi target konkret & terukur dengan metode verifikasi. Mengikat ke Forbidden/Mandated di project.md. Target bersifat konservatif sesuai skala komunitas.

## NFR1 — Keamanan & Otorisasi
- **N1.1** Setiap action admin memverifikasi email pemanggil terhadap `AdminWhitelist` di Apps Script sebelum operasi apa pun. 
  - Verifikasi (e2e): login sebagai non-admin → panggil `admin.*` → respons `{ok:false, error:'forbidden'}`, tidak ada perubahan data.
- **N1.2** idToken Google diverifikasi server-side (signature + audience + expiry) sebelum dipercaya.
  - Verifikasi: token palsu/kedaluwarsa ditolak.
- **N1.3** Member hanya bisa mengubah data miliknya sendiri (profile.update terikat ke email token).
  - Verifikasi (e2e): member A tidak dapat mengubah profil member B.
- Trace: FORBIDDEN#1, MANDATED#1, FR5.2.

## NFR2 — Manajemen Rahasia
- **N2.1** Tidak ada OAuth client secret / API key / token statis di repo publik atau kode front-end.
  - Verifikasi: grep repo untuk pola secret → nihil; konfigurasi sensitif hanya di Apps Script properties.
- **N2.2** URL Web App Apps Script boleh publik, tetapi semua operasi sensitif tetap butuh token tervalidasi.
- Trace: FORBIDDEN#2.

## NFR3 — Kuota & Performa
- **N3.1** Read publik (home, events, leaderboard) di-cache di klien (sessionStorage) dengan **TTL 60 detik**; dalam TTL tidak ada panggilan Apps Script baru.
  - Verifikasi (e2e): muat ulang halaman dalam 60 dtk → network tidak memanggil Apps Script untuk data yang sama.
- **N3.2** Operasi tulis admin membatalkan (invalidate) cache terkait agar data segar tampil.
- **N3.3** Target waktu muat data awal halaman ≤ **3 detik** pada koneksi broadband umum (indikatif, bukan SLA keras).
- **N3.4** Operasi batch (mis. submit hasil event) satu panggilan untuk banyak baris, bukan per-baris, demi hemat kuota.
- Trace: MANDATED#3, feasibility (kuota Google).

## NFR4 — Biaya
- **N4.1** Hanya layanan gratis: GitHub Pages, Google (Sheets/Apps Script/Drive) dalam kuota gratis. Tidak ada komponen berbayar.
  - Verifikasi: tinjau dependensi & layanan → semua gratis.
- Trace: [REQ8], feasibility.

## NFR5 — Konsistensi Data
- **N5.1** Apps Script adalah satu-satunya penulis spreadsheet.
- **N5.2** `admin.results.submit` & pembuatan achievement bersifat idempoten (UPSERT by key) dan dibungkus LockService.
  - Verifikasi (e2e): submit hasil event yang sama 2x → jumlah baris EventResults & Achievements tidak bertambah pada submit kedua; poin akhir identik.
- Trace: FORBIDDEN#3, MANDATED#2, FR9.2, FR10.2.

## NFR6 — Privasi
- **N6.1** Halaman publik tidak menampilkan email atau kontak pribadi member.
  - Verifikasi: inspeksi leaderboard & profil publik → tidak ada email/kontak.
- **N6.2** Data kontak pendaftaran event hanya dapat dilihat admin.
- Trace: FORBIDDEN#4.

## NFR7 — Responsif & Aksesibilitas
- **N7.1** Layout fungsional pada viewport mobile (lebar ~360px) hingga desktop; navigasi jadi hamburger di mobile.
  - Verifikasi (e2e): render di viewport 360px dan 1280px → konten terbaca, tidak ada overflow horizontal.
- **N7.2** Elemen interaktif punya label/alt yang sesuai (praktik aksesibilitas dasar). Validasi penuh butuh uji manual dengan teknologi bantu.
- Trace: FR8 (hosting), [Q8-B].

## NFR8 — Ketersediaan & Degradasi
- **N8.1** Jika Apps Script gagal/kuota habis, front-end menampilkan pesan ramah dan tetap merender data cache bila ada (degradasi anggun).
  - Verifikasi (e2e): simulasikan error API → UI menampilkan pesan "coba lagi", tidak crash.

## Ringkasan Target Terukur
| NFR | Target kunci | Metode verifikasi |
|---|---|---|
| N3.1 | Cache TTL 60 dtk | e2e network check |
| N3.3 | Muat awal ≤ 3 dtk (indikatif) | pengukuran manual |
| N5.2 | Idempoten submit ganda | e2e |
| N1.1 | Admin ditolak server-side | e2e |
| N7.1 | Mobile 360px tanpa overflow | e2e |

## Traceability
Semua NFR tertelusur ke NFR1–7 requirements-analysis dan aturan Forbidden/Mandated project.md. N8 baru ditambahkan sebagai turunan risiko kuota di feasibility.
