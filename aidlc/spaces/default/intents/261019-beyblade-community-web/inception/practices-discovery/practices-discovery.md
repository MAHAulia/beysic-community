# Practices Discovery — Website Komunitas Beyblade

> Fase: Inception · Stage: Practices Discovery
> Tujuan: menyepakati praktik kerja, tech stack, testing posture, serta aturan Forbidden/Mandated sebelum requirements & desain. Item yang Anda setujui akan ditulis ke `project.md` (layer project).

## 1. Tech Stack (usulan untuk dikunci)

Diwarisi dari keputusan Ideation (GitHub Pages statis + Apps Script + Sheets):

| Lapisan | Usulan | Alasan |
|---|---|---|
| Front-end | HTML + CSS + JavaScript (vanilla) atau framework ringan statis | Harus build ke statis untuk GitHub Pages; vanilla meminimalkan kompleksitas & dependency. |
| Hosting | GitHub Pages | Gratis, sesuai REQUIREMENT.MD. |
| Backend/API | Google Apps Script Web App | Jembatan ke Sheets + login Google tanpa server. |
| Datastore | Google Spreadsheet | Sesuai REQUIREMENT.MD. |
| Auth | Google (OAuth/Identity) via Apps Script | Login member & admin. |

> Pertanyaan: apakah front-end cukup vanilla JS, atau Anda ingin framework (mis. React/Vite) yang di-build ke statis? (Default usulan: vanilla JS agar sederhana & ringan.)

## 2. Way of Working (usulan)

- Pengembangan bertahap per fitur, mengikuti urutan AIDLC (functional-design → code → test).
- Semua artefak & kode di-commit ke repo (sesuai konvensi AIDLC git integration).
- Branch per fitur, merge setelah review mandiri (tim kecil / pemilik tunggal [Q6]).

## 3. Testing Posture (usulan — Test Strategy: Standard)

- Unit test untuk logika perhitungan poin leaderboard (kritis & rawan error).
- Test manual/end-to-end untuk alur login, pendaftaran event, input poin admin.
- Validasi server-side Apps Script diuji terpisah (akses admin, idempotensi achievement).

> Catatan: tidak menambah test di luar yang disepakati; fokus pada logika kritikal (poin, achievement, akses admin).

## 4. Usulan Aturan FORBIDDEN (NEVER)

1. NEVER mempercayai input/klaim dari front-end untuk otorisasi — validasi admin & kepemilikan data WAJIB di sisi Apps Script.
2. NEVER menyimpan secret/kredensial (OAuth client secret, token) di repo publik atau kode front-end.
3. NEVER menulis ke Spreadsheet dari banyak jalur — Apps Script adalah penulis tunggal.
4. NEVER menampilkan email/data pribadi member ke publik tanpa izin.

## 5. Usulan Aturan MANDATED (ALWAYS)

1. ALWAYS validasi whitelist email admin di server-side (Apps Script) sebelum operasi admin.
2. ALWAYS buat operasi tulis poin & achievement idempoten (hindari double-count saat retry).
3. ALWAYS cache data read di sisi klien untuk menghemat kuota Apps Script/Sheets.
4. ALWAYS simpan foto sebagai URL (Drive) di spreadsheet, bukan biner di repo.

## 6. Affirmation Gate

Setujui atau sesuaikan item berikut sebelum lanjut (akan ditulis ke `project.md`):

- [ ] Tech stack dikunci (sebutkan pilihan front-end).
- [ ] Testing posture disetujui.
- [ ] Aturan FORBIDDEN disetujui (atau sebutkan perubahan).
- [ ] Aturan MANDATED disetujui (atau sebutkan perubahan).

[Keputusan Anda]:

## Traceability
- Tech stack & auth → `scope-definition.md`, `feasibility-assessment.md`, [Q9].
- Validasi admin server-side → [Q10], feasibility risk "keamanan endpoint".
- Idempotensi poin/achievement → feasibility risk "konsistensi data Sheets".
