# Feasibility Assessment — Website Komunitas Beyblade

> Fase: Ideation · Stage: Feasibility
> Tingkat: problem/opportunity. Estimasi bersifat konservatif; setiap keterbatasan ditandai sebagai asumsi/hipotesis dan diputuskan final di fase inception/construction.

## Ringkasan

Membangun website komunitas statis di GitHub Pages, dengan Google Spreadsheet sebagai penyimpan data dan Google Apps Script Web App sebagai jembatan untuk login Google serta baca/tulis data. Secara keseluruhan **layak** untuk 10 fitur inti pada rilis pertama, dengan beberapa keterbatasan yang perlu disiasati pada tahap desain. Tidak ada hambatan yang memblokir kelanjutan ke scope-definition.

## 1. Kelayakan Teknis (konservatif)

| Area | Penilaian | Keterangan / Risiko |
|---|---|---|
| Hosting statis GitHub Pages | Layak | Gratis, cocok untuk front-end statis. Tidak ada server backend — semua logika dinamis dipindah ke Apps Script. [assumption] repo publik agar GitHub Pages gratis. |
| Login Google (member/admin) | Layak dengan syarat | Diarahkan via Google Apps Script / Google Identity. [hypothesis] OAuth untuk situs statis perlu konfigurasi redirect/origin yang benar; dirinci di infrastructure-design. |
| Data di Google Spreadsheet | Layak untuk skala komunitas | Sheets memadai sebagai datastore kecil-menengah. Risiko: batas kuota Apps Script & kecepatan baca/tulis saat data membesar (ribuan baris). [assumption] volume data komunitas masih dalam batas wajar. |
| Apps Script Web App sebagai API | Layak | Mendukung endpoint GET/POST ke Sheets. Risiko: kuota harian eksekusi & waktu eksekusi; perlu caching di sisi klien. |
| Leaderboard (poin dari event) | Layak | Perhitungan poin mengikuti `leaderboard-point-distribution.md`. Perhitungan bisa di Apps Script atau di sheet formula. |
| Achievement otomatis dari pemenang | Layak | Saat admin input hasil event, Apps Script menulis achievement ke profil pemenang. Perlu aturan idempotensi agar tidak dobel. |
| Admin whitelist via email di sheet | Layak | Pengecekan email login terhadap daftar admin di spreadsheet. Risiko keamanan: whitelist harus divalidasi di sisi Apps Script, bukan hanya front-end. |
| Profil member (foto, deck, blade, achievement) | Layak | Foto disimpan sebagai URL (mis. Google Drive) di sheet. [assumption] penyimpanan gambar via Drive/URL, bukan upload biner ke repo. |

## 2. Keterbatasan & Mitigasi Utama

- **Tanpa backend sejati**: semua operasi tulis bergantung Apps Script. Mitigasi: desain endpoint minimal, caching data read di klien, pembatasan frekuensi tulis.
- **Keamanan endpoint publik**: Web App Apps Script bisa diakses publik. Mitigasi: validasi token/email admin di server-side Apps Script, jangan percaya input klien. (Dirinci di nfr-requirements/infrastructure-design.)
- **Kuota Google**: batas eksekusi harian Apps Script & kuota Sheets API. Mitigasi: operasi batch, hindari polling agresif, cache.
- **Konsistensi data**: Sheets tidak transaksional. Mitigasi: Apps Script sebagai satu-satunya penulis, kunci baris logis, operasi idempoten untuk achievement/poin.

## 3. Kelayakan Operasional & Biaya

- **Biaya**: nyaris nol — GitHub Pages gratis, Google Workspace/akun Google gratis untuk Sheets + Apps Script dalam batas kuota. Sesuai tujuan "gratis" di REQUIREMENT.MD.
- **Pemeliharaan**: dikelola admin komunitas lewat halaman pengelolaan; tidak butuh ops server.
- **Skala**: memadai untuk komunitas (puluhan–ratusan member, event berkala). [hypothesis] jika tumbuh ke ribuan member aktif bersamaan, perlu evaluasi ulang datastore.

## 4. Kelayakan Scope Rilis Pertama

Seluruh 10 fitur inti REQUIREMENT.MD masuk rilis pertama [Q8]. Yang dikecualikan (pembayaran online, mobile native, notifikasi email/WA, chat/forum) tidak memengaruhi kelayakan inti.

## 5. Kesimpulan

**Layak dilanjutkan.** Tidak ada temuan yang memblokir. Risiko utama (keamanan endpoint, kuota Google, konsistensi data) dapat dimitigasi pada fase desain. Lanjut ke stage **scope-definition**.

## Assumptions & Open Questions
- [assumption] Repo GitHub publik untuk GitHub Pages gratis.
- [assumption] Volume data komunitas berada dalam batas kuota Sheets/Apps Script.
- [assumption] Foto profil disimpan sebagai URL (Drive) di spreadsheet.
- [hypothesis] Konfigurasi OAuth/Identity untuk situs statis perlu penyesuaian origin/redirect — divalidasi di infrastructure-design.
- [open] Strategi caching & pembatasan frekuensi tulis Apps Script — diputuskan di nfr-requirements/infrastructure-design.
