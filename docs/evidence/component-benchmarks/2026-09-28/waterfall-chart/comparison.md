# WaterfallChart reference comparison — 2026-09-28

## Packet and scope

- Packet: `DS-WATERFALL-2026-09-28`
- Component: `WaterfallChart` (`src/charts/waterfall-chart/`)
- Story: `http://localhost:6006/iframe.html?id=charts-waterfallchart--default&viewMode=story`
- Review date: 2026-09-28
- Risk: R2 — shared data visualization API and accessible finance presentation; research-only this cycle.
- Decision: `KEEP` the chart concept. A cash-flow/revenue bridge is supported by existing analytics contract values and finance API endpoints. No direct Business Suite import/use of this Strata component was located, so consumer adoption remains unverified.
- Implementation status: none in this packet.

## User task and source baseline

A finance user needs to understand how sequential positive and negative movements change a starting balance and reconcile to an ending or intermediate total. The analytics dashboard contract allows `WATERFALL`; Business Suite finance endpoint classifications list `getWaterfallChartData` for `/advanced-finance/fpa/waterfall-chart` and `getRevenueWaterfall` for `/advanced-finance/expansion/revenue-recognition/waterfall`. These establish a plausible product job and API data surface, not proof of a shipped screen. Search found no active Business Suite `WaterfallChart` import or direct component consumer; the finance reporting route evidence does not establish integration.

The local public data shape is `{ label, value, isTotal? }`. `isTotal` changes color only. Rendering independently scales each absolute value and places every bar from the baseline; it does not derive cumulative ranges. The `showConnectors` option is accepted but ignored. The default cash example has initial and ending balances plus increments, but displays those entries as independent baseline bars. The canvas also clips the ending label. Values use locale-default number formatting without currency/unit metadata, and totals receive a leading plus sign. The root is one `role="img"` with a generic name; the local accessibility tree exposes only “Waterfall chart”, not labels or amounts. Duplicate labels also collide as React keys. Empty/invalid/non-finite inputs, scales, and units have no defined evidenced behavior.

## Live comparison record

Inspected in the same browser session on 2026-09-28:

| Candidate | Observed strengths | Cost / limitation | Score / 30 |
| --- | --- | --- | ---: |
| [Recharts Waterfall](https://recharts.github.io/en-US/examples/Waterfall/) — primary | Open-source React example computes each bar’s cumulative `[low, high]` range, uses custom gain/loss/total shapes, grid, axes and labels. Closest framework-aligned implementation pattern. | Example-level implementation requires the consumer to calculate ranges and construct shapes; the page does not by itself prove accessible keyboard or screen-reader behavior. | 25 |
| [Highcharts Waterfall](https://www.highcharts.com/demo/highcharts/waterfall) — supplemental | Complete finance example with start/intermediate/end totals, floating increments, connectors, USD axis, title, point values and interactive tooltip. | Highcharts states commercial licensing applies before product launch; do not import its theme or implementation wholesale. Accessibility proof must be checked independently for the selected configuration. | 25 |
| [Plotly Waterfall](https://plotly.com/python/waterfall-charts/) — supplemental | Explicit relative/absolute/total measures, cumulative connectors, multi-category and horizontal examples; rendered chart exposes axis labels and chart controls in its accessible tree. | Python documentation and Plotly interaction model are not a direct React/shadcn package recommendation. A toolbar is not automatically appropriate for a compact ERP chart. | 23 |

Score dimensions are 0–3 each: task fit ×2, interaction completeness, state coverage, density/responsive behavior, semantics/keyboard ×2, visual discipline, portability, and maintenance. Scores are provisional reference usefulness, not Strata readiness. No direct official shadcn Waterfall example was found; official shadcn Chart documentation describes Recharts composition, so the official Recharts example is the closest open React equivalent.

## Side-by-side Storybook observation

The local Storybook Default story rendered at `http://localhost:6006/iframe.html?id=charts-waterfallchart--default&viewMode=story`. Its seven cash-flow entries are separate baseline bars, including the starting and ending total; positive/negative increments do not connect cumulatively. The shown values lack a currency label or axis, and the final “Ending Cash” label is clipped. Recharts, Highcharts and Plotly examples show floating cumulative increments and explicit totals/connectors; their axes and chart context make the cumulative task legible. Local and online pages were visually inspected but browser viewport geometry was not normalized before comparison. Browser captures were viewed in-session and not retained as image files; the story URL and observations are retained here.

The local AX tree had one generic image node (“Waterfall chart”). Plotly’s rendered example exposed the category/value text and chart toolbar in its accessibility tree. No keyboard, screen-reader, theme, density, zoom, responsive, RTL, forced-colour, reduced-motion, or error/empty state exercise was completed for this packet.

## Rubric detail

| Reference | Task fit ×2 | Interaction | States | Density / responsive | Semantics ×2 | Visual | Portability | Maintenance | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Recharts | 6 | 2 | 2 | 3 | 4 | 3 | 3 | 2 | 25 |
| Highcharts | 6 | 3 | 3 | 3 | 4 | 3 | 1 | 2 | 25 |
| Plotly | 6 | 3 | 3 | 2 | 2 | 3 | 2 | 2 | 23 |

Recharts is primary because it is a React-native compositional pattern with open portability and a clear cumulative-range calculation. Highcharts contributes a finance-oriented example of totals/connectors/tooltips; Plotly contributes explicit measure semantics and alternative category/orientation examples. Preserve Strata tokens, restrained visual style, existing chart package, and app-owned data/business semantics.

## Required implementation and proof follow-up

1. Define an additive, typed datum contract that distinguishes relative increments from absolute/intermediate totals and defines start/end balances, without silently changing current `value` semantics in the current major.
2. Calculate cumulative start/end geometry; draw actual total bars and connectors; make `showConnectors` effective or remove it only through an approved compatibility change. Correct total sign/value rendering and use stable identity for duplicate labels.
3. Add explicit locale/currency/unit/scale context through a safe additive API or consumer formatting contract; bound and validate non-finite, empty, and invalid input.
4. Provide an accessible chart name plus a reachable values/table alternative or equivalent structured description; do not hide every data point behind one generic image name. Preserve keyboard access for any chart controls.
5. Add loading, empty, error, positive/negative, totals, long labels, small-width, and large-magnitude examples. Verify all three Strata themes, four densities, LTR/RTL, responsive/reflow at 200%, forced colours, reduced motion, keyboard and representative screen reader.
6. Verify finance route/API mapping and a real Business Suite consumer journey, package subpath compatibility, and required focused/package/consumer gates after the elevation calibration gate permits implementation.

## Evidence limits

This is browser observation and source inspection, not retained screenshot evidence, matched viewport proof, accessibility certification, integration, deployment, or release evidence. The Input/DataTable/Breadcrumb calibration gate remains open, so this packet does not authorize bulk implementation.
