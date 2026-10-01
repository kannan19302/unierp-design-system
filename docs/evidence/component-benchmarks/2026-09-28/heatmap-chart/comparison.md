# HeatmapChart / ResourceCapacityHeatmap comparison — 2026-09-28

## Scope and identity

The ledger row `heatmap-chart` is a resource-capacity planning table: team members are rows, capacity periods are columns, and each cell is a selectable allocation-versus-capacity value. It is not a generic statistical heatmap. The export is `ResourceCapacityHeatmap` aliased as `HeatmapChart`. A generic matrix-based `HeatmapChart` also exists in `src/charts/chart/chart.tsx` and is exported through the chart barrel, so exact package consumers and intended naming/ownership need resolution before convergence.

Local Storybook default: `http://localhost:6006/iframe.html?id=charts-heatmapchart--default&viewMode=story`. The live page was visually and accessibility-tree inspected. It shows two team members over three sprints with totals; labels and numeric percentages accompany the tier colors. The AX tree exposes a named table and per-cell controls with resource, period, hours and utilization in each accessible name. The browser viewport was not matched to reference viewports and no capture was retained. The reference ClickTime page is product guidance with embedded examples, not an authenticated runtime view of its capacity-planning application.

## References and benchmark decision

Scores are provisional and use the protocol's eight dimensions (0–3 each), with task fit and semantics/keyboard weighted twice, for a 30-point maximum.

| Reference | Observed pattern | Task / semantics (each weighted ×2) | Interaction, states, reflow, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [ClickTime Capacity View](https://support.clicktime.com/hc/en-us/articles/39650150557709-Use-the-Capacity-View) | Exact resource-planning job: staff by month, utilization against capacity or billing goal, time-off-aware capacity, sorting/filtering, drilldown, empty-results prompt, and exports. Its official help page and example images were inspected; authenticated product UI was not available. | 3 / 2 | 2, 3, 2, 2, 1, 2 | 22 |
| [MUI X Heatmap](https://mui.com/x/react-charts/heatmap/) | Live two-dimensional plotted heatmap with axis categories, numeric color scale/legend, item highlight/fade, click events and tooltip; keyboard testing guidance is present. Heatmap is in MUI X Pro. | 1 / 3 | 3, 3, 2, 2, 1, 2 | 21 |
| [Highcharts Heatmap](https://www.highcharts.com/demo/highcharts/heatmap) | Live categorical matrix chart with color-coded values, title/subtitle, labels, theme controls, accessibility summary, point descriptions and an optional data table. Commercial use requires a license. | 1 / 3 | 2, 2, 2, 2, 1, 2 | 19 |

ClickTime is the primary task benchmark because its capacity view has the closest business meaning. MUI and Highcharts are supplemental only for chart-specific color encoding, focus/highlight, tooltip, theme, and accessible data exposure. Their continuous plotted-value heatmaps are not a reason to replace the resource table or import their chart dependencies/theme. Reuse behavior patterns only after the consumer contract and Strata tokens are established.

## Findings

- **Selection is broken for the story's identifiers:** `selectedCellKey` concatenates resource and period IDs with `-`, then `activeDrilldown` splits on `-` and reads only the first two parts. The story uses resource IDs such as `res-1` and period keys such as `sprint-34`; the lookup therefore searches for resource `res` and period `1`, and the drilldown cannot resolve. The existing unit fixture uses `r1` and `p1`, so it does not expose this identifier case. No test was run in this research pass.
- **Zero-capacity semantics are misleading:** `capacityHours === 0` selects the empty heat color and percentage calculation returns `0`, even for positive allocated hours. A no-capacity allocation needs an explicit unavailable/over-capacity state, as applicable to the consumer contract; do not display `0%` for positive allocation.
- **Input/aggregate contract is implicit:** negative hours/capacity, non-finite values, duplicate resource/period IDs, missing cells, and allocation-to-capacity consistency are not validated. Totals silently omit missing cells. Domain-specific capacity, schedules, time-off and allocation rules belong to the owning application/service.
- **Threshold labels and classifications need alignment:** exactly 85% is classified high (`>= 0.85`) although legend text describes 60–85% as optimal; exactly 100% falls in high while the legend calls it 85–100% near-cap. Negative values classify low. Color is accompanied by numeric text, which is a useful non-color cue, but threshold inclusivity should be explicit and tested.
- **Generic labels overstate assumptions:** the header always reports “Sprints” even though the API accepts arbitrary period labels. The footer calls the ratio of total allocated to total capacity “Avg”; clarify whether this is a weighted team utilization or a mean of members. Resource/period counts and hour values have no localization or formatting contract.
- **Layout and accessible scrolling:** CSS gives the table wrapper horizontal overflow but does not make the wrapper keyboard-focusable or name it as a region; narrow-screen scroll discoverability is unverified. The full cell matrix is one tab stop per populated cell, which may be burdensome for larger resource-by-period matrices; confirm the expected grid navigation pattern and scale with the Business Suite consumer.
- **Consumer proof:** no direct Business Suite import of this component was found in the checked application source path. A whole-repository import/route audit and a real staffing/capacity journey remain necessary. Loading, forbidden, stale/offline and service-error states belong in the consuming journey if this presentational component is kept.
- **Reference fidelity:** local and online pages were inspected in the live browser, including MUI, Highcharts and ClickTime guide visuals/content; dimensions were not matched and screenshots were not retained. Product-level ClickTime interactions and screen-reader output were not available.

## Required follow-up before elevation

1. Map both heatmap exports and all active imports across package barrels and Business Suite routes. Establish whether these are distinct canonical components, an adapter relationship, or a naming collision; retain current-major exports pending owner approval.
2. Agree the owning capacity contract: period grain, hours unit, time-off-adjusted capacity, zero-capacity behavior, threshold inclusivity, missing/invalid values and aggregate meaning.
3. Fix selection identity without delimiter ambiguity and verify drilldown with hyphenated identifiers, then add a story interaction for selection and task details.
4. Align legend thresholds with computation; define non-finite/negative/zero handling and localization; keep numeric labels and accessible names as a complement to color.
5. Prove wide and narrow reflow, keyboard-scroll access, focus and selection, all themes/densities, LTR/RTL, empty/invalid/loading/error consumer states, and a representative screen-reader journey against matched reference/local viewports.
6. Complete protocol-selected provider gates and the actual Business Suite consumer build/journey only after the calibration gate permits implementation.

## Readiness

**Overall: NOT VERIFIED.** Research-only record. The current Input/DataTable/Breadcrumb calibration gate remains open, so broad component elevation is withheld. No implementation, test, consumer integration, publication, deployment or release claim is made here.
