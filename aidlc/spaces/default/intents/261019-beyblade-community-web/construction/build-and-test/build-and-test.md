# Build & Test — Website Komunitas Beyblade

> Fase: Construction · Stage: Build & Test
> Strategi uji: e2e untuk alur utama (project.md) + unit test untuk logika kritis (perhitungan poin). Sebagian e2e butuh deployment Google, jadi dibagi menjadi otomatis (lokal) dan manual (pasca-deploy).

## 1. Build / Verifikasi Statis
- Front-end & Apps Script tanpa build step (vanilla JS). Verifikasi sintaks seluruh file JS + Code.gs/points.js via `node --check` → semua lolos.
- Refactor: logika poin diekstrak ke `apps-script/points.js` (modul murni) agar dapat diuji di Node tanpa dependensi Google. `Code.gs` memakai fungsi dari file tersebut (shared global scope di Apps Script).

## 2. Unit Test Otomatis (dijalankan, PASS)
- Perkakas: Node built-in test runner (`node --test`), tanpa dependensi eksternal.
- File: `test/points.test.js`. Perintah: `npm test`.
- **Hasil: 12/12 PASS.**
- Cakupan (mengikat FR3.2 + domain §4):
  - `bracketOf` batas bracket (30/31/59/60) benar.
  - Tabel `POINTS` cocok persis tabel referensi implementasi.
  - Poin podium 1–8 tiap bracket; rank>8 = 0.
  - Attendance saat hadir.
  - Progress to topcut DIBATALKAN untuk rank 1–4 (aturan bintang); ditambahkan untuk rank>4.
  - Monarch tiap bracket.
  - Skenario gabungan (juara 1 bracket C hadir+monarch; rank 6 bracket B hadir+topcut).
  - Fleksibilitas truthy (boolean/string/number) & pembulatan 2 desimal.

## 3. E2E Otomatis (Playwright, mode mock) — dijalankan, PASS
- Perkakas: Playwright `1.52.0` (dipin karena mesin dev macOS 12). File di `e2e/`.
- Mode mock: server statis lokal (`tools/serve.js`) menyajikan `docs/`; panggilan Apps Script di-rute ke mock (`e2e/fixtures/mockApi.js`); config.js & GIS di-stub (`e2e/fixtures/setup.js`); sesi member/admin disuntik ke sessionStorage (bypass login Google).
- Proyek: `desktop-chromium` + `mobile` (Pixel 5) → uji responsif N7.1.
- **Hasil: 28/28 PASS** (14 spec × 2 proyek), 0 gagal.
- Cakupan: alur publik (home/event/leaderboard tanpa email/membership), member (login header, daftar event, profil, edit, guard), admin (panel, deteksi bracket D1, validasi Monarch tunggal D3, submit hasil FR9.1, approval member D5).
- Catatan: 2 kegagalan awal pada proyek mobile (assertion `toBeVisible` pada link nav di dalam hamburger yang collapse) diperbaiki menjadi cek kelas role-visibility — bug test, bukan bug app.

## 4. E2E Manual (pasca-deploy) — checklist
Lihat `e2e-manual-checklist.md`. Mencakup alur yang HANYA bisa diuji terhadap Google nyata: login Google (tak dapat diotomasi andal), otorisasi admin server-side (NFR1 — tidak teruji di mode mock), tulis Sheets, idempotensi end-to-end.

## 4. Keterbatasan yang Jujur
- E2E penuh (login Google + tulis spreadsheet + verifikasi otorisasi server-side) TIDAK dapat dijalankan di environment ini karena butuh kredensial Google & deployment nyata. Diverifikasi manual oleh pemilik setelah setup (README §Setup).
- Unit test hanya mencakup logika poin murni; perilaku I/O spreadsheet & verifikasi token diuji lewat e2e manual.

## 5. Traceability
- Unit test → FR3.2, domain-design §4, leaderboard-point-distribution.md.
- E2E otomatis (mock) → FR1.1, FR2.1, FR2.2, FR3.1, FR4.1, FR6.1/6.2, FR9.1, D1, D3, D5, N7.1, NFR6.
- E2E manual (nyata) → FR5.1/5.2, FR9.2, FR10.2, NFR1 (otorisasi server-side), N3.1, N5.
