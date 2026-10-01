# Sparkline comparison — 2026-09-28

## Scope and identity

The local target is `charts-sparklinegrid--default`, a four-row Revenue/Expenses/Active Users/Churn Rate table with inline five-point line trends, current values, and percentage changes. I visually inspected its live Storybook canvas and accessibility tree. The online primary reference is the live [MUI X Sparkline](https://mui.com/x/react-charts/sparkline/) documentation/demo; [AG Grid Sparklines Overview](https://www.ag-grid.com/react-data-grid/sparklines-overview/) is supplemental for the separate grid-cell use case. Both online pages were inspected live, including the AG Grid overview illustration and its documented array-data/minimum configuration. The reference and local viewports/content were not matched, and screenshots were not retained.

- Local Storybook: http://localhost:6006/iframe.html?id=charts-sparklinegrid--default&viewMode=story
- Primary reference: [MUI X Sparkline](https://mui.com/x/react-charts/sparkline/)
- Supplemental reference: [AG Grid Sparklines Overview](https://www.ag-grid.com/react-data-grid/sparklines-overview/)

MUI documents a compact sparkline primitive for dashboards, tables, and inline text, with line/area/bar forms, optional tooltip/highlight, x-axis labels, and controlled y-axis bounds. AG Grid shows line, area, column, and bar microcharts embedded in data-grid cells, with configurable options. Its sparkline feature is marked Enterprise, so reuse would require a separate licensing decision; this is reference research, not a dependency recommendation.

## UniERP use and integration contract

The Strata export named `Sparkline` is an alias of `SparklineGrid`, whose API requires `rows` and renders a full four-column metric table. In contrast, Tenant Admin imports `Sparkline` from `@kannan19302/ui` in `settings/page.tsx` and `settings/system-operations/SystemHealthTab.tsx`, then calls it with the primitive shape `{data, width, height, color, fill}`. That is an observed public API/consumer mismatch; the present app/package typecheck remains a separate failing integration gate. The Business Suite analytics cockpit has its own private inline component in `src/components/analytics/AnalyticsCockpitClient.tsx` with `{points, color}` and 110×24 SVG geometry; it does not consume Strata's export. Several cockpit KPI trends have only two synthesized points, and some are constant values. The analytics metrics contract also carries a numeric-array `sparkline` field. These usages show an actual product need for a compact trend primitive, but do not prove that the current Strata component serves the Business Suite journey.

## Reference comparison

Scores use the benchmark's task-fit and semantics/keyboard dimensions at double weight, plus interaction, states, reflow, visual clarity, portability, and maintenance (maximum 30). Scores rate reference usefulness provisionally; they are not Strata readiness scores.

| Reference | Observed pattern | Task / semantics (×2 each) | Interaction, states, reflow, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [MUI X Sparkline](https://mui.com/x/react-charts/sparkline/) | Compact chart intended for inline/dashboard contexts; line/area/bar plots; configurable x labels and y bounds; optional tooltip and highlight; demo presents a labeled metric and current value adjacent to trend. | 3 / 3 | 2, 2, 2, 3, 3, 2 | 26 |
| [AG Grid Sparklines](https://www.ag-grid.com/react-data-grid/sparklines-overview/) | Small chart inside a grid cell; array-of-numbers default line and configurable area, column, and bar plots; overview image compares multiple rows and encodings. Enterprise licensing applies. | 3 / 2 | 2, 2, 2, 3, 1, 1 | 21 |

The two references address separate Strata needs: MUI is the closer pattern for the primitive used beside Business Suite KPI values, and AG Grid informs the inline-in-table composition. Strata's current `SparklineGrid` is a composite table, so preserve it as a distinct product pattern if retained and avoid treating its alias as equivalent to a chart primitive. Keep Strata tokens and define any API evolution through the owning contract process.

## Observed gaps and risks

- **Export/API identity:** `Sparkline` names a composite grid, while Tenant Admin's call sites expect a primitive. Business Suite independently duplicates a primitive locally. The desired public names, owners, compatibility path, and consumer migration contract need resolution.
- **Trend communication:** the local SVG uses `aria-hidden="true"`; the live accessibility tree exposes row label, current, and change but no historical values or trend description. The chart cell is effectively silent. Change direction is encoded through green/red and arrows; semantics should remain understandable without color and should distinguish desirable direction by metric (for churn, a numeric increase is not necessarily positive).
- **Meaning and scale:** each line normalizes to its own min/max, hides absolute range and period, and omits dates/labels, points, and values. Separate trends therefore cannot be compared by height. Constant and one-value series, missing/negative/non-finite values, and data limits need explicit behavior.
- **Missing primitive behavior:** the composite exposes no `data`, `width`, `height`, `color`, `fill`, plot type, domain, x labels, tooltip, or highlight options. It silently returns no SVG for fewer than two points. Existing density only changes chart dimensions and table typography/padding.
- **Composite states and layout:** local Default shows a clean centered table; no loading, empty, error, invalid-data, selected, or disabled state was proved. Horizontal overflow is enabled; small-width behavior and long labels were not inspected. Header and row keys use array indices.
- **Coverage remains open:** themes, complete four-density comparison, RTL, keyboard, true 200% zoom, forced colors, reduced motion, WCAG 2.2 AA, and representative consumer journeys were not verified. Online documentation does not substitute for local component or consumer proof.

## Required follow-up before elevation

1. Reconcile the exported `Sparkline` identity with the two Tenant Admin call sites and Business Suite's inline implementation. Establish PLT-DS and PLT-ERP owners, intended distinct primitive/composite contracts, and an additive migration plan before code changes.
2. Define time period and point/value semantics, numeric bounds/scale policy, empty/single/constant/invalid data behavior, units, desirable direction per metric, and optional labels/highlight/tooltip interactions.
3. Provide a nonvisual trend/value alternative that exposes sufficient context without relying on color. Specify keyboard behavior if interactive and verify representative assistive technology.
4. After the Input/DataTable/Breadcrumb calibration gate is open, compare local and reference examples with matched content and viewports; complete the relevant theme/density, LTR/RTL, narrow layout, zoom, forced-color, reduced-motion, and accessibility checks.
5. Integrate the approved primitive into the named Business Suite KPI journey and prove the package/app typecheck and focused behavior without conflating Storybook evidence with consumer readiness.

## Readiness

**Overall: NOT VERIFIED.** This packet records direct local Storybook and live reference research and a concrete consumer API mismatch. It does not establish implementation, consumer integration, an end-to-end Business Suite journey, or release readiness. The Input/DataTable/Breadcrumb calibration gate remains open; this packet does not authorize broad implementation.
