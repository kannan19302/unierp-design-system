# BulletChart reference comparison — 2026-09-28

Status: `NOT VERIFIED`. This is a direct visual comparison of the local Storybook default with live bullet-chart references. It does not complete the chart quality matrix or authorize component elevation.

## Reference selection and local story

- Primary reference: [Nivo Bullet](https://nivo.rocks/bullet/), the closest match to Strata's range/measure/target model and its multi-KPI layout. Its live example displays five independently scaled measures with numeric axes, labeled metrics, qualitative range bands, measure bars and target markers. Nivo exposes property controls and recipes for custom ranges, measures and markers.
- Supplemental reference: [Highcharts Bullet graph](https://www.highcharts.com/demo/highcharts/bullet-graph), a business KPI example showing Revenue, Profit and New Customers against targets, with qualitative bands, a shared presentation title and numeric ticks. Its documentation explains the measure-versus-target model and plot bands: [Bullet chart documentation](https://www.highcharts.com/docs/chart-and-series-types/bullet-chart).
- Supplemental reference: [SAP Fiori Bullet Micro Chart](https://experience.sap.com/fiori-design-web/bullet-micro-chart/), an enterprise design-system reference. The page describes the primary measure, target comparison and qualitative ranges, and frames bullet charts as a compact dashboard visualization.
- Additional reference attempted: [Observable Plot Bullet graph II](https://observablehq.com/@observablehq/bullet-graph-2). The notebook page loaded, but its embedded chart cells remained loading placeholders during inspection, so it is not scored or used as visual evidence.
- shadcn check: one focused search of official shadcn documentation found no direct bullet-chart example. These chart and design-system references supply behavioral patterns, not borrowed branding or code.
- Provisional fit scores (0–3 each; task fit and semantics weighted twice; maximum 30): Nivo 28, Highcharts 27, SAP Fiori 26. Scores record reference fit, not component quality or verification. Nivo ranks first because its multi-range/multi-measure/marker model matches the current API most closely; Highcharts is strongest for business KPI context; SAP provides enterprise micro-chart guidance.
- Traits selected: preserve Strata's one-measure/one-target/three-range API; use the references to assess clear qualitative range contrast, axis/scale context, row labeling, and actual/target values. Do not import third-party colours, typography, branding, code, dependencies or product controls.
- Local story: `http://localhost:6006/iframe.html?id=charts-bulletchart--default&viewMode=story` (`charts-bulletchart--default`), from `src/charts/bullet-chart/bullet-chart.stories.tsx`.
- Nivo, Highcharts, SAP Fiori and the local Storybook canvas were opened and visually inspected in the browser on 2026-09-28. The Observable reference was opened but its chart did not render. Browser screenshots were inspected in-session but not retained as evidence files; the reference and local canvases were not at identical viewport dimensions. Matched-viewport screenshots and interaction/keyboard behavior are not verified.

## Observed pattern and differences

The local default renders a single Revenue bar with three qualitative background ranges, a target marker, and textual actual/target values underneath. The visual is compact and maps to the core bullet-chart pattern. However, the range boundaries are too faint to read clearly in the current story; the component provides no numeric scale/ticks, chart title or unit context beyond a label and formatted values. Its accessible tree exposes only one image named “Revenue bullet chart,” so the actual, target, and range values are not available as separate semantic text. The source has no hover, focus, or keyboard interaction handlers.

Nivo makes each row's scale visible and separates label, ranges, measure and marker. Highcharts demonstrates the business comparison across multiple KPI rows and shows a title and ticks. SAP Fiori documents the core purpose and compact enterprise context. The API difference matters: Strata currently supports one measure per instance, so Nivo's multi-row design is a composition reference rather than a requirement to expand the contract.

## Required work

1. Improve range-band distinguishability while preserving semantic tokens and contrast across themes.
2. Decide whether the chart contract requires a numeric axis/ticks or whether explicit actual, target and range values are enough for the supported compact use case; document that decision and unit/scale semantics.
3. Expose label, actual, target, and qualitative ranges to assistive technology through a useful text alternative, table, or equivalent. Verify with accessibility tree and screen-reader behavior.
4. Define and verify empty, invalid, overflow, target-outside-range and actual-outside-range states.
5. Compare desktop and narrow viewports, all three themes, supported densities, LTR/RTL, and keyboard/screen-reader behavior before changing this row's overall status.
6. Inspect a real Business Suite consumer route and journey; Storybook coverage alone does not establish consumer readiness.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `PARTIAL` — the actual, target and three qualitative ranges render, but no readable scale is shown and the range distinctions are faint. |
| Interaction and keyboard | `NOT VERIFIED` — no interaction handlers are present; the required interaction model has not been accepted. |
| States | `NOT VERIFIED` — no empty, invalid, overflow or out-of-range matrix inspected. |
| Responsive and reflow | `NOT VERIFIED` — no narrow viewport comparison was run. |
| Themes | `NOT VERIFIED` — no multi-theme comparison was run. |
| Density | `NOT VERIFIED` — stories exist, but no matched reference matrix was run. |
| Direction | `NOT VERIFIED` — no RTL check. |
| Accessibility | `GAP` — the chart is exposed as one generic image label; individual values and range meanings are not separately announced. |
| Business Suite consumer | `NOT VERIFIED` — no route integration or consumer journey inspected. |

Overall remains `NOT VERIFIED` until the gaps are addressed and every applicable axis is proven.
