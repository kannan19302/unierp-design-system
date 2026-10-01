# CandlestickChart reference comparison — 2026-09-28

Status: `NOT VERIFIED`. This records a direct comparison of the Strata Storybook default with three official candlestick references. It does not complete the chart quality matrix or authorize component elevation.

## Reference selection and local story

- Primary: [Highcharts Stock Candlestick](https://www.highcharts.com/demo/stock/candlestick). This live OHLC finance chart includes date and price axes, range selector buttons, navigator/zoom controls, data table access and accessible descriptions for each candle.
- Supplemental: [Apache ECharts Shanghai Index candlestick](https://echarts.apache.org/examples/en/editor.html?c=candlestick-sh&theme=dark). This live example shows time and value axes, grid, candlesticks, overlays (moving averages), legend, and a range navigator.
- Supplemental: [TradingView Lightweight Charts realtime updates](https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates). The official example documents a candlestick series with simulated streaming updates and a “Go to realtime” control.
- shadcn check: a focused official-site search found no direct shadcn candlestick component. These finance-chart references provide data and interaction patterns only; no third-party colors, branding, dependencies, or code are adopted.
- Provisional fit scores (0–3 per criterion, task fit and semantics weighted twice; maximum 30): Highcharts 28, ECharts 27, TradingView 25. Highcharts best matches the current OHLC data contract and provides a strong accessible finance reference; ECharts shows axis/overlay composition; TradingView demonstrates realtime update semantics. Scores are reference selection evidence, not Strata quality scores.
- Local story: `http://localhost:6006/iframe.html?id=charts-candlestickchart--default&viewMode=story` (`charts-candlestickchart--default`), from `src/charts/candlestick-chart/candlestick-chart.stories.tsx`.
- Highcharts, ECharts, TradingView docs, and the local Storybook default were opened and inspected on 2026-09-28. Reference and local screenshots were viewed in-session but not retained; viewport dimensions were not matched. The TradingView page showed the realtime-updates description/code; its embedded chart was below the initial viewport and was not visually assessed.

## Observed pattern and differences

The local story draws six OHLC candles centered in a large empty card. It has no visible date axis, price scale, title, grid, crosshair, zoom, or navigator. A `title` exists per candle but its containing SVG is `aria-hidden`; the chart root is a single generic image label, so the dates and OHLC values are not exposed to assistive technology. The component has no event handlers or data-state messaging. The default bear color references `--color-error`, while the current token vocabulary has `--color-danger` and `--color-error-*` tokens; confirm this color resolves as intended rather than relying on fallback. Data geometry also needs validation for invalid OHLC ordering, duplicate dates, large datasets, single candles and empty data.

Highcharts and ECharts place the OHLC marks in time/price context with axes and grids. Highcharts exposes range selection and a navigator as well as a data table; its accessibility tree describes each candle with timestamp and O/H/L/C values. ECharts supplies moving-average overlays and a range selector. TradingView documents appending/updating realtime candle data and returning to the latest view. These richer controls are useful comparisons, but support for them in Strata must be decided from the actual Business Suite journey rather than inferred from the existence of chart examples.

## Required work

1. Verify/replace the bearish color token and check contrast in each supported theme.
2. Establish whether this component is used for a real Business Suite market-price journey; capture the route and business need before expanding scope.
3. Add appropriate time and value context (axis labels/ticks or equivalent) and decide if zoom/range selection is required by the consumer contract.
4. Provide meaningful accessible chart name and OHLC data alternative, such as a linked table; verify through accessibility tree and screen reader.
5. Define invalid/empty/single-point/duplicate-time/out-of-order and high-volume behaviors and verify them.
6. Verify all themes, supported densities, LTR/RTL, desktop/narrow viewports, and keyboard behavior. Retain matched-viewport screenshots for local/reference proof.

## Axis assessment

| Axis | Current evidence |
| --- | --- |
| Task and semantics | `GAP` — OHLC candles render, but no time or value context is visible. |
| Interaction and keyboard | `GAP` — no chart controls or keyboard handling exist in source. |
| States | `NOT VERIFIED` — invalid/empty/volume/state matrix not inspected. |
| Responsive and reflow | `NOT VERIFIED` — only default story inspected. |
| Themes | `NOT VERIFIED` — bearish token resolution is suspect and no theme matrix was run. |
| Density | `NOT VERIFIED` — density stories exist; no matrix was run. |
| Direction | `NOT VERIFIED` — no RTL check. |
| Accessibility | `GAP` — a generic image label hides the SVG and per-candle titles from the accessibility tree. |
| Business Suite consumer | `NOT VERIFIED` — no route or customer journey inspected; market-chart relevance is unproven. |

Overall remains `NOT VERIFIED` until the gaps are addressed and applicable axes and consumer proof are complete.
