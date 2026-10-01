# TreemapChart comparison — 2026-09-28

## Scope and identity

The inventory row is `charts/treemap-chart`; its expected story is `charts-treemapchart--default` with AnatomyAndComposition and DensityGallery. The local component API accepts `{label, value, children?, color?}`, height, colorScale, and four density values. Current Default data contains five flat department nodes.

- Local Storybook: http://localhost:6006/iframe.html?id=charts-treemapchart--default&viewMode=story
- Primary reference: [Recharts Nested Treemap](https://recharts.github.io/en-US/examples/NestedTreemap/)
- Supplemental reference: [Apache ECharts Basic Treemap](https://echarts.apache.org/examples/en/editor.html?c=treemap-simple)
- Supplemental reference: [Google Charts Treemaps](https://developers.google.com/chart/interactive/docs/gallery/treemap)
- shadcn search: official chart documentation uses Recharts composition, but no direct Treemap chart example was found in the current chart gallery.

The three online references were opened and visually inspected. Recharts Nested Treemap was clicked: it changed the displayed root and showed a point tooltip; its example describes parent-node zoom and breadcrumb navigation. ECharts Basic Treemap was run and showed nested nodes with a breadcrumb trail. Google Charts rendered a country/region hierarchy, size and colour context, and a colour scale; its documentation describes highlight, drill-down, roll-up, and tooltips. Recharts is MIT licensed; ECharts is Apache 2.0. Google Charts is a hosted library governed by Google Charts terms, so it is reference material only here, not a dependency recommendation.

The local story could not be visually inspected: both the direct iframe and Storybook manager remained on a loading spinner; the manager accessibility tree exposed a “Content is loading...” progress indicator. A read-only request to the story URL returned HTTP 200 and the current `index.json` also returned HTTP 200. The browser did not expose the rendered story or an error detail. A shell/terminal session was not attached to this task. Online and local screenshots were not retained. Therefore there is no valid side-by-side match claim.

## UniERP task and consumer evidence

The L0 analytics dashboard contract includes `TREEMAP` in its chart-type enum. Repository search found no Business Suite import or use of Strata `TreemapChart`. Business Suite's `/reporting/drilldown` page describes hierarchical dimension analysis, but the inspected route displays its executed results in `DataTable`; it does not use a treemap. This is a plausible analytics capability, not proof that the Strata component is integrated or required by that route. PLT-ERP still needs to name the customer task, owner, and consuming dashboard journey.

## Reference comparison

Scores follow the benchmark rubric: task fit and semantics/keyboard are weighted twice, plus interaction, states, density/responsive behavior, visual discipline, code portability, and maintenance; maximum 30. Ratings are provisional measures of reference usefulness, not Strata readiness. Semantics/keyboard scores remain low where actual equivalent chart examples did not prove keyboard access.

| Reference | Observed pattern | Task / semantics (×2 each) | Interaction, states, responsive, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [Recharts Nested Treemap](https://recharts.github.io/en-US/examples/NestedTreemap/) | Nested quantitative rectangles; click zooms parent to children; breadcrumb returns to prior level; tooltip provides node/value context; responsive chart size. Live click and tooltip observed. MIT. | 3 / 1 | 3, 2, 3, 3, 3, 2 | 24 |
| [Apache ECharts Basic Treemap](https://echarts.apache.org/examples/en/editor.html?c=treemap-simple) | Nested hierarchy; parent/child rectangle areas; rendered breadcrumb trail; the chart ran in the official example editor. Official treemap options document zoom/drill behavior. Apache 2.0. | 3 / 1 | 3, 2, 3, 3, 2, 2 | 23 |
| [Google Charts Treemaps](https://developers.google.com/chart/interactive/docs/gallery/treemap) | Hierarchical nodes with size and a separate color dimension; parent framing, scale, labels; documented highlight, drill-down/roll-up, and customizable tooltips. Official hosted library. | 3 / 1 | 3, 3, 2, 3, 1, 1 | 21 |

The closest retained Strata direction is a nested rectangular area chart: area should encode a defined positive quantitative value, and visible nesting must match parent/child structure. Recharts is the primary pattern for a React tree with breadcrumb-driven drilldown and tooltip; ECharts adds hierarchy/layout context; Google adds a distinct size-plus-colour data encoding. Do not copy external theme, markup, or behavior without mapping to Strata tokens and ERP semantics. An official shadcn treemap implementation was not found, so no false shadcn parity claim is made.

## Observed gaps and risks

- **It is not currently a treemap layout.** `src/charts/treemap-chart/treemap-chart.tsx` sets each top-level node's flex-grow from its share of the total. The CSS uses a wrapping flex row. This is a weighted strip/bar arrangement, not a two-dimensional area layout that optimizes rectangle aspect ratios.
- **Hierarchy is accepted but ignored.** `TreemapNode.children` is declared but no child is traversed or rendered. Parent-child relationships cannot be seen, selected, or navigated.
- **No metric semantics or interaction.** The component displays label and formatted numeric value without a title, unit, breadcrumb, scale, colour legend, tooltip beyond browser `title`, or callback. Per-node colors are arbitrary palette positions, so they do not communicate a second metric. There is no keyboard interaction or selection model.
- **Accessibility hides the data.** The root is a single `role="img"` with generic `aria-label="Treemap chart"`; visual cell label/value spans are hidden from assistive technology by the image role. No structured data alternative is provided.
- **Data safety and layout.** Values are neither validated nor constrained to finite positive weights. Empty color scales, duplicate labels/keys, zero/negative totals, zero and tiny nodes, nested parent totals, long labels, and many nodes lack defined behavior. Values use locale formatting without a caller-supplied locale or unit. Fixed 60px minimum block size and hidden overflow can distort the requested proportions or clip nodes.
- **No provider-state evidence.** Empty/loading/error/invalid-data, hover/focus/selection, theme, four-density, RTL, narrow width, zoom, reduced-motion, forced-color, or accessibility matrices were not run. Local Storybook rendering is blocked at the browser loader in this session.
- **Product ownership remains open.** L0 permits a `TREEMAP` chart type, but no active Business Suite Strata consumer was found. The drilldown route uses a table. The actual customer task and product owner must be confirmed before integration.

## Required follow-up before elevation

1. Reconcile the component's stable intended task, `KEEP`/`MERGE`/`DEPRECATE` decision, PLT-DS owner, and PLT-ERP consumer using the `TREEMAP` dashboard contract and a named real reporting journey.
2. Define the tree data contract, positive measure/units, parent aggregation rule, stable node identity, optional colour dimension/legend, and treatment for missing, zero, negative, duplicate, and non-finite values. Preserve supported public props or contract an additive adapter; do not silently replace current-major behavior.
3. Implement actual hierarchical rectangle geometry, with labels that adapt to available area, and deliberate resize/reflow behavior. Decide whether drilldown/breadcrumb and hover detail are required by the Business Suite task.
4. Expose node identity, parentage, value, and any colour metric through accessible nonvisual data. If interaction is supported, define equivalent keyboard navigation, selection, and announcements; test with axe and representative assistive technology.
5. Clear the Input/DataTable/Breadcrumb calibration gate before broad implementation. Then restore/diagnose local Storybook rendering and capture same-content, matched-viewport local/reference evidence across applicable themes, densities, direction, zoom, small screens, high contrast, and motion settings.
6. Integrate only after the Business Suite owner confirms the actual task; prove package exports, typecheck/build, route behavior, and the real consumer journey.

## Readiness

**Overall: NOT VERIFIED.** Online reference research and source review show that current rendering does not implement the declared hierarchical treemap task. The local Storybook preview remained in a loading state, no active consumer was found, and theme/state/accessibility/consumer proof is incomplete. The calibration gate remains open; this packet does not authorize broad implementation.
