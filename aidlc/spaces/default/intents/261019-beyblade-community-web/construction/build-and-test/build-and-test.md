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

## 3. E2E Manual (pasca-deploy) — checklist
Lihat `e2e-manual-checklist.md`. Mencakup alur yang butuh Google (login, tulis Sheets) dan verifikasi NFR terukur (otorisasi admin server-side, idempotensi, cache TTL, responsif).

## 4. Keterbatasan yang Jujur
- E2E penuh (login Google + tulis spreadsheet + verifikasi otorisasi server-side) TIDAK dapat dijalankan di environment ini karena butuh kredensial Google & deployment nyata. Diverifikasi manual oleh pemilik setelah setup (README §Setup).
- Unit test hanya mencakup logika poin murni; perilaku I/O spreadsheet & verifikasi token diuji lewat e2e manual.

## 5. Traceability
- Unit test → FR3.2, domain-design §4, leaderboard-point-distribution.md.
- E2E manual → FR2.2, FR4.2, FR5.2, FR6.2, FR9.2, FR10, NFR1/N3/N5/N7.
