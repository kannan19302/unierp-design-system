# DataTable density inheritance — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — shared component runtime behavior`. Owner: PLT-DS. Consumer: Business Suite PLT-ERP and all `@kannan19302/ui` consumers. This contract changes the default density behavior only when callers omit the `density` prop; an explicitly supplied density or row height remains authoritative. It changes no data, sorting, selection, persistence, or API shape beyond making the already-optional density prop inherit its environment by default.

See [the iteration evidence report](../evidence/component-benchmarks/2026-09-28/table/iteration-report.md). Shared package and Storybook validation passed; consumer and frozen calibration gates remain open.

## Acceptance criteria

1. **AC-01 — Platform context:** DataTable with no `density` prop follows the nearest supported density context (ThemeProvider/ThemeScope) or the root density token cascade, including Storybook globals.
2. **AC-02 — Explicit override:** callers that pass `density` retain the requested four-tier row, cell padding, and typography behavior; explicit `rowHeight` remains authoritative for virtualization.
3. **AC-03 — Coherent virtualization:** omitted density does not make virtual row-window calculations disagree with rendered row height. Use the supported density context where present and a documented standard fallback where no context is available.
4. **AC-04 — Proof:** add focused regression coverage for all four densities, nearest-scope inheritance, explicit override, and virtualized sizing; verify typecheck, focused table tests, Storybook checks/build, package lint/build as available.
5. **AC-05 — Safe handoff:** no Business Suite consumer source migration until the shared package is validated; overall Table calibration remains `NOT VERIFIED` until frozen protocol gates and end-to-end consumer evidence pass.

## Authority and rollback

Requirements: `DS-FR-007`, `DS-FR-009`, `DS-NFR-004`, `DS-NFR-006`, `DS-NFR-007`, and `DS-NFR-009`; Foundation density tokens in `src/foundation/tokens/density.css`; DataTable API in `src/compositions/table/table.tsx`. Consumer ownership is PLT-ERP. The observed defect is that Storybook's root density globals vary, but an omitted DataTable `density` prop defaults to explicit `standard`, so the component overrides the selected environment. Rollback is reverting this contract's implementation and tests; the explicit density API remains supported.

## Knowledge delta

`UPDATED` — browser measurement found that the Business Suite workbench stayed at 44.8px across all 12 theme-density combinations even though the four density globals changed. The story's omitted density was being coerced to standard by the component default. This packet separates inherited environment density from explicit caller override while preserving virtual row math.
