# SankeyDiagram comparison — 2026-09-28

## Scope and identity

The local component is `charts-sankeydiagram--default`. Its sample models traffic from Organic Search, Paid Ads and Referrals to Landing Page, then to Checkout. The local Storybook canvas and accessibility tree were visually inspected at the live URL below. The MUI X Sankey documentation and live example were inspected in the same browser session. The viewports were not matched, the MUI cookie panel obscured part of its chart, and screenshots were inspected inline but not retained as files.

- Local: http://localhost:6006/iframe.html?id=charts-sankeydiagram--default&viewMode=story
- Primary reference: [MUI X Sankey](https://mui.com/x/react-charts/sankey/)
- Supplemental references: [Google Charts Sankey](https://developers.google.com/chart/interactive/docs/gallery/sankey); [Highcharts Sankey demo](https://www.highcharts.com/demo/highcharts/sankey-diagram)

Repository-wide search found no Business Suite use of `SankeyDiagram` or `sankey-diagram`; matches are limited to the design-system implementation, story, test and exports. A customer journey and PLT-ERP consumer owner are therefore unproven.

## Reference comparison

Scores use the program's eight dimensions: task fit and semantics/keyboard are weighted twice; the six remaining dimensions are interaction, states, reflow, visual clarity, portability and maintenance (maximum 30). These score the reference as a benchmark candidate, not Strata readiness.

| Reference | Observed pattern | Task / semantics (×2 each) | Interaction, states, reflow, visual, portability, maintenance | Score / 30 |
| --- | --- | ---: | ---: | ---: |
| [MUI X Sankey](https://mui.com/x/react-charts/sankey/) | Connected source-to-target flow links whose width represents magnitude; explicit/automatic nodes; node/link colors; ordering/alignment and layout iteration; formatted labels/tooltips; click/highlight behavior; focused node/link composition for keyboard focus. Sankey is part of the Pro plan. | 3 / 3 | 3, 3, 2, 3, 1, 2 | 26 |
| [Google Charts Sankey](https://developers.google.com/chart/interactive/docs/gallery/sankey) | Source/destination/value rows, automatically laid-out levels and nodes, weighted connecting links, node width/padding, tooltips, colors and node selection. Cycles are unsupported. | 3 / 2 | 2, 2, 2, 2, 2, 2 | 21 |
| [Highcharts Sankey](https://www.highcharts.com/demo/highcharts/sankey-diagram) | Interactive nodes and weighted links, chart description and accessible point descriptions/tooltip in the inspected example. Commercial licensing is a dependency to assess. | 3 / 3 | 3, 2, 2, 3, 1, 2 | 25 |

MUI is the primary behavioral reference because its current documentation covers node/link layout, styling, value formatting, interactions and focused chart items. Google supplements a distinct data-row contract and selection behavior. Highcharts supplements chart-description and point-description patterns. Preserve Strata tokens and APIs; this comparison does not recommend adopting a reference package or license.

## Observed gaps and risks

- **Not a flow diagram yet:** the local center column paints full-width stacked rectangles. It does not draw or align a link from each source node to its target. The screenshot therefore shows no visible mapping between a colored band and its endpoint nodes; source/target values are only available in a `title` attribute. In the MUI reference, each link connects the actual nodes and width encodes magnitude.
- **Magnitude is not represented conventionally:** every band has the same inline width. Height is scaled against the sum of every link value, even though intermediate-stage values are counted again; this produces a detached area rather than a conserved node/link layout. The prop `nodeWidth` is accepted but discarded.
- **Content is incomplete:** nodes with no link are omitted. There is no validation for duplicate IDs, unknown endpoints, negative or non-finite values, or cyclic graphs. Minimum 24px node heights can exceed available chart height for many nodes, while overflow is hidden.
- **Accessible data is absent:** the live local AX tree exposes a single container named “Sankey diagram”; labels and values do not appear as navigable data, and the decorative link bands are not keyboard reachable. `title` is not a complete equivalent data table/list. No focus, selection, tooltip state or screen-reader behavior was verified.
- **Matrix and ownership remain open:** density examples also vary height and data, so they do not isolate the density effect. Themes, all density tiers, direction, narrow reflow, loading/empty/error/invalid states, keyboard, 200% zoom, forced colors, reduced motion, screen reader and Business Suite workflow remain NOT VERIFIED.

## Required follow-up before elevation

1. PLT-ERP must establish an actual Business Suite flow-analysis job and owner; decide whether Sankey is needed in the product before investing in a general chart implementation.
2. Define graph/data semantics, value units, node and link totals, cycles, orphan nodes, duplicate IDs, invalid values, large graphs and `nodeWidth` behavior.
3. Replace detached bands with true source-to-target geometry with proportional link width, node sizing/placement and legible labels; prove non-conserving transitions such as the sample's 1000 landing visits to 650 checkouts remain truthful.
4. Provide a complete nonvisual data alternative and accessible name/context. Specify keyboard focus/navigation and pointer selection/highlight behavior if those interactions are required.
5. After the calibration gate opens, compare matched local/reference states and test responsive layout, all themes/densities, direction, chart data boundaries and the owned consumer journey. Record results; do not mark the row PASS from this packet.

## Readiness

**Overall: NOT VERIFIED.** This packet records direct reference and local Storybook research. It does not certify the component, prove Business Suite adoption, or authorize implementation during the active calibration freeze. The Input/DataTable/Breadcrumb gate and cross-cutting accessibility gaps remain open.
