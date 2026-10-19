# Domain Design — Website Komunitas Beyblade

> Fase: Inception · Stage: Domain Design
> Model domain + skema Google Spreadsheet (tiap entitas = satu sheet/tab). Mengacu requirements-analysis & leaderboard-point-distribution. Datastore ditulis tunggal via Apps Script.

## 1. Entitas & Relasi

```
Member 1───1 Profile
Member 1───* Achievement
Member 1───* EventResult
Event  1───* EventResult
Event  1───* Registration
Member 0───* Registration
EventResult *──1 Member, *──1 Event
AdminWhitelist (daftar email admin)
Announcement, EventPhoto, HomeContent (konten home)
LeaderboardView = agregasi dari EventResult (dihitung, bukan ditulis manual)
```

## 2. Skema Spreadsheet (satu sheet per entitas)

### `Members`
| Kolom | Tipe | Keterangan |
|---|---|---|
| member_id | string (PK) | id unik (mis. slug/uuid) |
| email | string | email Google (unik, identitas login) |
| display_name | string | nama tampil |
| status | enum | pending / active / inactive |
| joined_at | datetime | |

### `Profiles` (1:1 dengan Members)
| member_id (PK/FK) | photo_url | latest_deck | top_blade | updated_at |

### `Events`
| event_id (PK) | name | date | location | status (upcoming/ongoing/finished) | registration_open (bool) | topcut_size (int, dinamis — diisi admin per event, D2) |

### `Registrations`
| registration_id (PK) | event_id (FK) | member_id (FK, nullable) | player_name | contact | created_at |

### `EventResults` (sumber poin leaderboard)
| result_id (PK) | event_id (FK) | member_id (FK) | rank (int) | total_participants (int) | reached_topcut (bool) | is_monarch (bool) | attended (bool) | points (number, dihitung) | created_at |
- `points` dihitung Apps Script saat simpan (lihat §4). Satu baris per pemain per event.
- Unique key logis: (event_id, member_id) → idempotensi (FR9.2).

### `Achievements`
| achievement_id (PK) | member_id (FK) | event_id (FK) | type (enum: podium1..4 / monarch / topcut) | label | created_at |
- Unique key logis: (member_id, event_id, type) → idempotensi (FR10.2).

### `AdminWhitelist`
| email (PK) | added_at |

### Konten Home
- `HomeContent`: key | value (teks "tentang komunitas", dll)
- `Announcements`: announcement_id | title | body | published_at
- `EventPhotos`: photo_id | event_id (nullable) | url | caption

## 3. Leaderboard — Keputusan Domain (USULAN DEFAULT, perlu konfirmasi)

Open questions dari stage sebelumnya diberi usulan default agar bisa dikunci:

| # | Pertanyaan | Usulan Default | Perlu konfirmasi? |
|---|---|---|---|
| D1 | Batas bracket partisipan | **Up to 30** (←kolom 60–69), **31–59** (←70–79), **60–Max** (←80–99) | ✅ DIKONFIRMASI |
| D2 | Definisi "topcut" | **Dinamis per event**: `Events.topcut_size` ditetapkan admin sesuai kebutuhan tiap event (tanpa nilai default tetap; wajib diisi admin saat input hasil) | ✅ DIKONFIRMASI (dinamis) |
| D3 | Penerima Monarch per event | **Tepat satu pemain** per event | ✅ DIKONFIRMASI |
| D4 | Akumulasi poin lintas event | **Jumlah total** semua EventResult milik member | ✅ DIKONFIRMASI |
| D5 | Signup member baru | **Perlu approval admin**: signup → status `pending` → admin set `active` | ✅ DIKONFIRMASI |

> Keputusan D1–D5 dikonfirmasi pengguna 2026-10-19. D2 bersifat dinamis: tidak ada default; `topcut_size` wajib diisi admin per event.

## 4. Aturan Perhitungan Poin (deterministik)

Input per pemain pada satu event: `rank`, `total_participants`, `reached_topcut`, `is_monarch`, `attended`.

1. Tentukan bracket dari `total_participants` (D1): ≤30 → kol A; 31–59 → kol B; ≥60 → kol C.
2. **Podium**: jika `rank` ∈ 1..8 → ambil poin Podium sesuai bracket (tabel implementasi di `leaderboard-point-distribution.md`). rank > 8 → 0.
3. **Attendance**: jika `attended` → tambah poin Attendance bracket.
4. **Progress to topcut**: jika `reached_topcut` DAN `rank` > 4 → tambah poin topcut bracket. Jika `rank` ∈ 1..4 → 0 (aturan bintang \*).
5. **Monarch**: jika `is_monarch` → tambah poin Monarch bracket.
6. `points` = jumlah seluruh komponen di atas.

> Nilai angka tiap komponen diambil persis dari tabel implementasi (bagian 60–90 referensi).

## 5. Aturan Integritas & Idempotensi
- Apps Script = penulis tunggal (FORBIDDEN#3).
- Simpan EventResult: upsert berdasarkan (event_id, member_id) → submit ulang meng-update, tidak menambah (FR9.2).
- Achievement dibuat saat EventResult tersimpan: upsert (member_id, event_id, type) (FR10.2). Tipe achievement: Podium 1–4 → `podium{n}`; `is_monarch` → `monarch`; `reached_topcut` → `topcut` (opsional).
- Otorisasi admin dicek server-side terhadap `AdminWhitelist` (NFR1, MANDATED#1).

## 6. Traceability
- Entitas Members/Profiles/Events/Registrations/Achievements → F1–F10.
- EventResults + §4 → FR3.2, FR9.1, FR9.2.
- AdminWhitelist → FR5.2, NFR1.

## 7. Keputusan yang Perlu Anda Konfirmasi — DIKUNCI 2026-10-19

[Keputusan Anda]: D1, D3, D4, D5 disetujui sesuai default. **D2 diubah menjadi dinamis** — `topcut_size` ditentukan admin per event sesuai kebutuhan, tanpa default tetap, dan wajib diisi saat input hasil event. Domain-design DIKUNCI. Lanjut ke fase Construction / functional-design.
