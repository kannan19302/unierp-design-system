# BoxPlotChart reference comparison — 2026-09-28

Status: `NOT VERIFIED`. This is a first direct comparison. It records a real official reference and the current local Storybook rendering; it does not complete the chart quality matrix or authorize component elevation.

## Reference selection and local story

- Primary reference: [Highcharts Box Plot](https://www.highcharts.com/demo/highcharts/box-plot), official live five-number-summary example. It is the closest match to this component's data contract and its actual accessibility tree exposes each five-number summary plus a “View as data table” affordance. Highcharts licensing is not adopted or evaluated as an implementation dependency; the reference contributes only observed task, presentation and semantic traits.
- Supplemental reference: [Plotly.js Box Plots](https://plotly.com/javascript/box-plots/), official live JavaScript examples for the zoom/pan/reset controls, grouped/horizontal layouts, and explicit outlier modes.
- Supplemental reference: [Apache ECharts Boxplot Light Velocity](https://echarts.apache.org/examples/en/editor.html?c=boxplot-light-velocity), official live example for axis scale/units, category names, outlier points, and the five-number/outlier data transformation pattern.
- shadcn check: one focused search of official shadcn documentation found no direct box-plot component example. These statistical-chart sources are direct behavior equivalents, not shadcn visual references.
- Benchmark scores are provisional (0–3 each; task fit and semantics weighted twice; maximum 30): Highcharts 24, Plotly 23, ECharts 21. Scores describe observed reference fit and do not substitute for local proof. Accessibility, mobile, themes/density and keyboard matrices have not been verified for all references.
- Traits selected: Highcharts supplies the primary five-number distribution + accessible data table model; Plotly supplies interaction patterns for zoom/pan and outlier presentation; ECharts supplies data transformation and unit/scale labeling examples. Rejected: external brands, typography, colours, code/dependencies and product-specific controls are not copied into Strata.
- Local story: `http://localhost:6006/iframe.html?id=charts-boxplotchart--default&viewMode=story` (`charts-boxplotchart--default`), from `src/charts/box-plot-chart/box-plot-chart.stories.tsx`.
- All three live chart examples and local Storybook canvas were opened and visually inspected in the browser on 2026-09-28. Highcharts' accessibility tree identifies an interactive chart, its ranges, outlier series, and a data-table control. Browser screenshots were inspected in-session but not retained as evidence files. The page and local story canvases were not at identical viewport dimensions, so this is not yet matched-viewport screenshot evidence.

## Observed pattern and differences

Highcharts presents box-and-whisker marks against a numeric scale with ticks and grid, category labels, a title, a theoretical mean reference line, and distinct outlier marks. Its current accessibility tree exposes the chart description, each five-number value, and a “View as data table” control. Apache ECharts similarly labels the value unit and categories and explains its 1.5×IQR whisker rule; its boxplot transform produces separate outlier data. Plotly's live chart exposes zoom, pan, zoom in/out, autoscale, reset, and image download controls; its examples distinguish all data points, suspected outliers, whiskers-only, horizontal orientation, and grouped series.

The Strata default story shows four quarterly five-number summaries and optional outlier dots in an otherwise empty frame. It omits numeric axes, grid, title/unit context, sample-size or distribution detail, legend, and interaction controls. Its SVG is exposed to assistive technology as one image named “Box plot chart”; individual values are not in the accessible tree. The source has no chart interaction handlers, so the current component is a static visualization.

Visual inspection showed Q1–Q3 with Strata brand/success/warning colors, while Q4 rendered as an unstyled gray box. Source assigns Q4 `var(--color-error)`, but the current token vocabulary supplies `--color-danger` plus `--color-error-subtle/default/strong/border`, not `--color-error`. The unresolved SVG color therefore falls back to the browser's default fill/stroke behavior.

## Required work

1. Resolve the Q4 semantic color to an existing supported Strata token and verify all three themes and contrast.
2. Add enough chart framing for users to read value scale and compare values: axes/ticks/grid, chart title and units where provided, and clear group labeling. Retain Strata typography and semantic tokens rather than copying Plotly colors or branding.
3. Provide accessible chart meaning and values (for example, a figure label/summary with an associated data table or equivalent text alternative); verify the accessibility tree and screen reader behavior.
4. Decide and document the supported interaction scope for ERP consumers. Compare zoom/pan/reset, outlier display, and distribution detail with the direct reference; implement only the interactions the approved chart contract requires.
5. Define empty/invalid-data behavior and show the chart at matched desktop and narrow viewports, all three themes, supported densities, and LTR/RTL before changing this row's overall status.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `GAP` — quarterly groups and five-number data render, but the canvas has no readable scale, units, title, or data values. |
| Interaction and keyboard | `GAP` — source renders a static image; no keyboard-accessible chart controls or data navigation. |
| States | `NOT VERIFIED` — `showOutliers` is present in source; no empty/invalid/error matrix inspected. |
| Responsive and reflow | `NOT VERIFIED` — a narrow viewport comparison was not run. |
| Themes | `NOT VERIFIED` — the observed fourth color token is unresolved; no multi-theme matrix run. |
| Density | `NOT VERIFIED` — story offers density values but no matched reference matrix was run. |
| Direction | `NOT VERIFIED` — no RTL check. |
| Accessibility | `GAP` — one generic image label exposes neither group names nor five-number values. Screen-reader verification remains required. |
| Business Suite consumer | `NOT VERIFIED` — no route integration or consumer journey inspected. |

Overall remains `NOT VERIFIED` until gaps are fixed and every applicable axis is proven.
