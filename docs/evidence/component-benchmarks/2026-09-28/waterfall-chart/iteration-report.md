# WaterfallChart iteration report — 2026-09-28

## STATUS

PARTIAL — This is not done.

## CHANGES

- Added source-backed, date-stamped WaterfallChart reference comparison at `docs/evidence/component-benchmarks/2026-09-28/waterfall-chart/comparison.md`.
- Updated the 113-row component benchmark ledger to record the live references, Storybook URL, observed gaps, reference scores, and remaining validation.
- Updated design-system platform traceability with this research packet.
- No component code, tests, dependencies, contracts, or consumer routes changed.

## VALIDATION EXECUTED

- Inspected local Storybook Default canvas and online Recharts, Highcharts, and Plotly Waterfall references in browser.
- Read WaterfallChart source, story, test source (without executing tests), dashboard analytics contract, finance endpoint classification, and tenant-app evidence inventory.
- Queried Business Suite source for direct WaterfallChart imports/use; none located.
- Re-read the updated CSV row; confirmed 113 rows, 16 rows with a recorded live comparison, zero `PASS`/`VERIFIED` overall rows, and the next ledger item is `compositions/accordion`.

## RESULTS

- Local chart renders, but represents all records as independent baseline bars rather than cumulative waterfall ranges. `showConnectors` is ignored; total semantics, value context, clipping and accessible data are also deficient.
- Existing analytics contract and finance endpoints establish a plausible user job, but no direct Strata UI consumer or journey was verified.
- Direct reference comparison is recorded, with screenshots not retained and viewport matching not completed.
- Component readiness stays `NOT VERIFIED`; implementation and integration are not claimed.

## ACCEPTANCE CRITERIA

- [x] Record at least three actual waterfall references and explain selection and licensing/portability tradeoffs.
- [x] Inspect the local default story and capture concrete behavioral, visual, and accessible-tree observations.
- [x] Map plausible business task to current contract/API evidence and distinguish this from consumer proof.
- [x] Keep overall component status `NOT VERIFIED` while required matrices and integration evidence remain absent.
- [ ] Establish an additive cumulative datum/API contract, implement true waterfall geometry/connectors, and preserve compatibility.
- [ ] Complete states, theme/density/direction/responsive/reflow/OS-mode/keyboard/screen-reader review and required gates.
- [ ] Prove package behavior and a real Business Suite journey.

## REMAINING WORK

- All implementation and validation criteria above remain open. In addition, the enterprise Input/DataTable/Breadcrumb calibration gate remains open; mass elevation work is frozen pending those three PASS packets.

## NEXT ACTION

- Proceed to the next row, `compositions/accordion`, with an evidence-only pass while the calibration gate is closed. Revisit WaterfallChart for implementation only after the gate and compatibility contract permit it.

## Knowledge delta

UPDATED — dated source and reference observations were added to the benchmark evidence and platform traceability. This does not change the normative elevation protocol or product requirements.

