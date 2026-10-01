# DataTable reference and Strata comparison — 2026-09-28

## Reference and retained desktop pair

Primary online reference: [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table). The existing matched desktop captures are [reference](reference-shadcn-data-table-desktop.png) and [Strata Enterprise Workbench](strata-table-workbench-desktop.png); the [side-by-side comparison HTML](comparison.html) preserves the prior desktop inspection. The reference provides composable table structure and task-level examples; Strata's Enterprise Workbench sample presents labeled invoices, status, amounts, selection and row actions. This is a pattern comparison, not a claim of feature parity or a complete business workflow.

## Responsive comparison

At 320×740, the official [shadcn Base Table](https://ui.shadcn.com/docs/components/base/table) renders its first invoice table at 327px wide inside a 190px visible horizontal-scroll region; document/body remain 320px wide. The [captured reference region](reference-shadcn-table-region-320.png) records the clipped columns and scrollbar viewport. The [Strata mobile alternative](mobile-alt-strata-standard.png) shows eight invoice cards with ID, customer, status, amount, selection, and row actions; its page stays 320px wide. Strata switches to this caller-provided presentation when its container is at most 48rem wide and returns to the existing table above that width. [SAP Fiori responsive-table guidance](https://experience.sap.com/fiori-design-web/responsive-table/) informed the label/value line-item treatment. The two solutions serve similar invoice-review needs with different mobile behavior; the local alternative does not claim that every data grid should become cards.

The persisted local matrix covers 3 themes × 4 densities × 2 viewports (24 captures). See [matrix captures, browser results and limitations](matrix-captures.md). All 24 configurations applied, showed the expected presentation and eight current records, and had no page errors or document overflow. The 12 narrow axe samples have zero violations; one keyboard path covers selection and row action. The online and local screenshots are comparable at the 320 CSS-pixel viewport, but the full-page story/reference content heights differ.

## Status

Theme/density propagation, the opt-in narrow alternative, sampled geometry, 320px containment, narrow axe scans and the synthetic keyboard path are verified for the documented Storybook cases. RTL, actual 200% zoom, OS modes, manual screen-reader use, complete error/selection/edit-state parity, published-package behavior and a rendered Business Suite consumer journey remain open. DataTable overall stays `NOT VERIFIED` and remains behind the frozen calibration gate.
