# Strata workbench verification — 2026-09-23

Status: PARTIALLY COMPLETE. This is not done.

Owner: PLT-DS. Knowledge delta: UPDATED. Scope: shared DataTable, CommandPalette and icon-bearing Input presentation; no application integration, release, deployment, persistence, authorization or tenant changes.

## Implemented

- `src/core/data-grid/table/table.tsx` and its CSS Module retain existing props and add optional caption, accessible name, toolbar, footer and row-label composition. Sorting and grouping use buttons. Sort indicators use Lucide. Row colors use CSS states rather than mouse style mutation.
- The table keyboard handler yields to native controls. A regression test exercises Enter on a sort button.
- `src/core/navigation/command-palette/command-palette.tsx` and its CSS Module provide named combobox/listbox/option semantics, bounded active selection after item changes, input-scoped keyboard dispatch, focus containment/restoration and result metadata. Close cannot dispatch an unrelated command.
- The command accessibility test now scans the actual portaled dialog, rather than an empty render container.
- `src/core/inputs/form-control/form-control.module.css` reserves token-based icon padding and uses logical icon insets.
- The enterprise table story uses deterministic synthetic invoices, working status/search filters, selection, pagination and existing CSV export.

## Evidence

Executed from `design-system`:

- `pnpm exec vitest run src/core/data-grid/table/table.test.tsx src/core/navigation/command-palette/command-palette.test.tsx src/core/inputs/form-control/form-control.test.tsx`: PASS, 3 files / 19 tests on the final implementation.
- `pnpm lint`: PASS under Node 22, including typecheck, token, density, contrast, layer and UI governance checks.
- `pnpm build`: PASS under Node 22, including six governance fixtures and generated-token parity.
- Earlier complete suite before the final focused fixes: `pnpm test`, PASS, 432 files / 1,647 tests. This is baseline evidence, not a claim that the complete suite was rerun after every final refinement.

Executed from `design-system/storybook`: `pnpm build-storybook`, PASS under Node 22 on the final source (55 seconds). The earlier attempt from the design-system root failed because that package has no build-storybook script; running in the owning Storybook package resolved it. Upstream Storybook eval warnings remain. `git diff --check` passed in design-system and platform; Git reported line-ending conversion notices.

Browser review used Storybook on localhost port 6010, 1280 × 720:

- `data-grid-datatable--enterprise-workbench`, Strata light/standard: inspected screenshot before and after fixing the overlapping prefix icon. Verified status filtering to five overdue records and a selected row with bulk controls. Screenshot confirms aligned amount values and a single desktop toolbar row.
- `navigation-commandpalette--default`, Strata dark/standard: inspected screenshot, accessibility tree and Arrow Down. Selection moved to Chart of Accounts while Search retained focus.

These observations do not prove all themes, density modes, RTL, mobile, screen readers or high-volume behavior.

## Remaining criteria and known limits

- DW-01: additive TypeScript compatibility passes; actual application consumers have not been exercised for this slice.
- DW-02/DW-03: token-driven presentation and accessible composition are implemented with focused proof.
- DW-04/DW-05: PARTIAL. Full cell focus navigation, grouped row identity, virtualized row dimensions and editing cancellation still require behavioral review. Existing broad capability comments are not accepted as proof.
- DW-06: enterprise story implemented; complete workflow verification remains.
- DW-07: PARTIAL. Full visual/accessibility and downstream matrices remain.
- All-component polish and design-system-only platform enforcement remain broader unfinished work.

No public props were removed. Rollback can restore the changed components without data migration. No dependency upgrade was introduced. Source-control publication remains pending the applicable human authorization.
