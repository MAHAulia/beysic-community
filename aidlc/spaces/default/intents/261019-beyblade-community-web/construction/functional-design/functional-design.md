# Functional Design — Website Komunitas Beyblade

> Fase: Construction · Stage: Functional Design
> Menjembatani requirements + domain ke rancangan teknis: kontrak API Apps Script, perilaku front-end vanilla JS, dan algoritma poin. Mengikat ke project.md (Tech Stack, Forbidden/Mandated).

## 1. Arsitektur Ringkas

```
[Browser: Vanilla JS SPA statis @ GitHub Pages]
        │  fetch (GET/POST JSON)
        ▼
[Google Apps Script Web App  (doGet / doPost)]  ← penulis tunggal
        │
        ▼
[Google Spreadsheet: sheets Members, Profiles, Events, Registrations,
 EventResults, Achievements, AdminWhitelist, HomeContent, Announcements, EventPhotos]
```
- Front-end: halaman statis + modul JS (router hash, komponen render, api client, cache).
- Auth: Google Identity (token) dikirim ke Apps Script; Apps Script verifikasi & cek whitelist.

## 2. Kontrak API (Apps Script Web App)

Semua request JSON. Endpoint tunggal `doGet`/`doPost` dengan parameter `action`. Response: `{ ok: bool, data?, error? }`.

### Publik (GET, tanpa auth)
| action | Params | Response data | Trace |
|---|---|---|---|
| `home.get` | — | { about, announcements[], photos[] } | FR1.1 |
| `events.list` | status? | events[] (upcoming/ongoing) | FR2.1 |
| `leaderboard.get` | eventId? | rows[] { rank, member, points, events, podiums, monarchs } | FR3.1 |
| `membership.info` | — | { benefits[], howto } | FR4.1 |

### Member (POST, perlu token member valid)
| action | Params | Efek | Trace |
|---|---|---|---|
| `auth.login` | idToken | verifikasi Google, kembalikan { role: member/admin, profile } | FR5.1 |
| `event.register` | eventId, playerName, contact | tambah Registration | FR2.2 |
| `membership.signup` | profilAwal | buat Member status=pending | FR4.2, D5 |
| `profile.get` | — | profil member sendiri | FR6.1 |
| `profile.update` | photoUrl, latestDeck, topBlade | update Profile sendiri | FR6.2 |

### Admin (POST, perlu token + email ∈ AdminWhitelist, dicek server-side)
| action | Params | Efek | Trace |
|---|---|---|---|
| `admin.home.update` | about?, announcement?, photo? | update konten home | FR1.2 |
| `admin.event.save` | event{...} | buat/edit Event (termasuk topcut_size dinamis) | FR2.3, D2 |
| `admin.results.submit` | eventId, totalParticipants, rows[]{memberId, rank, reachedTopcut, isMonarch, attended} | hitung poin + upsert EventResults + upsert Achievements | FR9.1, FR9.2, FR10 |
| `admin.member.setStatus` | memberId, status | approve/nonaktif member | D5 |

> Setiap action admin WAJIB cek `isAdmin(email)` di awal; gagal → `{ok:false, error:'forbidden'}` (NFR1, FORBIDDEN#1, MANDATED#1).

## 3. Algoritma Poin (pseudocode) — FR3.2, domain §4

```
function bracketOf(total):
  if total <= 30: return A    # kolom 60-69 referensi
  if total <= 59: return B    # kolom 70-79
  return C                    # kolom 80-99

function computePoints(row, total):
  b = bracketOf(total)
  p = 0
  if 1 <= row.rank <= 8: p += PODIUM[b][row.rank]      # rank>8 => 0
  if row.attended:       p += ATTENDANCE[b]
  if row.reachedTopcut and row.rank > 4: p += TOPCUT[b] # rank 1..4 => 0 (aturan *)
  if row.isMonarch:      p += MONARCH[b]
  return p
```
Tabel `PODIUM/ATTENDANCE/TOPCUT/MONARCH` = nilai dari `leaderboard-point-distribution.md` (tabel implementasi). Monarch divalidasi tepat satu baris `isMonarch=true` per event (D3).

## 4. Idempotensi (FR9.2, FR10.2)
- `admin.results.submit` meng-UPSERT EventResults berdasar (eventId, memberId): submit ulang menimpa, tidak menambah.
- Achievement UPSERT (memberId, eventId, type). Tipe: rank 1..4 → `podium{rank}`; isMonarch → `monarch`.
- Operasi dibungkus LockService Apps Script agar tidak balapan.

## 5. Perilaku Front-end (vanilla JS)
- **Router**: hash-based (`#/`, `#/event`, `#/leaderboard`, `#/membership`, `#/profile`, `#/admin`).
- **API client**: wrapper `fetch` + penyertaan token; parsing `{ok,...}`.
- **Cache**: read publik (home, events, leaderboard) di-cache di memори + sessionStorage dengan TTL singkat (MANDATED#3); invalidasi setelah aksi tulis admin.
- **Guard UI admin**: menu admin hanya render jika role=admin; tetap divalidasi server-side.
- **Form**: validasi dasar klien (wajib isi) + penanganan error dari API.

## 6. Error Handling
- Semua response non-ok menampilkan pesan ramah; detail teknis tidak membocorkan data sensitif.
- Timeout/kuota Apps Script → retry terbatas + pesan "coba lagi".

## 7. Traceability
Kolom "Trace" pada tabel API memetakan tiap endpoint ke FR. Algoritma poin → FR3.2 + domain §4. Keamanan → NFR1/NFR6 + Forbidden/Mandated.

## 8. Open Items untuk code-generation
- Struktur folder front-end & nama file modul.
- Penanganan verifikasi idToken Google di Apps Script (library/metode).
- Format caching key & TTL konkret.
