# ScatterChart comparison — 2026-09-28

## Scope and identity

The local target is `charts-scatterchart--default`: six points on Latency (ms) and Throughput (k req/s) axes. I opened and visually inspected that live Storybook story and its accessibility tree. The live [MUI X Scatter](https://mui.com/x/react-charts/scatter/) page was inspected, including its processor-density plot; the live [Highcharts Scatter demo](https://www.highcharts.com/demo/highcharts/scatter) was also inspected, including its athlete height/weight plot and accessibility tree. Examples use different datasets and browser viewports, so this is a task-pattern comparison, not a matched-pixel pair. The Highcharts chart has interactive points, a point table control and its chart title/series/coordinate information in the browser accessibility tree. Screen-reader output was not tested. Browser screenshots were visually inspected inline but not retained as files.

- Local Storybook: http://localhost:6006/iframe.html?id=charts-scatterchart--default&viewMode=story
- Primary reference: [MUI X Scatter](https://mui.com/x/react-charts/scatter/)
- Supplemental reference: [Highcharts Scatter demo](https://www.highcharts.com/demo/highcharts/scatter)

The UniERP Tenant Apps [Analytics Experience Architecture](../../../../../../platform/docs/platforms/tenant-apps/ANALYTICS_EXPERIENCE_ARCHITECTURE.md) identifies secondary distributions and complex scatterplots as progressively disclosed analytics content. The API analytics settings also offer “Scatter Plot” as a default chart type. Repository search found no direct Business Suite import/use of Strata `ScatterChart` or `ScatterPlotChart`; existing cockpit previews use area/line. This establishes a documented product task but not current component integration or a verified end-to-end journey.

## Reference comparison

Scores use the benchmark program's eight dimensions: task fit and semantics/keyboard are weighted twice; the six remaining dimensions are interaction, states, reflow, visual clarity, portability and maintenance (maximum 30). They are provisional ratings of reference usefulness, not Strata readiness.

| Reference | Observed pattern | Task / semantics (×2 each) | Interaction, states, reflow, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [MUI X Scatter](https://mui.com/x/react-charts/scatter/) | Continuous x/y axes with labeled values, grid option, multiple named series, stable point IDs, dataset mapping, closest-point tooltip/highlight, hit-area tuning, click events, bubble encodings, custom markers, focusable chart and focused-mark composition. Documentation covers progressive/batch/WebGL rendering trade-offs for larger datasets. | 3 / 2 | 3, 3, 2, 3, 3, 2 | 26 |
| [Highcharts Scatter](https://www.highcharts.com/demo/highcharts/scatter) | Three sports series with distinguishable marker shapes, titled plot, labeled units/axes and scale, series visibility controls, interactive points, accessibility descriptions with x/y and series values, and a view-as-data-table control. Commercial licensing needs evaluation before adoption. | 3 / 3 | 3, 3, 2, 3, 1, 2 | 26 |

MUI is the primary behavior reference for a React scatter chart and its data/interaction configuration. Highcharts supplements a directly inspected accessible point and data-table pattern. MUI documents use of a regression line through custom composition; neither reference warrants silently changing Strata's API. Keep the UniERP visual identity and tokens if Strata is elevated.

## Observed gaps and risks

- **No scale context:** the local chart renders only the two axis baselines and axis names. It has no tick labels, grid, minimum/maximum/domain controls, or visible numeric values. The plot maps each dimension from zero to that dataset's maximum, which can misrepresent negative values and makes separate charts incomparable unless their domains are controlled externally.
- **Accepted trend-line option has no effect:** `showTrendLine` is explicitly discarded in the implementation; enabling it cannot render a regression line. That is an API behavior defect, not an absent test claim.
- **Color and data context:** the sample assigns colors by point index but has no named series or legend. Per-point titles contain labels/coordinates, but the SVG is `aria-hidden`; the local live accessibility tree contains only a generic image named “Scatter plot chart.” No complete data alternative or item navigation is exposed.
- **Data and bounds:** input does not validate finite coordinates, domain, duplicate labels/keys, or marker size. Empty data renders the axes without a defined empty state. Negative values can plot outside the zero-based scale; large/small values and overlapping points have no tested treatment.
- **Geometry and density:** the SVG has a fixed 400-unit viewBox and fixed-height drawing with a fixed 10px label size; container overflow is hidden. Narrow reflow and long axis labels were not verified. Density variants change only padding; the gallery also changes point count and height, so it does not isolate density behavior.
- **Product integration:** the analytics architecture names complex scatterplots, but no direct app import/use of this exported component was found; current cockpit chart previews use area/line. The chart's intended analytics flow, data contract, owner and route-level interaction remain to be mapped against PLT-ERP evidence.
- **Coverage is incomplete:** no local hover/click, keyboard focus/navigation, tooltip, loading/empty/error/invalid state, three-theme/four-density matrix, RTL, 200% zoom, forced colors, reduced motion, screen-reader or consumer journey was verified. Reference documentation and its browser accessibility tree do not substitute for Strata tests.

## Required follow-up before elevation

1. Map the documented analytics task to a named Business Suite route, data source, consuming owner and decision users; reconcile API's `default-chart-type` setting with the implemented chart selector/rendering contract.
2. Define x/y value units, axis domains/ticks, negative and missing values, point/series identity, marker size bounds, trend-line semantics, overlapping points, and large-data performance expectations.
3. Align the API with behavior: implement `showTrendLine` correctly or remove it through an additive, documented compatibility decision; expose configurable domain/scale and any required series, tooltip, click, highlight or selection behavior.
4. Add a complete accessible chart name/context and data alternative. Define keyboard access to points and equivalent value/series announcements, then verify with axe and representative assistive technology.
5. After calibration activation, run a matched-content local/reference review and prove theme, density, direction, small-view, data-boundary, high-contrast and supported interaction states. Complete the affected Business Suite journey and package/consumer gates before setting any row to PASS.

## Readiness

**Overall: NOT VERIFIED.** This is direct reference and Storybook research. A documented analytics task exists, but component integration and end-to-end proof do not. The Input/DataTable/Breadcrumb calibration gate remains open; this packet does not authorize bulk implementation.
