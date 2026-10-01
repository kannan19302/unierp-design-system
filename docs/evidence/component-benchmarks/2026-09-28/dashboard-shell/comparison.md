# DashboardShell-1 live comparison — 2026-09-28

Status: `PARTIAL`. The DashboardShell benchmark row remains `NOT VERIFIED`; this review covers only the standard desktop story and its synthetic sample composition.

## Reference and captures

- Primary reference: [Shadcnblocks Dashboard 9 — Sales Dashboard](https://www.shadcnblocks.com/block/dashboard9), an overview with a sidebar shell, date/filter/export actions, accounting stat cards, pipeline and revenue charts, an orders table, and fulfillment progress.
- Reference asset: [Dashboard 9 preview image](https://cdn.shadcnblocks.com/shadcnblocks/screenshots/block/dashboard9-4x3.webp), captured as an element at 668 × 502 CSS px.
- Local story: `shells-dashboardshell--dashboard-shell-1`. The 2000 × 1600 desktop capture keeps the full dashboard, records, and footer visible.
- [Side-by-side comparison](comparison-side-by-side.png); [reference capture](reference-dashboard9.png); [local Storybook capture](strata-dashboard-shell-1.png).

The reference page exposes a fixed preview image, not an inspectable live demo viewport. Both are displayed in equal 4:3 panels; this is a scaled visual review rather than a pixel-matched viewport comparison.

## Findings

The major layout layers align: a persistent sidebar and header, a three-card metric row, a two-column analysis area, and records beneath it. Strata clearly labels its data as sample data. The reference puts the order list and fulfillment tracker side by side, while the current Strata story places recent transactions in a full-width records slot and uses a cohort panel in the analysis area. The reference also has dashboard-wide date/platform/product filters and order filtering/pagination; those interactions are not part of this shell composition.

`DashboardShell` remains documented in source as experimental. The comparison does not establish a production consumer contract, live data, filter ownership, responsive behavior, or end-to-end route integration. Before reshaping the generic slots to match the sales-specific preview, confirm the intended Business Suite workflow and consumer-owned data/actions. The side-by-side is evidence of visual differences, not authority to put business filtering inside the L1 shell.

## Remaining verification

- Inspect `DashboardShell-2` through `DashboardShell-5` and the relevant current references.
- Map the actual Business Suite home/dashboard consumer and decide which workflow-driven layout and data/actions it owns.
- Verify narrow/reflow, dark and high-contrast themes, density, direction, keyboard, screen-reader behavior, empty/loading/error/forbidden states, and consumer authorization.

Designed: dashboard region composition. Implemented: no source changes in this comparison cycle. Tested: browser capture and rendered Storybook structure inspected; no code gates required for this documentation/evidence-only update. Integrated: Business Suite route not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; readiness remains `REQUIRED-BUT-INCOMPLETE`.
