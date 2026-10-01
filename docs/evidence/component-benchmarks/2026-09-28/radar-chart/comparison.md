# RadarChart comparison — 2026-09-28

## Scope and identity

The local component is a static, overlaid polygon radar chart. It accepts axis labels and named numeric series, uses a fixed 0–100 scale, and has no built-in hover, selection, tooltip, or value callback. The default Storybook story is `charts-radarchart--default`: two profiles (`Model Alpha`, `Model Beta`) across Speed, Reliability, Comfort, Safety and Efficiency.

Local URL: `http://localhost:6006/iframe.html?id=charts-radarchart--default&viewMode=story`. The live Storybook visual and accessibility tree were inspected. The visual shows the expected five-axis comparison, though the radial grid has no numeric labels and the component is small in a 360px story column. The AX tree exposes only one generic `Radar chart` image; it omits the metric names, dataset labels and values. Reference pages were opened in the same browser session and their visual examples/source/API guidance inspected, but the actual viewport sizes were not matched and screenshots were not retained.

Repository search found no `RadarChart` use outside its implementation, story, test and export. Therefore an active Business Suite job for this chart has not been established.

## Reference comparison

Scores follow the protocol's eight dimensions, each 0–3, with task fit and semantics/keyboard weighted twice (maximum 30). Scores are provisional; reference accessibility statements were not substituted for testing Strata.

| Reference | Observed pattern | Task / semantics (each weighted ×2) | Interaction, states, reflow, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [MUI X Radar](https://mui.com/x/react-charts/radar/) | Live multi-series radar examples; per-metric min/max, grid divisions/shape, marks/fills, axis or series highlight, tooltips and click handlers. API and accessibility guidance covers arrow-key focus and focused marks. | 3 / 3 | 3, 3, 2, 3, 1, 2 | 26 |
| [Apache ECharts Basic Radar](https://echarts.apache.org/examples/en/editor.html?c=radar&lang=js) | Live example and option source use per-indicator maxima (different units/ranges), titled plot and named legend series. The example was rendered in its editor. Keyboard/screen-reader behavior was not established in this inspection. | 3 / 1 | 2, 2, 1, 2, 2, 2 | 19 |
| [Highcharts Polar/Radar](https://www.highcharts.com/demo/highcharts/polar) | Live polar/radar plot with angular and radial axes, mixed column/line/area series, named series visibility controls, accessible chart summary and optional data table. Commercial licensing is a dependency cost to investigate before any adoption. | 3 / 3 | 3, 2, 2, 2, 1, 2 | 24 |

MUI is the primary behavior reference for a conventional radar chart: it provides metric-specific ranges, legible grid/label composition and chart navigation patterns. ECharts supplements heterogeneous metric ranges. Highcharts supplements radial scale and series visibility/data-table behavior. Copy neither package, theme nor visual identity into Strata; a bespoke chart should preserve Strata typography, tokens and density system.

## Observed gaps and risks

- **No meaningful accessible description:** the root is `role="img"` with the fixed name “Radar chart”, and the SVG is `aria-hidden`. The live AX tree contained only that generic image, hiding the visible legend and axis text from its tree. Assistive technology cannot determine which profiles or values are plotted from the current label.
- **Hard-coded shared scale:** values are multiplied by `value / 100`, and grid rings are fixed at 20/40/60/80/100. The API has no declared min/max or per-axis range. Values outside 0–100 can extend past the chart bounds; incomparable metric units cannot be normalized correctly. The consumer contract must define whether values are percentages or add axis-specific domains.
- **Data shape is unchecked:** dataset values are not required to align with the number of axes; negative, non-finite and out-of-range values are not handled. Duplicate dataset labels and duplicate axis labels can produce duplicate React keys.
- **Labels and grid:** grid rings have no numeric labels or tick context; label size is fixed at 10px and label position uses a fixed 115% radius. Long labels, many metrics and narrow layouts have no proven collision/reflow strategy. Container `overflow: hidden` can clip labels when the fixed SVG does not fit.
- **Series distinction:** multiple shapes are only differentiated by color and a small legend dot. There are no point marks or hover/focus emphasis, no legend controls, and no direct values. The translucent overlays can obscure each other as series count increases.
- **Density mismatch:** component density variants change container padding and legend gaps, not the visualization's size or data marks. The density gallery manually changes `size`, so it does not prove density itself scales this component.
- **Use and owner unproven:** no active consumer import was found in the repository search. Before keeping/elevating a general chart, establish the real Business Suite comparison task and acceptable scale semantics; radar charts may be a poor fit when users need precise comparisons.
- **Coverage gap:** no local keyboard or pointer interaction exists. Themes, all densities, LTR/RTL, narrow reflow, zoom, forced colors, reduced motion, screen-reader output and consumer journey were not verified. MUI documents chart-specific keyboard/accessibility behavior, but this is reference guidance only.

## Required follow-up before elevation

1. Identify a Business Suite use case and consumer owner; decide whether this chart should be retained, adapted or deprecated based on an actual workflow and comparison task.
2. Define input semantics: common 0–100 percentages versus per-axis minima/maxima, expected units, allowed number of axes/series and handling of invalid/missing values.
3. Provide a meaningful accessible chart label plus an equivalent accessible data representation for every axis/value/series. Add keyboard focus/navigation or keep the component explicitly static and expose its complete data nonvisually.
4. Add visible scale context, distinguish series beyond color, and specify collision behavior for many/long labels and narrow viewports. Make density behavior substantive and measurable.
5. Compare the local and selected benchmark at matched desktop/narrow viewports; verify themes, density, direction, 200% zoom, focus, keyboard, forced colors, reduced motion, axe and representative screen-reader output.
6. Only after calibration activation, create the component change contract, implement against the agreed owner semantics, then run package and affected-consumer gates plus a real Business Suite journey.

## Readiness

**Overall: NOT VERIFIED.** This is a reference research packet, not an elevation decision. The Input/DataTable/Breadcrumb calibration gate remains open. No code, test, consumer integration, publication, deployment or release change is claimed.
