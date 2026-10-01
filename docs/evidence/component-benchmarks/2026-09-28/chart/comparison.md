# Charts reference comparison — 2026-09-28

Status: `NOT VERIFIED`. This is a first direct comparison of the `Charts` Storybook default and the shadcn chart composition reference. The references are useful but not a one-to-one match: Strata's `Charts` entry point renders KPI cards in its default story and exports several standalone mini-chart primitives.

## Reference selection and local story

- Primary reference: [shadcn/ui Chart](https://ui.shadcn.com/docs/components/aria/chart). The live documentation demonstrates an interactive bar chart and the compositional pattern around a chart container, plot, optional grid and axis, tooltip, legend, data config, theming, `accessibilityLayer`, and RTL. Its accessibility section says the layer adds keyboard access and screen reader support.
- Supplemental reference: [shadcn Charts library](https://ui.shadcn.com/charts/area), a curated set of chart examples for dashboard contexts. The project dashboard preview route linked from the shadcn blocks docs returned 404 during inspection and is not used as evidence.
- Supplemental reference: [Recharts examples](https://recharts.github.io/en-US/examples/) and [Recharts accessibility documentation](https://github.com/recharts/recharts/blob/main/storybook/stories/API/Accessibility.mdx), for the underlying composed-chart and keyboard/screen-reader behavior. These references inform capability expectations; they do not imply that Strata should adopt Recharts.
- Fit scores (0–3; task and semantics weighted twice; maximum 30): shadcn Chart 27, shadcn Charts library 25, Recharts accessibility guidance 24. shadcn Chart scores highest for a composable chart wrapper and the directly inspected interactive sample. The library collection provides broader dashboard chart patterns; Recharts accessibility describes interaction semantics. Scores are provisional reference-fit notes, not Strata quality scores.
- No reference code, package dependency, brand styling or color values are adopted. Strata must use its existing tokens and approved `@kannan19302/ui` dependencies.
- Local story: `http://localhost:6006/iframe.html?id=charts-charts--default&viewMode=story` (`charts-charts--default`) from `src/charts/chart/chart.stories.tsx`.
- The shadcn chart documentation and local Storybook default were opened and visually inspected on 2026-09-28. The shadcn dashboard preview attempt returned 404. Screenshots were inspected in-session but not retained; viewport dimensions were not matched. The interactive sample exposed series-toggle buttons and month labels in the accessibility tree. No keyboard interaction, theme or responsive matrix was run.

## Observed pattern and differences

The Strata default shows three KPI cards (Revenue, Users, Growth), with values and month-over-month changes. It does not render a plot. `Charts` itself is a layout wrapper with four density variants. The same source module also exports `ChartAccessibleWrapper`, `KPICard`, `MiniBarChart`, `MiniDonutChart`, `Sparkline`, `LineChart`, `AreaChart`, `GaugeChart`, `FunnelChart`, and `HeatmapChart`; the story's default and anatomy examples cover only a subset. Treating this one story as evidence for all those primitives would overstate coverage.

The live shadcn reference presents a chart rather than a KPI card group: a date-series bar plot, summary numbers, series visibility buttons, grid, axes, tooltip and legend, with a `ChartConfig` for labels/colors and an accessibility layer. Its API composes a charting library instead of bundling a collection of bespoke SVG/div mini-charts inside one module. These are distinct abstraction scopes. A real UniERP consumer and intended ownership split should be established before deciding whether the Strata package should keep, separate or replace the current combined export surface.

Source review identifies concrete issues to include in the full audit: the chart table fallback uses the repeated id `chart-data-table`, which can collide when multiple accessible charts render; its inline table uses `--color-border` while current token naming must be verified; several components have no explicit accessible name/data alternative; components are typed with `any`; and interaction affordances such as KPI `onClick` are implemented on non-button `div`s. No code was changed because the elevation/calibration gate remains active.

## Required work

1. Map every exported chart primitive to a clear owner, consumer, story ID, relevant published contract and actual Business Suite journey; do not use the umbrella story as proof for all exports.
2. Compare KPI cards against real KPI/card references separately from plots; compare every chart primitive with a direct equivalent when available.
3. Decide whether the single `chart` module should be a layout wrapper, a composable chart accessibility wrapper, or a catalog of distinct elements, then document the stable public contract and package boundaries.
4. Fix/verify unique accessible table relationships, meaningful data alternatives, token references, keyboard semantics and semantic interactive elements.
5. Verify all states, breakpoints, themes, densities, LTR/RTL, and screen-reader/keyboard behavior for each exported primitive.
6. Inspect real Business Suite routes and journeys; confirm the charts are supported by truthful live data rather than only illustrative local arrays.
7. Retain matched viewport reference/Storybook screenshots and complete the relevant consumer and accessibility proof before changing overall status.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `GAP` — default is KPI cards rather than a plotted chart; the API mixes layout, KPI and chart primitives. |
| Interaction and keyboard | `GAP` — clickable KPI cards use `div`; chart table fallback is a button, but no keyboard matrix was run. |
| States | `PARTIAL` — a KPI loading placeholder exists; other primitives/states are not comprehensively covered. |
| Responsive and reflow | `NOT VERIFIED` — local and reference canvases were not matched and no narrow viewport check ran. |
| Themes | `NOT VERIFIED` — no theme matrix run. |
| Density | `NOT VERIFIED` — stories exercise density for the wrapper/KPIs, not every chart primitive. |
| Direction | `NOT VERIFIED` — shadcn documents RTL, but Strata RTL was not checked. |
| Accessibility | `GAP` — repeated fixed table id; chart alternatives and semantic controls require audit. |
| Business Suite consumer | `NOT VERIFIED` — no route, data source, or journey inspected. |

Overall remains `NOT VERIFIED` until the public scope is clarified, every exported primitive is covered, gaps are fixed, and the consumer/evidence matrix passes.
