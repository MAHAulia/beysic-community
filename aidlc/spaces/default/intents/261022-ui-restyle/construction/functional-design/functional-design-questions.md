# Functional Design — Pertanyaan (UI re-skin)

Unit: re-skin visual `docs/`. Tidak ada entity/business rule/data baru — pertanyaan di bawah hanya soal spesifikasi presentasi yang belum dipaku di requirements.

Isi `[Answer]:` dengan huruf pilihan, atau `X` + penjelasan.

---

## Q1 — Peta file CSS modular (struktur target)
FR6 meminta pecah `styles.css` jadi modular ala `template/css/`. Mana pembagian file yang Anda inginkan?

- A. Ikuti persis pola template: `base, buttons, layout, header, hero, components, footer, responsive` + file per-halaman bila perlu (`leaderboard`, `events`, `membership`, dst.), `responsive.css` terakhir.
- B. Modular tapi lebih ringkas: `base` (token+reset+tipografi), `components` (header/nav/footer/card/button/alert/loader), `pages` (gabungan gaya per-halaman), `responsive`.
- C. Serahkan ke penilaian teknis saat eksekusi (ikuti yang paling rapi untuk kode docs/ yang ada).
- X. Other (please specify)

[Answer]: A

---

## Q2 — Penempatan wajib utilitas `.gradient` dan `.eyebrow`
Agar bisa diverifikasi (temuan reviewer sebelumnya), elemen mana yang WAJIB mengadopsi utilitas ini?

- A. `.gradient` pada judul/heading utama (H1/H2 hero) tiap halaman; `.eyebrow` sebagai label kecil cyan di atas judul section utama. Sisanya opsional sesuai desain.
- B. Hanya pada halaman Home (hero), halaman lain polos.
- C. Serahkan ke penilaian desain saat eksekusi.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Kriteria verifikasi keselarasan (definition of done visual)
Agar re-skin punya kriteria lulus/gagal yang jelas (bukan hanya "terlihat selaras"):

- A. Semua variabel `:root` di `docs/` cocok dengan token `template/` (bg/blue/cyan/white/muted/line/radius), tanpa sisa token lama (`#ffcc33`, Oswald/Barlow) di stylesheet UI; font Inter termuat; e2e + unit test tetap hijau.
- B. Cukup inspeksi visual manual per halaman + e2e hijau.
- C. Serahkan ke penilaian saat eksekusi.
- X. Other (please specify)

[Answer]: A


---

## Consolidated Summary Confirmation

Ringkasan jawaban sebelum saya menyusun artifact functional design:

- Q1: Struktur CSS modular mengikuti persis pola `template/css/` — base, buttons, layout, header, hero, components, footer, responsive, plus file per-halaman bila perlu; `responsive.css` dimuat terakhir.
- Q2: `.gradient` wajib pada judul/heading utama (hero H1/H2) tiap halaman; `.eyebrow` sebagai label cyan di atas judul section utama; selebihnya opsional.
- Q3: Definition of done visual = semua variabel `:root` cocok token `template/` (bg/blue/cyan/white/muted/line/radius), tanpa sisa token lama (`#ffcc33`, Oswald/Barlow) di stylesheet UI, font Inter termuat, dan e2e + unit test tetap hijau.
- Konteks tetap: unit UI-only, tidak ada entity/business rule/data baru; fungsi SPA/router/auth/form/tabel tidak berubah.

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
