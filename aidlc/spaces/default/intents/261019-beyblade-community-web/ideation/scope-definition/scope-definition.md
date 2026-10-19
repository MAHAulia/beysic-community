# Scope Definition — Website Komunitas Beyblade

> Fase: Ideation · Stage: Scope Definition
> Mengunci lingkup rilis pertama (MVP) berdasarkan intent-statement, stakeholder-map, dan feasibility-assessment. Tingkat problem/opportunity — tanpa detail implementasi.

## 1. Tujuan Rilis Pertama

Menyediakan satu tempat terpusat untuk informasi komunitas, pendaftaran event, dan leaderboard pemain, yang live di GitHub Pages dengan data di Google Spreadsheet. [Q1][Q3]

## 2. In Scope (Rilis Pertama)

Seluruh 10 fitur inti REQUIREMENT.MD termasuk [Q8]:

| # | Fitur | Cakupan Rilis Pertama | Source |
|---|---|---|---|
| F1 | Home page | Info komunitas, foto event, pengumuman/berita yang dikelola admin | [Q7][REQ1] |
| F2 | Event | Daftar upcoming & ongoing event, formulir pendaftaran event | [REQ2] |
| F3 | Leaderboard | Peringkat member dari akumulasi poin event, mengikuti `leaderboard-point-distribution.md` | [REQ3] |
| F4 | Membership | Halaman info pendaftaran & benefit, alur signup member | [REQ4] |
| F5 | Login Google | Autentikasi member & admin via Google | [Q9][REQ5] |
| F6 | Profil Member | Foto, latest deck, top blade, achievement | [REQ6] |
| F7 | Penyimpanan data | Semua data di Google Spreadsheet | [Q9][REQ7] |
| F8 | Hosting | GitHub Pages (gratis) | [REQ8] |
| F9 | Halaman Pengelolaan (Admin) | Kelola home page, kelola event, input poin leaderboard dari hasil event, pendaftaran member baru | [Q10][REQ9] |
| F10 | Achievement otomatis | Pemenang event otomatis tercatat achievement-nya ke profil | [REQ10] |

### Aturan lintas-fitur yang masuk scope
- Hak akses admin ditentukan dari whitelist email di spreadsheet, divalidasi server-side. [Q10]
- Perhitungan poin leaderboard memakai remap bracket partisipan (mulai "Up to 30", nilai dari bagian 60–90 referensi). Lihat `leaderboard-point-distribution.md`.
- Jembatan baca/tulis data & login lewat Google Apps Script Web App. [Q9]

## 3. Out of Scope (Ditunda — bukan rilis pertama)

| Item | Alasan | Source |
|---|---|---|
| Pembayaran online / biaya pendaftaran | Daftar dulu tanpa bayar | [Q8-A] |
| Aplikasi mobile native | Cukup website responsif | [Q8-B] |
| Notifikasi email/WhatsApp otomatis | Di luar lingkup rilis pertama | [Q8-C] |
| Chat/forum antar member | Di luar lingkup rilis pertama | [Q8-D] |

## 4. Batasan & Asumsi yang Memengaruhi Scope

- Host statis tanpa backend sejati; semua tulis data via Apps Script (dari feasibility). 
- Operasi dibatasi kuota Google (Apps Script/Sheets); desain harus hemat tulis & pakai caching.
- Foto profil disimpan sebagai URL (Drive) di spreadsheet, bukan upload biner. [assumption]
- Repo publik agar GitHub Pages gratis. [assumption]
- Volume data dalam batas wajar komunitas. [assumption]

## 5. Kriteria Sukses Rilis Pertama (measurable) [Q3]

- Website live di GitHub Pages dan 10 fitur inti berfungsi (home, event+pendaftaran, leaderboard, membership, login Google, profil, admin).
- Leaderboard ter-update dari hasil event; achievement pemenang tercatat otomatis ke profil.
- Pendaftaran event & member baru lewat website dapat dilakukan end-to-end (menggantikan cara manual).

## 6. Dependensi Utama

- Akun Google + Spreadsheet + Google Apps Script Web App ter-deploy.
- Repo GitHub + GitHub Pages aktif.
- Daftar whitelist email admin terisi di spreadsheet.

## 7. Keputusan Scope

**Scope rilis pertama DIKUNCI** pada 10 fitur inti di atas dengan 4 item ditunda. Lanjut ke stage **approval-handoff** untuk persetujuan sebelum masuk fase Inception.

## Assumptions & Open Questions
- [open] Batas atas pasti tiap bracket partisipan leaderboard, definisi topcut, jumlah penerima Alphawolf — dirinci di requirements-analysis/domain-design.
- [assumption] Penyimpanan foto via URL Drive; repo publik; volume data wajar (diwarisi dari feasibility).
