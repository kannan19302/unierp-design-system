# Table workbench Storybook reference match — 2026-09-28

Status: `PARTIAL`. Risk: `R1 — Storybook fixture presentation only`. Owner: PLT-DS. Consumer: local Storybook. This packet changes no DataTable runtime API, sorting/selection behavior, persisted data, export behavior, dependency, consumer package or release.

## Acceptance criteria

1. **AC-01 — Equivalent live comparison:** compare current `Compositions / Table / Enterprise workbench` with the real shadcn Data Table online example at the same viewport; record exact story/reference URLs and the observed interaction composition.
2. **AC-02 — Business identifier readability:** keep invoice identifiers on one line in the workbench example at desktop width while retaining responsive region containment at narrow widths.
3. **AC-03 — Row-action parity:** add a labeled per-invoice action menu comparable to the reference's row menu; allow keyboard opening and selection with a visible, non-mutating story status.
4. **AC-04 — Strata visual contract:** preserve theme/density tokens, semantic selection and currency presentation; no shadcn font, palette or dependency is copied.
5. **AC-05 — Proof:** rebuild Storybook, inspect updated browser screenshot, measure ID-cell width/row height, and exercise the menu by keyboard; run focused Table tests, Storybook standards and typecheck. Overall Table calibration remains separately governed by the frozen protocol.

## Current comparison

Current source/story: `src/compositions/table/`, `compositions-table--enterprise-workbench`. Online primary reference: [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table), live browser inspection 2026-09-28. At 1046×714 CSS pixels, the shadcn sample visibly combines email filtering, column visibility, selection, status, amount, row actions and pagination in a compact 5-row table. The local synthetic invoice workbench combines search, invoice status filtering, export, checkbox selection, four business columns, and three-page navigation.

Before this correction, the local ID column had an explicit 80px width; `INV-001` wrapped onto two lines and raised each standard-density row to 58.8px. The reference's row menu also has no equivalent in the local workbench. The table itself is semantically native, with a named keyboard-reachable scroll region. Increase only the Storybook fixture's invoice-ID width to 96px so the identifier remains intact and add a row-action composition using the existing `DropdownMenu`; actions report demo status and do not mutate invoice data. These are fixture/content requirements, not generic table defaults.

Rollback is reverting the one story-fixture width. Knowledge delta: `UPDATED` — the live reference exposed a measurable ERP identifier readability gap in the current fixture.

## Implementation and verification

The Enterprise Workbench now assigns its invoice ID column a 96px width and adds a labeled row-action dropdown using the existing `DropdownMenu`. The menu offers “View invoice” and “View activity”; choices update only a local accessible story status. No business record is modified.

| Check | Result |
| --- | --- |
| `pnpm exec vitest run src/compositions/table/table.test.tsx` | PASS — Node 22.23.3, 19/19 tests, including keyboard row/edit and confirmed-save behavior. |
| `pnpm typecheck` | PASS — Node 22.23.3 after the story composition change. |
| `pnpm check:storybook` | PASS — 120 source stories parsed; all 113 component stories conform. |
| `pnpm --dir storybook build-storybook` | PASS — fresh Node 22 static build. |
| Live desktop comparison | PASS for the reviewed story composition — both pages at 1046×714. Before the fix the Strata 80px ID cell made 58.8px rows; now its 96px cell keeps `INV-001` on one line. After adding actions, local standard rows measure 45px. |
| Keyboard menu flow | PASS — activate “Actions for invoice INV-001”; ArrowDown to “View invoice”, ArrowDown to “View activity”, Enter. The menu closes and an accessible status reads “Showing activity for INV-001”. |

Persisted side-by-side evidence: [`comparison.html`](../evidence/component-benchmarks/2026-09-28/table/comparison.html), [reference screenshot](../evidence/component-benchmarks/2026-09-28/table/reference-shadcn-data-table-desktop.png) and [Strata Storybook screenshot](../evidence/component-benchmarks/2026-09-28/table/strata-table-workbench-desktop.png). Overall Table calibration remains `NOT VERIFIED`: this single workbench comparison does not replace its theme/density/direction matrix, true zoom, OS-mode and screen-reader proof, or affected consumer gates.
