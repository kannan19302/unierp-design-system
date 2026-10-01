# DonutChart reference comparison — 2026-09-28

Status: `NOT VERIFIED`. The local default and live shadcn/Nivo donut examples were visually inspected. The comparison records visual/data semantics only; it does not finish the component quality matrix or authorize elevation.

## Reference selection and local story

- Primary reference: [shadcn Pie Chart — Donut with Text](https://ui.shadcn.com/view/new-york-v4/chart-pie-donut-text), a live centered-metric donut with a title/period, category values represented by distinct ring segments, and contextual text below the plot.
- Supplemental: [shadcn Pie Charts](https://ui.shadcn.com/charts/pie), which includes donut, donut with active segment, donut text, legend, labels and interactive examples; and the [shadcn Chart docs](https://ui.shadcn.com/docs/components/aria/chart) for chart config, legend, tooltip, theming, accessibility layer and RTL.
- Supplemental direct visual reference: [Nivo Pie](https://nivo.rocks/pie/), a live radial chart with external labels and legend plus configuration for arc labels, legends, interaction, motion and a recipe for putting a metric in the center.
- Provisional fit scores (0–3; task/semantics weighted twice; maximum 30): shadcn donut-with-text 28; Nivo Pie 27; shadcn Pie collection 26. The dedicated shadcn story is closest to the local center metric. Nivo provides the clearest category labeling and extension points. Scores describe pattern fit, not Strata quality.
- No borrowed colors, code, dependencies, brand elements or typography are adopted.
- Local story: `http://localhost:6006/iframe.html?id=charts-donutchart--default&viewMode=story` (`charts-donutchart--default`), from `src/charts/donut-chart/donut-chart.stories.tsx`.
- shadcn and Nivo live charts and the local Storybook default were opened and visually inspected on 2026-09-28. Nivo rendered after initial loading. Screenshots were inspected in-session but not retained; viewport dimensions were not matched. The local accessibility tree announces “Total: 100%” and the center text but not the segment labels/values. Keyboard/hover behavior, alternate themes, and mobile were not verified.

## Observed pattern and differences

The local default is a 140px three-segment ring with “100% / Total” centered. The segment default data are Active 65, Pending 25 and Closed 10, but those labels and values are not present in the accessibility tree and no legend is rendered. The shadcn sample gives the donut business context (heading and period) and shows 1,125 Visitors centered, with a supporting change summary and detail below. Nivo adds direct labels outside the ring and a category legend, and documents a custom layer for central text.

Source review found that `segments` accepts arbitrary strings and numbers without checking finite/nonnegative values; zero or invalid totals can yield misleading/invalid ring geometry. A supplied `centerValue` of numeric zero is suppressed by the truthiness check. The root accessible label depends on center fields and can be “Donut Chart” for a meaningful segmented chart without them. SVG segments lack a complete textual alternative; index keys are used. No hover, focus, or keyboard behavior is implemented in this source.

## Required work

1. Clarify in a real Business Suite journey whether this visualization is appropriate for the data (few categories with a meaningful whole) and provide title, unit/period, and segment descriptions.
2. Add an accessible text/data alternative that includes every category and value; keep the center number from replacing the chart's actual meaning.
3. Define validation and display for empty, zero-total, negative, nonfinite, single-category, many-category, and greater-than-100%/partial-total data. Ensure numeric zero center values render.
4. Confirm a supported interaction model (if any); test pointer, keyboard, touch and screen-reader behavior for labels/legend and any active segment.
5. Verify all themes, density sizes, LTR/RTL and narrow widths with retained matched-viewport evidence.
6. Inspect a real Business Suite consumer, using truthful live values and appropriate loading/empty/error/forbidden states, before changing the consumer status.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `PARTIAL` — the proportional ring and central total render; labels/values/context are missing from the local default. |
| Interaction and keyboard | `NOT VERIFIED` — no interaction behavior in source; user need is undecided. |
| States | `GAP` — empty/zero/invalid/negative and partial-total data are not defined. |
| Responsive and reflow | `NOT VERIFIED` — no narrow comparison. |
| Themes | `NOT VERIFIED` — only default rendered state inspected. |
| Density | `PARTIAL` — four sizes are declared in a gallery; matched visual/legibility evidence is missing. |
| Direction | `NOT VERIFIED` — no RTL check. |
| Accessibility | `GAP` — category labels and segment values are absent from the local accessibility tree. |
| Business Suite consumer | `NOT VERIFIED` — no route or customer journey inspected. |

Overall remains `NOT VERIFIED` until the data contract, gaps, applicable axes and consumer proof are complete.
