# Beysic — Website Komunitas Beyblade

Website komunitas Beyblade: pusat informasi, pendaftaran event, dan leaderboard pemain. Front-end statis (vanilla JS) dihosting di GitHub Pages, data di Google Spreadsheet, dijembatani Google Apps Script Web App.

Dibangun mengikuti alur AI-DLC (artefak di `aidlc/`).

## Arsitektur

```
Browser (vanilla JS @ GitHub Pages)
   │  fetch GET/POST JSON
   ▼
Google Apps Script Web App (doGet/doPost)  ← penulis tunggal
   ▼
Google Spreadsheet (database) + Drive (foto via URL)
```

## Struktur Repo

```
docs/                 Front-end statis (root GitHub Pages)
  index.html          Shell + nav
  config.js           GAS_WEBAPP_URL, GOOGLE_CLIENT_ID, cache TTL
  styles.css          Tema responsif
  js/                 cache, api, auth (GIS), ui, router, app
  js/pages/           home, event, leaderboard, membership, profile, admin
apps-script/          Backend Apps Script
  Code.gs             API, verifikasi token, CRUD sheet, idempotensi
  points.js           Logika poin murni (dipakai Code.gs & unit test)
  appsscript.json     Konfigurasi Web App
test/                 Unit test (Node built-in test runner)
  points.test.js      Verifikasi algoritma poin vs tabel referensi
aidlc/                Artefak AI-DLC (requirements, desain, dll)
```

## Fitur

- Home, Event + pendaftaran, Leaderboard, Membership + signup, Login Google, Profil member, Admin panel.
- Perhitungan poin leaderboard sesuai distribusi resmi (lihat `aidlc/.../leaderboard-point-distribution.md`).
- Achievement pemenang tercatat otomatis ke profil.

## Setup (langkah deploy)

Mengacu `aidlc/.../construction/infrastructure-design/infrastructure-design.md §7`.

### 1. Spreadsheet
1. Buat satu Google Spreadsheet baru.
2. Catat **Spreadsheet ID** (bagian URL di antara `/d/` dan `/edit`).

### 2. Apps Script
1. Buat proyek Apps Script terikat ke spreadsheet (Extensions → Apps Script), atau proyek standalone.
2. Salin isi `apps-script/Code.gs`, **`apps-script/points.js`** (buat file baru di proyek, mis. `points.gs`), dan `apps-script/appsscript.json`. Kedua file skrip berbagi global scope; `points.js` wajib ada agar perhitungan poin bekerja.
3. Project Settings → Script Properties, tambahkan:
   - `SPREADSHEET_ID` = id spreadsheet
   - `GOOGLE_CLIENT_ID` = OAuth Web client id (lihat langkah 3)
4. Jalankan fungsi `setupSheets()` sekali untuk membuat sheet + header.
5. Isi sheet `AdminWhitelist` dengan email admin (kolom `email`).
6. Deploy → New deployment → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Salin URL `/exec`.

### 3. Google OAuth Client
1. Google Cloud Console → Credentials → Create OAuth client ID → **Web application**.
2. Authorized JavaScript origins: domain GitHub Pages Anda (mis. `https://<user>.github.io`).
3. Salin **Client ID**.

### 4. Front-end
1. Edit `docs/config.js`:
   - `GAS_WEBAPP_URL` = URL `/exec` dari langkah 2.
   - `GOOGLE_CLIENT_ID` = Client ID dari langkah 3.

### 5. GitHub Pages
1. Push repo (branch `main`).
2. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder **/docs**.
3. Tunggu beberapa menit; situs tersedia di URL Pages.

## Pengembangan Lokal

Front-end statis murni; jalankan server statis apa pun dari folder `docs/`, misalnya:

```
python3 -m http.server 8000 --directory docs
```

Catatan: login Google butuh origin yang terdaftar di OAuth client; untuk uji lokal tambahkan `http://localhost:8000` ke Authorized JavaScript origins.

## Keamanan (ringkas)

- Semua otorisasi admin & kepemilikan data divalidasi server-side di Apps Script.
- Tidak ada secret di repo; `GOOGLE_CLIENT_ID` dan URL Web App memang client-side.
- Operasi tulis poin & achievement idempoten (anti double-count), dibungkus LockService.

## Testing

### Unit test (otomatis, tanpa Google)
Algoritma poin leaderboard diuji dengan Node built-in test runner:

```
npm test
```

Memverifikasi `computePoints`/`bracketOf` cocok persis dengan tabel distribusi referensi (FR3.2): bracket, aturan bintang Progress-to-topcut (dibatalkan untuk rank 1–4), Monarch, dan pembulatan.

### E2E otomatis (Playwright, mode mock)
E2e deterministik tanpa Google: server statis lokal menyajikan `docs/`, panggilan Apps Script di-mock, dan sesi member/admin disuntik untuk menguji guard & alur UI. Mencakup desktop + mobile (uji responsif).

```
npm install
npm run e2e:install   # unduh browser Chromium (sekali)
npm run test:e2e      # jalankan semua spec (desktop + mobile)
npm run test:e2e:ui   # mode UI interaktif
```

Spec di `e2e/`:
- `public.spec.js` — home, event, leaderboard (tanpa email), membership
- `member.spec.js` — login header, daftar event, profil, edit profil, guard
- `admin.spec.js` — panel admin, deteksi bracket, validasi Monarch tunggal, submit hasil, approval member

Catatan versi: Playwright dipin ke `1.52.0` karena mesin dev memakai macOS 12 (versi lebih baru menghapus build browser untuk macOS 12). Di CI (Ubuntu) versi apa pun jalan.

### E2E menguji deployment NYATA (opsional)
Arahkan ke URL GitHub Pages hasil deploy untuk menguji front-end nyata (alur publik; login Google tetap manual):

```
E2E_BASE_URL="https://<user>.github.io/<repo>" npm run test:e2e -- public.spec.js
```

### E2E manual (perlu deployment Google)
Alur yang bergantung Google secara penuh (login Google nyata, tulis Sheets, otorisasi admin server-side) diuji manual setelah deploy — login OAuth tidak dapat diotomasi dengan andal. Checklist di `aidlc/.../construction/build-and-test/e2e-manual-checklist.md`.

## Catatan Poin Leaderboard

Bracket partisipan: **Up to 30 / 31–59 / 60–Max**, memakai nilai dari bagian 60–90 referensi resmi. Kategori: Podium 1–8, Attendance, Progress to topcut (dibatalkan bila rank 1–4), dan **Monarch** (satu pemain per event). Detail tabel di `aidlc/.../leaderboard-point-distribution.md`.
