# FunnelDropoffAnalyzer reference comparison — 2026-09-28

Status: `NOT VERIFIED`. This records a direct visual comparison of the local FunnelDropoffAnalyzer default with three official funnel references. The Strata component is a funnel analytics panel composed of horizontal stage bars and diagnostics; it is not a conventional centered funnel plot. The reference comparison should inform the visual/data contract without removing the existing analyzer workflow unless the consumer requirements call for that change.

## Reference selection and local story

- Primary: [Highcharts Funnel chart](https://www.highcharts.com/demo/highcharts/funnel), a live sales funnel with a chart title and labels that combine stage names and counts; responsive rules adjust label placement and funnel width. [Official series documentation](https://www.highcharts.com/docs/chart-and-series-types/funnel-series) describes stage narrowing by value.
- Supplemental: [Nivo Funnel](https://nivo.rocks/funnel/), a live narrowing funnel with stage values and controls for dimensions, labels, separators, interaction and motion. Nivo marks this experimental; its implementation status is not treated as a production quality claim.
- Supplemental: [Qlik Funnel chart guidance](https://help.qlik.com/en-US/sense/May2025/Subsystems/Hub/Content/Sense_Hub/Visualizations/VisualizationBundle/funnel-chart.htm), an enterprise reference explaining sequential subset semantics, stage labeling, sorting and alternate area/height/width geometry. It documents use for conversion and bottleneck analysis.
- Provisional fit scores (0–3, task/semantics weighted twice; max 30): Highcharts 27, Qlik 26, Nivo 24. Highcharts matches the canonical shape and stage counts; Qlik supplies enterprise usage and semantics; Nivo offers configuration and label patterns but is experimental. Scores are pattern fit, not Strata quality.
- No external colors, code, typography, controls or dependencies are adopted.
- Local story: `http://localhost:6006/iframe.html?id=charts-funneldropoffanalyzer--default&viewMode=story` (`charts-funneldropoffanalyzer--default`) from `src/charts/funnel-chart/funnel-chart.stories.tsx`.
- All three reference pages and the local Storybook default were visually inspected on 2026-09-28. Screenshots were viewed in-session but not retained; viewport dimensions were not matched. No keyboard, interaction, responsive, theme or RTL matrix was run.

## Observed pattern and differences

The local component presents an enterprise-acquisition workflow as five wide horizontal progress bars with stage count, total conversion, step conversion, drop-off count/percent and median time. It also includes a date range label, cohort filter, selectable stages, and a diagnostic pane. This is richer than a simple funnel chart and could suit a conversion-analysis journey, but the local story does not show the familiar narrowing stage geometry present in all three references. The row's `funnel-chart` ledger name hides that the exported component is `FunnelDropoffAnalyzer` and owns cohort/selection/diagnostics as well as a plot-like display.

The stage names, counts and percentages are text in the DOM and stage selection uses buttons, which gives a stronger textual basis than an SVG-only chart. Source does not validate monotonic counts or reconcile caller-supplied conversion/drop-off metrics against counts. The bar has a minimum width of 8%, so a zero count still looks nonzero; counts above the initial stage can overflow 100%. Empty input produces a header with 0% conversion but no explicit empty state. The `segments` select only fires `onSegmentChange`; it does not independently update the displayed data. These behaviors need a consumer-defined contract and tests before adopting a conventional funnel geometry.

## Required work

1. Identify the actual UniERP route, analytics event owner, tenant scope, and customer decision supported by this funnel. Verify event definitions and truthful source data; the sample acquisition journey is illustrative.
2. Decide if the supported result should remain a conversion-analysis panel, add a conventional funnel plot, or separate analyzer controls from a reusable chart. Capture the choice in the owning requirement/contract before changing the implementation.
3. Validate ordered/subset stage counts, zero/negative/nonfinite values, percentage formulas, duplicate IDs, and time units; derive metrics from one authoritative data contract or surface data-quality errors.
4. Define empty/loading/error/forbidden states and controlled selection/filter semantics. Verify changing cohort refreshes real data.
5. Preserve readable stage labels and provide a keyboard/screen-reader interaction matrix for selectors, step buttons and diagnostics.
6. Verify responsive layout, all themes, densities, LTR/RTL and matched-view screenshots against selected direct references.
7. Confirm the extension-level `FunnelChart` alias does not hide an incompatible public contract or cross-root consumer dependency.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `PARTIAL` — a staged analytics journey and diagnostics render, but canonical funnel geometry and an accepted consumer contract are absent. |
| Interaction and keyboard | `PARTIAL` — step buttons and cohort select exist; keyboard behavior and filter/data updates are not verified. |
| States | `GAP` — empty and invalid/out-of-order count behavior is undefined. |
| Responsive and reflow | `NOT VERIFIED` — no narrow comparison. |
| Themes | `NOT VERIFIED` — no theme matrix. |
| Density | `NOT VERIFIED` — density stories exist, but no legibility matrix. |
| Direction | `NOT VERIFIED` — no RTL check. |
| Accessibility | `PARTIAL` — metrics are textual and steps are buttons; full keyboard/screen-reader behavior and status announcement are unverified. |
| Business Suite consumer | `NOT VERIFIED` — no actual route, tenant-scoped event source or customer journey inspected. |

Overall remains `NOT VERIFIED` until the consumer contract, data semantics, states and proof matrix are complete.
