# Referensi Distribusi Poin Leaderboard — BEYJAXEL

> Fase: Ideation · Stage: Intent Capture & Framing
> Sumber: `leaderboard-point-reference.png` (foto papan "BEYJAXEL LEADERBOARD POINTS DISTRIBUTION").
> Dokumen ini merekam aturan poin leaderboard sebagai acuan untuk stage requirements-analysis / domain-design / functional-design.

## 1. Tabel Referensi Asli (persis seperti gambar)

Kolom = rentang **Total Participant**. Baris = kategori poin.

| Kategori | Up to 39 | 40–49 | 50–59 | 60–69 | 70–79 | 80–99 | 100–Max |
|---|---|---|---|---|---|---|---|
| Podium 1 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| Podium 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| Podium 3 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| Podium 4 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| Podium 5 | 0 | 0 | 0 | 2.5 | 4 | 5 | 6 |
| Podium 6 | 0 | 0 | 0 | 2 | 3 | 4 | 5 |
| Podium 7 | 0 | 0 | 0 | 1.5 | 2 | 3 | 4 |
| Podium 8 | 0 | 0 | 0 | 1 | 1.5 | 2 | 3 |
| Attendance | 0.25 | 0.35 | 0.45 | 0.55 | 0.65 | 0.75 | 1 |
| Progress to topcut | 0.5* | 0.65* | 0.75* | 1* | 1.25* | 1.5* | 2 |
| Monarch | 1 | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 2.5 |

\* **Progress to topcut** TIDAK dihitung jika pemain sudah mencapai Podium 1–4.

### Keterangan kategori
- **Podium 1–8**: poin sesuai peringkat akhir pemain di event (1 = juara).
- **Attendance**: poin kehadiran untuk setiap peserta yang ikut.
- **Progress to topcut**: bonus karena lolos ke babak topcut; dibatalkan bila pemain finis Podium 1–4.
- **Monarch**: bonus khusus (penghargaan Monarch) pada event tersebut. (Pada gambar referensi asli kategori ini berlabel "Alphawolf"; diganti menjadi "Monarch" per keputusan pengguna 2026-10-19.)

## 2. Aturan Implementasi (remap bracket partisipan) — DIKONFIRMASI PENGGUNA

Keputusan pengguna: pada referensi, distribusi poin "penuh" (yang memberi poin untuk Podium 5–8) baru muncul mulai kolom **60–69**. Untuk implementasi di website, bracket partisipan **digeser** sehingga distribusi penuh tersebut berlaku untuk turnamen kecil, dimulai dari **"Up to 30"**.

Artinya: kolom poin yang dipakai implementasi adalah bagian **60–90** dari referensi (kolom `60–69`, `70–79`, `80–99`), dipetakan ke bracket partisipan baru yang mulai dari "Up to 30".

### Tabel distribusi poin yang DIPAKAI implementasi (versi awal)

Bracket partisipan baru dimulai dari "Up to 30". Nilai poin diambil dari kolom `60–69` / `70–79` / `80–99` referensi:

| Kategori | Up to 30 | 31–59 | 60–Max |
|---|---|---|---|
|          | (nilai kolom 60–69) | (nilai kolom 70–79) | (nilai kolom 80–99) |
| Podium 1 | 7 | 8 | 9 |
| Podium 2 | 6 | 7 | 8 |
| Podium 3 | 5 | 6 | 7 |
| Podium 4 | 4 | 5 | 6 |
| Podium 5 | 2.5 | 4 | 5 |
| Podium 6 | 2 | 3 | 4 |
| Podium 7 | 1.5 | 2 | 3 |
| Podium 8 | 1 | 1.5 | 2 |
| Attendance | 0.55 | 0.65 | 0.75 |
| Progress to topcut | 1* | 1.25* | 1.5* |
| Monarch | 1.3 | 1.4 | 1.5 |

\* **Progress to topcut** TIDAK dihitung jika pemain sudah mencapai Podium 1–4.

> Catatan: label dan batas atas bracket partisipan baru ("Up to 30", "31–59", "60–Max") adalah **asumsi** penamaan agar tiga tingkat distribusi (asal kolom 60–69 / 70–79 / 80–99) terpakai berurutan mulai dari turnamen terkecil. Batas angka pasti tiap bracket akan dikonfirmasi/dirinci pada stage requirements-analysis / domain-design.

## 3. Open Questions untuk stage berikutnya
- Konfirmasi batas atas tiap bracket partisipan baru (apakah "Up to 30 / 31–59 / 60–Max" sudah tepat, atau perlu lebih banyak tingkat).
- Konfirmasi apakah kategori **Monarch** diberikan ke tepat satu pemain per event atau bisa lebih.
- Konfirmasi definisi "topcut" (jumlah pemain yang lolos) karena memengaruhi bonus Progress to topcut.
- Cara akumulasi poin lintas event ke leaderboard (jumlah total vs. N event terbaik) — diputuskan di domain-design.
