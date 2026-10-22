# Code Generation Plan — UI Re-skin (Beysic)

## Summary

- Builds: re-skin lapisan visual `docs/` ke design token `template/` (palet cyan, Inter, radius 18px, gradient, grid, komponen card/button/eyebrow), CSS dipecah modular.
- Touches: `docs/index.html`, `docs/styles.css` → `docs/css/*` (modular), `docs/js/pages/*.js` (markup presentasional), `docs/assets/` (logo), `CREDITS.md` (atribusi).
- Tests: tidak menambah test baru (scope refactor, minimal); verifikasi suite yang ada tetap hijau — unit `test/points.test.js` + e2e Playwright `e2e/*.spec.js` (perbarui selector bila markup berubah, tetap menguji perilaku sama).

## Konteks & Batasan
- Brownfield: modifikasi file in-place, TANPA duplikat (mis. `styles_modified.css`).
- Fungsi SPA/router/auth/form/tabel/logika TIDAK berubah (BR1.12). Backend `apps-script/` tidak disentuh.
- Tanpa framework/dependency build baru (BR1.14); Inter via Google Fonts CDN.
- Semua aset UI (CSS, logo) di bawah `docs/` agar GitHub Pages menyajikannya (BR1.14, FR6.3).
- Tambahkan/ pertahankan atribut `data-testid` pada elemen interaktif agar selector e2e stabil.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "refactor",
  "test_strategy": "minimal",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "project",
      "text": "- Test Strategy: Standard, fokus pada **end-to-end (e2e)** untuk alur utama: login Google, pendaftaran event, input poin leaderboard oleh admin, pencatatan achievement otomatis. (affirmed 2026-10-19)\n- Logika perhitungan poin leaderboard tetap diverifikasi (kritis & rawan error) sebagai bagian cakupan e2e / verifikasi perhitungan. (affirmed 2026-10-19)"
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:a92b3d02a0d194b43e9418271b330dba39dabce655d626d38f46ea73c37d55d5",
  "contract_sha256": "sha256:aabc473d9f852b42a4702412c07f34d872b29c574023aaf2ce41cccde15d9fff"
}
```

### Catatan penerapan Testing Contract untuk unit UI-only
Methodology **test-after**. Dari layer yang bisa diuji, hanya **Frontend behavior** yang relevan di re-skin ini (tidak ada perubahan data-model/repository/business-logic/API — semua dibekukan). Scope `refactor` **tidak menambah test baru**; kewajiban: **suite yang ada tetap hijau**. Runner sudah ada (`node --test` untuk unit, `playwright test` untuk e2e) — langkah runner = verifikasi, bukan bootstrap.

## Langkah Implementasi (checkbox)

- [x] **Step 1 — Skeleton konfigurasi produksi**: siapkan folder `docs/css/`; tidak ada konfigurasi build baru (NFR4.1/BR1.14). (traceability: BR1.14)
- [x] **Step 2 — Verifikasi test runner & catat perintah unit-scoped**: pastikan `node --test test/points.test.js` dan `npx playwright test <spec>` bisa dijalankan; catat di `unit-test-instructions.md`. (runner_step)
- [x] **Step 3 — Data model / database behavior — N/A**: tidak ada perubahan (re-skin UI-only). Dilewati dengan alasan.
- [x] **Step 4 — Data model tests — N/A**: tidak ada layer ini.
- [x] **Step 5 — Repository / data access — N/A**: dibekukan (backend Apps Script).
- [x] **Step 6 — Repository tests — N/A**.
- [x] **Step 7 — Business logic — N/A**: logika poin dibekukan; tidak disentuh.
- [x] **Step 8 — Business logic tests**: jalankan `node --test test/points.test.js` untuk membuktikan logika poin tetap hijau (regresi). (traceability: NFR1.3/BR1.6)
- [x] **Step 9 — API / endpoint — N/A**: kontrak Apps Script tidak berubah (BR1.12).
- [x] **Step 10 — API tests — N/A**.
- [x] **Step 11 — Frontend behavior — implement (INTI re-skin)**:
  - [x] 11a. `docs/index.html`: ganti link Google Fonts Oswald/Barlow → **Inter**; pastikan Font Awesome tetap; perbarui urutan `<link>` ke file `docs/css/*` dengan `responsive.css` terakhir (FR1.3, FR6.2, BR1.3/BR1.5).
  - [x] 11b. Buat `docs/css/` modular dari `styles.css` lama, selaraskan token `:root` ke nilai `template/` (bg #070b12, blue #1676e8, cyan #42f3ff, white, muted, line, radius 18px), latar grid+gradient, `.container`, `.eyebrow`, `.gradient` (FR1.1/1.2/1.4/1.5/1.6, FR3.1, BR1.1/BR1.9). File: `base, buttons, layout, header, hero, footer, components, leaderboard, events, membership, profile, admin, responsive`.
  - [x] 11c. Hapus semua sisa token lama: warna `#ffcc33` dan font Oswald/Barlow untuk UI → cyan + Inter (FR3.1/3.2, BR1.2).
  - [x] 11d. Selaraskan komponen ke gaya template: `.btn/.btn-primary/.btn-ghost`, `.card/.iconbox`, `.tag`, `.muted-note`, tabel leaderboard, form, popup alert, loader (FR2.3, BR1.10).
  - [x] 11e. Logo: salin aset dari `template/assets/images/` ke `docs/assets/`; ganti emoji 🐺 (brand header) dan 🌀 (loader) dengan logo; loader diwarnai cyan + grid (FR4.1, FR5.1/5.2/5.3/5.4, BR1.1/BR1.11).
  - [x] 11f. Terapkan `.gradient` pada heading hero tiap halaman + `.eyebrow` label section; sentuh markup presentasional di `docs/index.html` dan string template `docs/js/pages/*.js` TANPA mengubah handler/rute; tambah `data-testid` pada elemen interaktif bila membantu e2e (FR1.4/1.6, FR2.1/2.2, FR8.1/8.2, BR1.4/BR1.10/BR1.12).
  - [x] 11g. Hapus `docs/styles.css` lama setelah paritas tercapai.
- [x] **Step 12 — Frontend behavior tests**: jalankan suite e2e Playwright (`public/member/admin`); bila ada selector putus akibat markup, perbarui selector agar tetap menguji perilaku yang sama (jangan lemahkan uji) (NFR1.1/1.2, BR1.6). Tidak menambah test baru (scope refactor).
- [x] **Step 13 — Environment/build configuration**: tidak ada perubahan build; pastikan tidak ada dependency baru di `package.json` (BR1.14).
- [x] **Step 14 — Dokumentasi & traceability**: tinjau aset Axio yang masih dipakai → perbarui footer `docs/index.html` + `CREDITS.md` sesuai lisensi aset yang benar-benar dipakai (FR7.1/7.2, BR1.8); perbarui `code-summary.md` + `traceability.json`.

## Story-to-code mapping
Tidak ada user story (refactor skip user-stories). Pemetaan requirement→langkah tercantum inline per step di atas; detail FR/NFR/BR → file ada di `traceability.json` (Step 14).

## Kriteria Lulus (DoD)
Semua `:root` cocok token template, tanpa sisa `#ffcc33`/Oswald/Barlow di stylesheet UI, Inter termuat, CSS modular dengan `responsive.css` terakhir, logo dari `docs/assets/`, unit test + e2e tetap hijau, tanpa dependency build baru.
