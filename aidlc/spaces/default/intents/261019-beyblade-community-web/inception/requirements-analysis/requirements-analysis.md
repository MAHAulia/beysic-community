# Requirements Analysis — Website Komunitas Beyblade

> Fase: Inception · Stage: Requirements Analysis
> Setiap requirement testable (pass/fail jelas), tertelusur ke artefak Ideation, dan tanpa bahasa ambigu. Acceptance criteria memakai Given/When/Then.

## Aktor
- **Pengunjung** — publik, tanpa login.
- **Member** — login Google, punya profil.
- **Admin** — email ada di whitelist spreadsheet.
- **Sistem** — website + Apps Script Web App.

---

## F1 — Home Page

**FR1.1** Pengunjung dapat melihat informasi komunitas, foto event, dan pengumuman di home page.
- Given pengunjung membuka home page, When halaman dimuat, Then tampil konten komunitas, galeri foto event, dan daftar pengumuman terbaru dari spreadsheet.
**FR1.2** Admin dapat mengubah konten home page (pengumuman/berita, foto) lewat halaman pengelolaan.
- Given admin login & buka pengelolaan home, When admin menyimpan perubahan konten, Then konten home page ter-update sesuai data terbaru di spreadsheet.
Trace: [REQ1][Q7]

## F2 — Event

**FR2.1** Pengunjung/member dapat melihat daftar event upcoming dan ongoing.
- Given ada data event di spreadsheet, When halaman event dimuat, Then event dikelompokkan "upcoming" dan "ongoing" sesuai tanggalnya.
**FR2.2** Pengunjung/member dapat mendaftar event lewat formulir.
- Given event berstatus menerima pendaftaran, When pengguna mengisi & submit formulir pendaftaran, Then data pendaftaran tersimpan di spreadsheet dan pengguna melihat konfirmasi berhasil.
**FR2.3** Admin dapat membuat/mengubah event.
- Given admin login, When admin menyimpan event baru/edit, Then event tampil di halaman event sesuai data.
Trace: [REQ2][Q7]

## F3 — Leaderboard

**FR3.1** Siapa pun dapat melihat leaderboard member berdasar akumulasi poin.
- Given ada data poin, When leaderboard dimuat, Then member terurut dari poin tertinggi ke terendah.
**FR3.2** Poin dihitung sesuai aturan di `leaderboard-point-distribution.md` (remap bracket mulai "Up to 30", nilai bagian 60–90).
- Given hasil event dengan jumlah peserta & peringkat tertentu, When poin dihitung, Then nilai poin tiap kategori (Podium 1–8, Attendance, Progress to topcut, Monarch) sama dengan tabel implementasi; Progress to topcut = 0 jika pemain finis Podium 1–4.
Trace: [REQ3], leaderboard-point-distribution.md

## F4 — Membership

**FR4.1** Pengunjung dapat melihat info pendaftaran & benefit membership.
- Given pengunjung buka halaman membership, When halaman dimuat, Then tampil info benefit dan cara daftar.
**FR4.2** Pengunjung dapat mengajukan signup member.
- Given pengunjung mengisi form signup, When submit, Then data calon member tersimpan di spreadsheet untuk diproses admin.
Trace: [REQ4]

## F5 — Login Google

**FR5.1** Member & admin dapat login dengan akun Google.
- Given pengguna klik login, When autentikasi Google berhasil, Then sistem mengenali pengguna (member atau admin) berdasarkan emailnya.
**FR5.2** Hak admin ditentukan dari whitelist email di spreadsheet, divalidasi server-side.
- Given email login tidak ada di whitelist admin, When pengguna mencoba akses fitur admin, Then akses ditolak oleh Apps Script (bukan hanya disembunyikan di UI).
Trace: [REQ5][Q9][Q10]

## F6 — Profil Member

**FR6.1** Member punya profil berisi foto, latest deck, top blade, dan achievement.
- Given member login & punya data profil, When buka profil, Then tampil foto (URL), latest deck, top blade, dan daftar achievement.
**FR6.2** Member dapat memperbarui latest deck, top blade, dan foto (URL).
- Given member mengedit profil, When simpan, Then data profil ter-update di spreadsheet.
Trace: [REQ6]

## F7 — Penyimpanan Data

**FR7.1** Semua data (member, event, pendaftaran, leaderboard, profil, achievement, whitelist admin) disimpan di Google Spreadsheet.
- Given operasi baca/tulis apa pun, When dijalankan, Then sumber/kuil datanya adalah spreadsheet via Apps Script (penulis tunggal).
Trace: [REQ7][Q9]

## F8 — Hosting

**FR8.1** Website di-deploy & dapat diakses publik via GitHub Pages.
- Given build front-end statis, When di-deploy ke GitHub Pages, Then URL publik memuat website dengan benar.
Trace: [REQ8]

## F9 — Halaman Pengelolaan (Admin)

**FR9.1** Admin dapat mengelola home page, event, input poin leaderboard dari hasil event, dan pendaftaran member baru.
- Given admin login, When admin input hasil event (peserta, peringkat, flag topcut/monarch), Then sistem menghitung poin per pemain sesuai aturan dan menuliskannya ke leaderboard.
**FR9.2** Operasi input poin bersifat idempoten.
- Given hasil event yang sama di-submit dua kali, When diproses, Then poin tidak terhitung ganda.
Trace: [REQ9][Q10], MANDATED idempotensi

## F10 — Achievement Otomatis

**FR10.1** Pemenang event otomatis tercatat achievement-nya ke profil.
- Given admin menyimpan hasil event dengan pemenang, When diproses, Then achievement terkait tercatat di profil pemenang tanpa input manual tambahan.
**FR10.2** Pencatatan achievement idempoten.
- Given hasil event yang sama diproses ulang, When dijalankan, Then achievement tidak terduplikasi.
Trace: [REQ10], MANDATED idempotensi

---

## Non-Functional Requirements

**NFR1 — Keamanan**: Semua otorisasi admin & kepemilikan data divalidasi di Apps Script (server-side); input front-end tidak dipercaya. Pass: percobaan akses admin oleh non-admin ditolak di server. Trace: FORBIDDEN#1, MANDATED#1.
**NFR2 — Rahasia**: Tidak ada secret/kredensial di repo publik atau front-end. Pass: audit repo tidak menemukan client secret/token. Trace: FORBIDDEN#2.
**NFR3 — Kuota/Performa**: Data read di-cache di klien untuk menekan panggilan Apps Script. Pass: muat ulang halaman dalam periode cache tidak memicu panggilan Apps Script baru. Trace: MANDATED#3.
**NFR4 — Biaya**: Hanya memakai layanan gratis (GitHub Pages, Google gratis dalam kuota). Pass: tidak ada komponen berbayar. Trace: [REQ8], feasibility.
**NFR5 — Konsistensi data**: Apps Script penulis tunggal; operasi poin & achievement idempoten. Pass: submit ganda tidak menggandakan data. Trace: FORBIDDEN#3, MANDATED#2.
**NFR6 — Privasi**: Data pribadi member tidak tampil ke publik tanpa izin. Pass: halaman publik tidak menampilkan email member. Trace: FORBIDDEN#4.
**NFR7 — Responsif**: Website dapat digunakan di layar mobile & desktop (tanpa aplikasi native). Pass: layout terbaca & fungsional pada lebar viewport mobile umum. Trace: [Q8-B].

---

## Out of Scope (ditegaskan ulang)
Pembayaran online, aplikasi mobile native, notifikasi email/WA otomatis, chat/forum. Trace: [Q8].

## Open Questions (dibawa ke domain-design)
- [open] Batas atas pasti tiap bracket partisipan leaderboard ("Up to 30 / 31–59 / 60–Max" — konfirmasi final).
- [open] Definisi "topcut" (jumlah pemain lolos) untuk bonus Progress to topcut.
- [open] Jumlah penerima Monarch per event (tepat satu atau lebih).
- [open] Aturan akumulasi poin lintas event (total vs. N event terbaik).
- [open] Alur approval signup member baru (otomatis vs. perlu persetujuan admin).
