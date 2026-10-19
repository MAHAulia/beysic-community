<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->

## Interpretations
- 2026-10-19 — Bahasa percakapan diset ke Bahasa Indonesia (prompt pengguna dan REQUIREMENT.MD berbahasa Indonesia). Semua artefak ditulis dalam Bahasa Indonesia.
- 2026-10-19 — REQUIREMENT.MD dibaca sebagai data lewat document-input; dipakai hanya untuk membentuk pertanyaan, klaim masuk artefak lewat jawaban [Q<n>] yang dikonfirmasi.
- 2026-10-19 — Mode jawaban: Chat. Pengguna menyetujui seluruh rekomendasi dan mengkonfirmasi admin via whitelist email di spreadsheet.

## Tradeoffs
- 2026-10-19 — Karena host statis GitHub Pages tanpa server, login Google + tulis data ke Sheets diarahkan ke Google Apps Script Web App (disetujui pengguna di Q9). Ini menentukan arah teknis di fase berikutnya.

## Interpretations
- 2026-10-19 — Pengguna meng-ACCEPT seluruh assumptions/open questions di intent-statement. Status asumsi diubah menjadi [accepted]; perincian tetap di stage desain terkait, tetapi arah sudah disepakati.
- 2026-10-19 — Referensi distribusi poin leaderboard (gambar `leaderboard-point-reference.png`) direkam ke `leaderboard-point-distribution.md`: tabel asli + tabel implementasi hasil remap bracket.

## Tradeoffs
- 2026-10-19 — Remap bracket partisipan leaderboard (dikonfirmasi pengguna): referensi memberi distribusi penuh (Podium 5–8) mulai kolom 60–69. Implementasi menggeser agar distribusi penuh berlaku untuk turnamen kecil mulai "Up to 30", memakai nilai poin kolom 60–69/70–79/80–99 (bagian "60–90"). Label batas atas bracket baru masih asumsi, dikonfirmasi di requirements-analysis/domain-design.

## Open questions
- 2026-10-19 — Detail skema spreadsheet dan mekanisme OAuth akan diputuskan di stage desain (feasibility/domain-design/infrastructure-design), bukan di sini.
- 2026-10-19 — Batas atas pasti tiap bracket partisipan leaderboard baru, definisi topcut, dan jumlah penerima Alphawolf per event — dirinci di requirements-analysis/domain-design.
