# Accordion iteration report — 2026-09-28

## STATUS

PARTIAL — This is not done.

## CHANGES

- Added direct local/reference comparison and API/ownership review at `docs/evidence/component-benchmarks/2026-09-28/accordion/comparison.md`.
- Updated the Accordion ledger row with local Storybook, four references, gaps, and explicit consumer evidence.
- Added the research result to platform traceability.
- No implementation code, tests, package manifests, contracts, or app routes changed.

## VALIDATION EXECUTED

- Inspected local Storybook Default and official shadcn, Radix, MUI, and 21st.dev community Accordion live examples.
- Compared local Default and shadcn basic first-open stories at 1280×720 in light appearance; inspected reference and local accessibility trees.
- Manually clicked a local collapsed trigger and verified state change; pressed Enter on the focused trigger and verified it collapsed.
- Read design-system source/stories/test source without executing tests; reviewed accepted ADR-0009, design-system requirements/experience/contracts and elevation protocol.
- Searched package exports, Business Suite JSX use, Disclosure imports, and the sidebar E2E scenario; imports/sidebar behavior do not prove Accordion use.
- Confirmed 113 ledger rows, 17 live comparisons, zero overall `PASS`/`VERIFIED` rows, and `compositions/approval-chain` is the next ledger row.
- `git diff --check` exited 0 in both design-system and platform repositories (Git printed existing line-ending conversion warnings); targeted trailing-whitespace scan found zero issues in this packet and CSV.

## RESULTS

- Strata has a coherent functional disclosure appearance, and native-button click/Enter behavior worked in the live local preview.
- Local trigger/panel relations and heading semantics are weaker than the references; keyboard roving behavior is absent/unverified.
- Composition `Collapsible` and primitive `Collapsible` are divergent APIs; root `Disclosure` resolves to the former. Preserve exports and reconcile through an additive adapter after consumer mapping.
- Business Suite has no direct `<Accordion>` or `<Disclosure>` JSX use found. Storybook is the only confirmed direct Accordion consumer in this scope.
- Component readiness remains `NOT VERIFIED`; no implementation, test pass, route integration, or release claim is made.

## ACCEPTANCE CRITERIA

- [x] Compare the rendered local default with the official shadcn reference at a common viewport and first-open state.
- [x] Inspect at least three actual alternate accordion implementations and record source, distinctive traits and cost/limitations.
- [x] Review public API, tests/story source, duplicate semantic components and Business Suite use.
- [x] Correct the evidence classification so import-only names and a sidebar section are not counted as this component's integration.
- [x] Keep the overall ledger row `NOT VERIFIED` while accessibility, matrices and end-to-end consumer proof are incomplete.
- [ ] Define and implement panel relationships/heading structure and chosen arrow-key/focus behavior without breaking current-major exports.
- [ ] Reconcile duplicate Collapsible owners, validate all states/themes/densities/direction/responsive/OS modes/zoom/screen reader, and run required gates.
- [ ] Prove published package behavior and a real Business Suite journey.

## REMAINING WORK

- Implementation, full accessibility/matrix review, package gate, and real Business Suite use remain open. The Input/DataTable/Breadcrumb calibration gate is still open; mass implementation remains frozen by protocol.

## NEXT ACTION

- Continue with `compositions/approval-chain` in an evidence-only pass while calibration remains open. In parallel future cycles, resolve the calibration packets to unlock governed component implementation; do not infer that a visual Storybook match alone establishes Business Suite readiness.

## Knowledge delta

UPDATED — source-backed reference and consumer findings were added to the evidence ledger and traceability. Requirements, contracts and the elevation protocol were not changed.


