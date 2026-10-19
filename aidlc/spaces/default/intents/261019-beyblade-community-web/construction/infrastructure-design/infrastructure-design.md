# Infrastructure Design — Website Komunitas Beyblade

> Fase: Construction · Stage: Infrastructure Design
> Mengunci detail deployment & integrasi sebelum code-generation: GitHub Pages, Apps Script Web App, Google OAuth/Identity, dan layout spreadsheet sebagai database. Mengikat ke project.md & nfr-requirements.

## 1. Topologi

```
Pengguna
  │  HTTPS
  ▼
GitHub Pages (statis: HTML/CSS/JS vanilla)   ← front-end
  │  fetch JSON (GET/POST) ke URL /exec
  ▼
Google Apps Script Web App (doGet/doPost)    ← API & penulis tunggal
  │  SpreadsheetApp / LockService / Properties
  ▼
Google Spreadsheet (database)  +  Google Drive (foto via URL)
```

## 2. GitHub Pages (Front-end Hosting)
- **Repo**: publik (syarat Pages gratis). Branch deploy: `gh-pages` atau `main /docs` (ditentukan di code-generation).
- **Isi**: file statis hasil build sederhana (tanpa bundler wajib; boleh plain). 
- **Config**: `GAS_WEBAPP_URL` dan `GOOGLE_CLIENT_ID` disimpan sebagai konstanta publik di front-end (keduanya memang client-side & bukan rahasia). Secret apa pun TIDAK di sini (FORBIDDEN#2).
- **Routing**: hash-based agar tidak perlu server rewrite di Pages.

## 3. Google Apps Script Web App (API Layer)
- **Deploy**: sebagai Web App. 
  - Execute as: **Me (pemilik)** → agar skrip punya akses tulis ke spreadsheet.
  - Who has access: **Anyone** → front-end publik bisa memanggil; keamanan tetap via verifikasi token + whitelist di dalam skrip (NFR1).
- **Entry**: `doGet(e)` untuk read publik, `doPost(e)` untuk aksi member/admin. Dispatch berdasar `action`.
- **CORS**: Apps Script mengembalikan `ContentService` JSON. Front-end memanggil dengan `fetch`; gunakan `text/plain` content-type pada POST bila perlu menghindari preflight, atau tangani sesuai perilaku Apps Script.
- **Concurrency**: `LockService.getScriptLock()` membungkus operasi tulis (NFR5).
- **Config/secret**: `PropertiesService` (Script Properties) menyimpan nilai sensitif bila ada (mis. id spreadsheet, allowed client id). Tidak di repo.
- **Verifikasi token**: idToken Google diverifikasi (audience = `GOOGLE_CLIENT_ID`, issuer, expiry) sebelum dipercaya (NFR1.2).

## 4. Google OAuth / Identity
- **Metode**: Google Identity Services (GIS) di front-end → menghasilkan **ID token**; token dikirim ke Apps Script untuk diverifikasi.
- **OAuth Client**: tipe "Web application" di Google Cloud Console.
  - **Authorized JavaScript origins**: domain GitHub Pages (mis. `https://<user>.github.io`).
  - **Catatan**: untuk situs statis, cukup ID token flow (tanpa client secret di klien) — selaras FORBIDDEN#2.
- **Peran**: setelah token terverifikasi, Apps Script menentukan role (admin bila email ∈ `AdminWhitelist`, selain itu member).

## 5. Spreadsheet sebagai Database
Satu Spreadsheet, tiap entitas = satu sheet/tab (sesuai domain-design §2):

| Sheet | Kolom (header baris 1) |
|---|---|
| Members | member_id, email, display_name, status, joined_at |
| Profiles | member_id, photo_url, latest_deck, top_blade, updated_at |
| Events | event_id, name, date, location, status, registration_open, topcut_size |
| Registrations | registration_id, event_id, member_id, player_name, contact, created_at |
| EventResults | result_id, event_id, member_id, rank, total_participants, reached_topcut, is_monarch, attended, points, created_at |
| Achievements | achievement_id, member_id, event_id, type, label, created_at |
| AdminWhitelist | email, added_at |
| HomeContent | key, value |
| Announcements | announcement_id, title, body, published_at |
| EventPhotos | photo_id, event_id, url, caption |

- **PK/uniqueness** ditegakkan di Apps Script (Sheets tak punya constraint): cek sebelum insert; UPSERT untuk EventResults (event_id,member_id) & Achievements (member_id,event_id,type).
- **Foto**: disimpan sebagai URL Google Drive (MANDATED#4), bukan biner.

## 6. Lingkungan & Rahasia
| Item | Lokasi | Rahasia? |
|---|---|---|
| GAS_WEBAPP_URL | konstanta front-end | Tidak (publik) |
| GOOGLE_CLIENT_ID | konstanta front-end | Tidak (publik by design) |
| Spreadsheet ID | Script Properties | Tidak sensitif, tapi disimpan di skrip |
| Daftar admin | sheet AdminWhitelist | Dikelola admin |
| Secret OAuth | — | TIDAK dipakai (ID token flow) |

## 7. Deployment Flow (ringkas, dieksekusi di code-generation/ci)
1. Buat Spreadsheet + sheet sesuai §5; isi AdminWhitelist awal.
2. Buat proyek Apps Script terikat ke Spreadsheet; set Script Properties (spreadsheet id, allowed client id).
3. Deploy Apps Script sebagai Web App (Execute as Me, Access Anyone) → dapat URL `/exec`.
4. Set `GAS_WEBAPP_URL` & `GOOGLE_CLIENT_ID` di front-end.
5. Buat OAuth Client (Web) + authorized origins = domain Pages.
6. Push front-end ke repo → aktifkan GitHub Pages.

## 8. Risiko & Mitigasi (konservatif)
- **Kuota Apps Script harian** → caching klien (N3.1), operasi batch (N3.4).
- **Akses Web App publik** → verifikasi token + whitelist server-side (NFR1).
- **CORS/preflight Apps Script** → pola request diselesaikan di code-generation; fallback `text/plain`.
- **Race condition tulis** → LockService (NFR5).

## 9. Traceability
GitHub Pages → FR8. Apps Script API → functional-design §2. OAuth → FR5. Sheet layout → domain-design §2. Keamanan/kuota → NFR1/N3/N5 + Forbidden/Mandated.

## 10. Open Items untuk code-generation
- Pilihan branch Pages (`gh-pages` vs `main /docs`).
- Pola konkret menghindari CORS preflight di `fetch` ke Apps Script.
- Struktur folder repo front-end + file Apps Script (`Code.gs`, modul).
