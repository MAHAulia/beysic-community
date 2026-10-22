# Unit Test Instructions — UI Re-skin

Scope refactor, strategi Minimal: **tidak menambah test baru**. Kewajiban: suite yang ada tetap **hijau** setelah re-skin (regresi). Methodology test-after; runner sudah tersedia (langkah runner = verifikasi, bukan bootstrap).

## Framework & Konfigurasi
- **Unit**: Node built-in test runner (`node --test`). Tanpa konfigurasi tambahan.
- **E2E**: Playwright (`@playwright/test@^1.52.0`), konfigurasi `playwright.config.js`. Chromium via `npm run e2e:install` (sekali).

## Perintah (unit-scoped)

Logika poin (regresi — harus tetap hijau):
```
node --test test/points.test.js
```

E2E per-spec (deterministik, mock; jalankan yang relevan dengan perubahan markup):
```
npx playwright test e2e/public.spec.js
npx playwright test e2e/member.spec.js
npx playwright test e2e/admin.spec.js
```

(Prasyarat e2e sekali: `npm install` lalu `npm run e2e:install`.)

## Target Coverage
Tidak ada floor coverage baru (refactor). Target: semua test eksisting lulus. Logika poin (`computePoints`/`bracketOf`) wajib tetap cocok tabel referensi.

## Mocking/Stubbing
E2E memakai mode mock bawaan (server statis lokal menyajikan `docs/`, panggilan Apps Script di-mock, sesi member/admin disuntik). Tidak perlu kredensial Google.

## Pengelolaan Data Test
Fixture e2e di `e2e/fixtures/`. Tidak diubah oleh re-skin kecuali selector yang perlu disesuaikan agar tetap menguji perilaku yang sama.

## Catatan untuk re-skin
Jika perubahan markup presentasional memutus selector e2e, **perbarui selector** (atau tambah `data-testid`) agar uji tetap memverifikasi perilaku yang sama — JANGAN melemahkan atau menonaktifkan test untuk membuatnya lulus.
