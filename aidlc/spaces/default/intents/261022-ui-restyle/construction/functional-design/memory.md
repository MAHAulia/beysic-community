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
- 2026-10-22T03:00:00Z — Unit UI-only tanpa data/business rule baru. Per stage file, functional-spec.md bersifat self-contained (workflow interaksi + transisi state visual); entities.md & rules.md diisi minimal/N/A karena tidak ada entity atau business rule baru dari re-skin. traceability.json memetakan FR/NFR (refactor scope skip units-generation, tidak ada AC per-unit).
- 2026-10-22T03:00:00Z — Refactor scope skip units-generation & domain-design; bekerja dari requirements.md + CodeKB docs/ sebagai de-facto domain. functional-spec difokuskan ke pemetaan design-token->komponen dan daftar file CSS modular target.

## Deviations
- 2026-10-22T03:00:00Z — entities.md & rules.md ditulis sebagai dokumen eksplisit "tidak ada entity/rule baru" (dengan source-of-truth block kosong/minimal) alih-alih mendesain model data, karena re-skin tidak memperkenalkan logika bisnis.

## Deviations
- 2026-10-22T03:20:00Z — Revisi iterasi 1 reviewer (NOT-READY, 4 Major): traceability.json awalnya hanya memetakan sebagian FR/NFR. Ditambahkan BR1.9–BR1.14 untuk latar grid, cakupan semua halaman+shell, logo brand header, markup-aman, responsif, dan tanpa-dependency/aset-di-docs; seluruh FR2.x/FR1.5/FR5.1/FR5.4/FR8.x/NFR2.1/NFR4.1/NFR5.1 kini terlacak. Peta CSS §2 ditambah hero.css eksplisit (selaras Q1=A).
