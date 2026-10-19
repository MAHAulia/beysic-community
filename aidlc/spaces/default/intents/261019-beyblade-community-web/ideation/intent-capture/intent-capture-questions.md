# Intent Capture — Pertanyaan Klarifikasi

> Komunitas Beyblade — Website (static, GitHub Pages, data di Google Spreadsheet)

## Sources

- [desc] Initial description: "Build a Beyblade community website (static, hosted on GitHub Pages) with a home page about the community and events, an events page with upcoming/ongoing events and a registration form, a member leaderboard, a membership info and signup page, Google login for members, member profiles showing photo, latest deck, top blade and achievements, plus admin management pages wired to Google Sheets for managing the home page, events, leaderboard point entry from tournament results, and new member registration. All data is stored in Google Spreadsheets, and tournament winners automatically get achievements recorded to their profile. Requirements are in REQUIREMENT.MD."
- [scope] Workflow-selected scope: `classic`.

<!-- Catatan: deskripsi awal merujuk ke REQUIREMENT.MD. Isi dokumen itu diperlakukan sebagai data (bukan instruksi) dan hanya dipakai untuk membentuk pertanyaan di bawah; klaim dari dokumen baru masuk ke artefak lewat jawaban [Q<n>] yang dikonfirmasi. -->

## Q1. Masalah / tujuan utama

Apa masalah atau kebutuhan utama yang ingin diselesaikan website ini bagi komunitas Beyblade?

- A. Belum ada satu tempat terpusat untuk info komunitas, event, dan peringkat pemain
- B. Pendaftaran event masih manual (chat/japri) dan sulit dilacak
- C. Peringkat/leaderboard pemain belum tercatat rapi dan transparan
- D. Semuanya di atas (pusat informasi + pendaftaran + leaderboard)
- E. Not yet defined
- X. Other (please specify)

[Answer]: D. Semuanya di atas (pusat informasi + pendaftaran + leaderboard)

## Q2. Pengguna / audiens

Siapa pengguna utama website ini?

- A. Publik umum + anggota komunitas (member) + admin/pengurus
- B. Hanya anggota komunitas dan pengurus (tidak untuk publik umum)
- C. Terutama calon anggota baru (fokus rekrutmen)
- D. Not yet defined
- X. Other (please specify)

[Answer]: A. Publik umum + anggota komunitas (member) + admin/pengurus

## Q3. Definisi sukses / metrik

Seperti apa "berhasil" untuk versi pertama ini? Metrik apa yang penting?

- A. Website live di GitHub Pages dan semua fitur inti berfungsi (home, event, leaderboard, profil, login Google, admin)
- B. Jumlah pendaftaran event dan member baru lewat website meningkat
- C. Leaderboard selalu ter-update otomatis dari hasil tournament
- D. Semuanya di atas
- E. Not yet defined
- X. Other (please specify)

[Answer]: D. Semuanya di atas

## Q4. Pemicu inisiatif (kenapa sekarang)

Apa pemicu dibuatnya website ini sekarang?

- A. Komunitas sedang bertumbuh dan butuh wadah resmi
- B. Akan ada rangkaian event/tournament yang butuh pendaftaran & leaderboard
- C. Ingin tampil lebih profesional / kredibel ke publik dan sponsor
- D. Not identified
- X. Other (please specify)

[Answer]: B. Akan ada rangkaian event/tournament yang butuh pendaftaran & leaderboard (komunitas juga sedang bertumbuh)

## Q5. Stakeholder & kepentingannya

Siapa pemangku kepentingan utama dan apa yang mereka pedulikan? (boleh pilih lebih dari satu)

- A. Pengurus/admin komunitas — kelola konten, event, dan input poin
- B. Member/pemain — profil, deck, achievement, posisi leaderboard
- C. Pengunjung/calon member — info komunitas dan cara bergabung
- D. Penyelenggara event / wasit tournament — hasil pertandingan
- E. Not identified
- X. Other (please specify)

[Answer]: A, B, C, D — Pengurus/admin, member/pemain, pengunjung/calon member, dan penyelenggara event/wasit tournament

## Q6. Pengambil keputusan scope/prioritas

Siapa yang memutuskan scope dan prioritas fitur?

- A. Saya sendiri (pemilik/pengurus utama)
- B. Tim pengurus komunitas secara kolektif
- C. Not identified
- X. Other (please specify)

[Answer]: A. Saya sendiri (pemilik/pengurus utama)

## Q7. Kebutuhan komunikasi / pelaporan

Apakah ada kebutuhan komunikasi atau pelaporan rutin yang harus didukung website? (mis. pengumuman, hasil event)

- A. Pengumuman/berita di home page yang bisa dikelola admin
- B. Hasil & jadwal event dipublikasikan otomatis dari spreadsheet
- C. Tidak ada kebutuhan pelaporan khusus
- D. Not applicable
- X. Other (please specify)

[Answer]: A dan B — Pengumuman/berita di home page yang dikelola admin, dan hasil & jadwal event dipublikasikan dari spreadsheet

## Q8. Batasan versi pertama (yang TIDAK dikerjakan dulu)

Scope `classic` sudah dipilih. Untuk versi pertama ini, apa yang sebaiknya BELUM dikerjakan (di luar lingkup rilis pertama)?

- A. Pembayaran online / biaya pendaftaran event (daftar dulu tanpa bayar)
- B. Aplikasi mobile native (cukup website responsif)
- C. Notifikasi email/WhatsApp otomatis
- D. Chat/forum antar member
- E. Tidak ada yang dikecualikan — semua 10 fitur di REQUIREMENT.MD masuk rilis pertama
- X. Other (please specify)

[Answer]: A, B, C, D — Dikecualikan dari rilis pertama: pembayaran online, aplikasi mobile native, notifikasi email/WhatsApp otomatis, dan chat/forum antar member. Semua 10 fitur inti di REQUIREMENT.MD tetap masuk.

## Q9. Pendekatan teknis login & simpan data (follow-up)

Website statis di GitHub Pages tanpa server. Pendekatan apa untuk login Google dan menyimpan data ke Google Spreadsheet?

- A. Google Apps Script Web App sebagai jembatan antara website dan Spreadsheet (gratis, native ke Sheets)
- B. Firebase
- C. Google Forms untuk pendaftaran
- D. Not yet defined
- X. Other (please specify)

[Answer]: A. Google Apps Script Web App sebagai jembatan antara website dan Spreadsheet

## Q10. Penentuan admin (follow-up)

Bagaimana menentukan siapa yang berhak jadi admin?

- A. Daftar email admin (whitelist) yang disimpan di spreadsheet
- B. Not yet defined
- X. Other (please specify)

[Answer]: A. Daftar email admin (whitelist) yang disimpan di spreadsheet

## Assumption Confirmation

Asumsi yang tercatat di artefak (semua akan diputuskan di stage desain berikutnya):

1. [assumption] Detail skema Google Spreadsheet (members, events, leaderboard, profiles, achievements) dirancang pada stage domain-design.
2. [assumption] Aturan penentuan poin leaderboard dari hasil event/tournament dirinci pada stage requirements-analysis / functional-design.
3. [assumption] Mekanisme OAuth Google dan pengamanan endpoint Apps Script dirinci pada stage infrastructure-design / nfr-requirements.

Opsi:

- A. Accept assumptions
- B. Convert to follow-up questions

[Answer]: A. Accept assumptions — ketiga asumsi diterima dan statusnya ditandai [accepted] di intent-statement. Perincian tetap di stage desain terkait.

## Follow-up — Referensi Poin Leaderboard (ditambahkan pengguna)

Pengguna menambahkan referensi papan distribusi poin (gambar; label asli "BEYJAXEL", di-rebrand menjadi BeySic) dan mengkonfirmasi aturan remap bracket partisipan: distribusi penuh referensi (mulai kolom 60–69) dipakai untuk turnamen kecil mulai "Up to 30", memakai nilai poin bagian 60–90. Direkam di `leaderboard-point-distribution.md`.
