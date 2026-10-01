# Iteration evidence report — DataGrid / SpreadsheetGrid — 2026-09-28

## STATUS

**PARTIAL — This is not done.** The local spreadsheet-style grid has direct live comparison evidence, but its end-to-end Business Suite purpose is not established, its API and formula terminology need owner review, and accepted minimum text size is contradicted by 10px fallbacks. Implementation remains frozen pending Input, DataTable, and Breadcrumb calibration.

## CHANGES

- Added the [DataGrid comparison record](comparison.md) with live Strata Storybook, shadcn, 21st.dev, Handsontable finance/performance, and AG Grid behavior evidence.
- Updated the component benchmark ledger and PLT-DS traceability.
- No source, application, public contract, story, or test changes were made.

## VALIDATION EXECUTED

- Inspected `compositions-spreadsheetgrid--budget-forecasting` visually and through its AX tree at 1280×720.
- In the local Storybook only, selected a cell with arrow-key navigation, entered edit mode with Enter, and exited with Escape. The displayed value stayed unchanged; focus returned to the web area rather than visibly returning to the grid.
- Inspected the shadcn Data Table preview and guide at 1280×720, the 21st.dev ReUI Data Grid Table live preview, and the Handsontable performance and finance demo states. Reviewed current Handsontable editor/keyboard docs and AG Grid keyboard/edit validation docs.
- Searched Business Suite source for `DataGrid` and `SpreadsheetGrid`; no direct consumer was found. Read source, story, styles, test source, `DS-NFR-006`, ADR-0008, package exports, and the active calibration freeze.
- No tests, typecheck, density check, or build was run because this was an evidence-only documentation pass. No automated verification is claimed.

## RESULTS

- Local layout is a clear compact table with frozen coordinate headers and a selected cell, but the references distinguish record tables from actual spreadsheet editors.
- shadcn’s official pattern is a flexible record table whose feature set stays consumer-owned; 21st.dev’s table is also not the matching cell editor. Handsontable finance is the closer edit/calculation task benchmark.
- Local `fx` formula affordance only edits text; `initialData` seeds local-only state; the 10px fallback conflicts with the accepted minimum.
- Business Suite end-to-end demand is unverified because no import or JSX consumer was found.
- Evidence states: comparison **designed/recorded**; component **not implemented or modified**; automated behavior **not tested**; Business Suite **not integrated**; **not deployed or released**.

## ACCEPTANCE CRITERIA

1. Compare local grid to appropriate current online patterns and Storybook: **PARTIAL** — live local, shadcn, community, and spreadsheet editor views inspected; no saved screenshots or full responsive matrix.
2. Distinguish the spreadsheet editor task from DataTable: **PASS** — reference duties and local capability boundaries recorded.
3. Prove a Business Suite user/consumer journey: **NOT VERIFIED** — direct component use was not found.
4. Preserve accessibility, tenant/data authority and accepted requirements: **PARTIAL** — no authority was added; 10px source fallback is a confirmed standards conflict, and persistent edit reconciliation is unspecified.
5. Prove end-to-end readiness: **NOT VERIFIED** — contract, real consumer, package, state and accessibility proof remain absent.

## REMAINING WORK

- Determine whether this abstraction is wanted in a real Business Suite task, and choose the correct name/contract before feature implementation.
- Resolve the minimum text size, edit persistence, typed data, formula meaning, validation and reconciliation; prove correct focus and grid announcements.
- Prove its actual route, supported density/theme/responsive behavior and package integration after the current calibration gate passes.
- Continue reviewing all remaining inventory rows; this packet does not satisfy the complete design-system goal.

## NEXT ACTION

Continue in ledger order with `compositions/description-list`. Keep the cross-component Input/DataTable/Breadcrumb calibration status visible and do not treat this editor packet as DataTable calibration evidence.

## Knowledge delta

**UPDATED** — Added dated DataGrid task/consumer evidence to the component ledger and PLT-DS traceability. Normative authorities remain unchanged; the 10px conflict and UI/data contract questions refer back to existing ADR and DS requirements.
