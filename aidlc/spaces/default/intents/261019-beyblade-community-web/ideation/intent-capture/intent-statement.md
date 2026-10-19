# Intent Statement — Website Komunitas Beyblade

> Fase: Ideation · Stage: Intent Capture & Framing

## Problem Statement

Komunitas Beyblade belum memiliki satu tempat terpusat untuk informasi komunitas, pendaftaran event, dan peringkat pemain. Akibatnya informasi tersebar, pendaftaran event sulit dilacak, dan peringkat pemain belum tercatat rapi dan transparan. Website ini menjadi pusat informasi, pendaftaran event, sekaligus leaderboard pemain. [Q1][Q4]

## Target Customer

Website melayani tiga kelompok pengguna: publik umum (pengunjung/calon anggota), anggota komunitas (member/pemain), dan admin/pengurus komunitas. [Q2][Q5]

- Pengunjung/calon member memperoleh informasi komunitas dan cara bergabung. [Q2][Q5]
- Member/pemain mendapat profil pribadi (foto, latest deck, top blade, achievement) dan posisi di leaderboard. [Q2][Q5]
- Admin/pengurus mengelola konten, event, input poin, dan pendaftaran member. [Q2][Q5]

## Success Metrics

Keberhasilan versi pertama diukur dari: [Q3]

- Website live di GitHub Pages dan seluruh fitur inti berfungsi (home, event + pendaftaran, leaderboard, membership, login Google, profil member, halaman pengelolaan admin). [Q3]
- Leaderboard ter-update dari hasil event/tournament, dan achievement pemenang tercatat otomatis ke profil pemain. [Q3]
- Jumlah pendaftaran event dan member baru lewat website meningkat dibanding cara manual sebelumnya. [Q3]

## Initiative Trigger

Komunitas sedang bertumbuh dan akan ada rangkaian event/tournament yang membutuhkan mekanisme pendaftaran dan leaderboard yang rapi. [Q4]

## Initial Scope Signal

- **Workflow-selected scope:** `classic` (workflow-selected). [scope]
- **Batasan produk versi pertama (dikonfirmasi pengguna):** rilis pertama TIDAK mencakup pembayaran online/biaya pendaftaran, aplikasi mobile native, notifikasi email/WhatsApp otomatis, dan chat/forum antar member. Seluruh 10 fitur inti pada REQUIREMENT.MD tetap termasuk dalam rilis pertama. [Q8]

## Catatan Pendekatan Teknis (sinyal awal)

- Karena situs dihosting statis di GitHub Pages (tanpa server), login Google dan penyimpanan/penulisan data ke Google Spreadsheet diarahkan melalui Google Apps Script Web App sebagai jembatan. Detail arsitektur diputuskan pada fase inception/construction. [Q9]
- Hak akses admin ditentukan dari daftar email admin (whitelist) yang disimpan di spreadsheet. [Q10]

## Referensi Distribusi Poin Leaderboard

Aturan poin leaderboard mengacu pada papan distribusi poin BeySic (label papan asli pada foto referensi bertuliskan "BEYJAXEL", di-rebrand menjadi BeySic). Detail tabel, kategori poin (Podium 1–8, Attendance, Progress to topcut, Monarch), serta aturan remap bracket partisipan untuk implementasi direkam di dokumen terpisah:

#[[file:leaderboard-point-distribution.md]]

Catatan implementasi (dikonfirmasi pengguna): pada referensi, distribusi poin penuh (termasuk Podium 5–8) baru muncul mulai kolom partisipan `60–69`. Pada implementasi, bracket partisipan digeser agar distribusi penuh tersebut berlaku untuk turnamen kecil mulai dari "Up to 30", memakai nilai poin dari bagian `60–90` referensi (kolom `60–69` / `70–79` / `80–99`).

## Assumptions & Open Questions

> Status: seluruh asumsi di bawah DITERIMA oleh pengguna. Detailnya tetap akan dirinci pada stage desain yang disebut, namun arah/keputusan sudah disepakati.

- [accepted] Detail skema Google Spreadsheet (tabel members, events, leaderboard, profiles, achievements) dirancang pada stage domain-design.
- [accepted] Aturan penentuan poin leaderboard dari hasil event/tournament mengikuti referensi di `leaderboard-point-distribution.md`; perincian final (batas bracket, akumulasi lintas event) di stage requirements-analysis / functional-design.
- [accepted] Mekanisme OAuth Google dan pengamanan endpoint Apps Script dirinci pada stage infrastructure-design/nfr-requirements.
