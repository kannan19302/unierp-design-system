# DiffViewer iteration evidence report — 2026-09-28

## STATUS

`PARTIAL` — the direct task benchmark and implementation-gap record are updated; component readiness remains `NOT VERIFIED`. This is not done.

## CHANGES

- Added `design-system/docs/evidence/component-benchmarks/2026-09-28/diff-viewer/comparison.md`.
- Updated the DiffViewer row in `design-system/docs/evidence/strata-component-benchmarks.csv`.
- Appended the dated owner traceability note to `platform/docs/platforms/design-system/TRACEABILITY.md`.
- No component code, story, test, contract, package, Business Suite route, or runtime behavior changed.

## VALIDATION EXECUTED

- Re-read workspace/repository instructions and current component, story, test, export, benchmark ledger/program, frozen elevation procedure and owner/requirement authorities.
- Searched Business Suite source for `DiffViewer`, `RedlineDiffViewer`, and `RedlineDiff`; no direct match.
- Inspected local Split Storybook visually and via accessibility tree; opened local Unified URL and read source behavior. Inspected actual 21st community inline diff preview at a matched 1280×720 viewport, plus official Microsoft Word tracked-changes and Ironclad Editor contract redline guidance/screenshots. Manually advanced the active change, switched to Unified, and clicked Accept in the no-callback story; navigation moved the outline/counter, while Accept changed no AX-visible state.
- Parsed the benchmark CSV after update; denominator remains 113 and the DiffViewer row remains `NOT VERIFIED`. `git diff --check` reported no whitespace error; it emits pre-existing line-ending warnings for unrelated files.
- No tests, axe, build, lint, token, Storybook matrix, package, or Business Suite route/integration checks were run. Browser screenshots were not retained.

## RESULTS

- Source proves same-index line pairing can misalign insertions/deletions, whole-line replacement hides word-level changes, active index can go stale on prop updates, and callback-only decisions have no result/pending/error feedback.
- Browser AX tree exposes two tables without semantic header/caption associations; visually pane headers are not table captions. The fixed region label repeats; active-diff changes are not announced.
- Several controls and metadata use 10px, conflicting with ADR-0008 / DS-NFR-006. Responsive stack exists but small-screen/zoom behavior is not proven.
- Contract task need and ownership are unproven: no direct Business Suite use was found. Ironclad and Word supply domain interaction requirements; the 21st community preview is only an adjacent code-review pattern.

## ACCEPTANCE CRITERIA

- AC-01 component/API/story/export/consumer scope: `PASS` with search limitation recorded.
- AC-02 direct and supplemental reference inspection: `PASS`.
- AC-03 actual local/reference browser inspection: `PARTIAL`; local and community preview share 1280×720, but content/task differs; contract software was represented by official docs/screenshots, not authenticated live UI.
- AC-04 full applicable quality axes and business ownership: `PARTIAL`; confirmed source-level gaps recorded; matrices and owner-confirmed journey open.
- AC-05 honor freeze and preserve ledger truth: `PASS`.

## REMAINING WORK

Input, DataTable and Breadcrumb calibration PASS remain prerequisites to bulk source implementation. PLT-ERP must identify the real Business Suite route/task and decision authority before this contract-redline composition can be treated as an ERP requirement. Then resolve alignment/state/API semantics; prove insertion/deletion cases, focus/keyboard and assistive technology, accessible tables/landmarks/announcements, responsive and 200% reflow, all relevant themes/densities/RTL, package gates, published consumer compatibility, and one actual integrated journey. No design change, implementation, integration, deployment, or release is claimed.

## NEXT ACTION

Continue with the next alphabetically pending ledger item. Keep DiffViewer as a PLT-DS evidence packet until its product owner confirms a real Business Suite job and the calibration gate opens; then create an owner-approved implementation contract for the resolved task.

## Knowledge delta

`UPDATED` — implementation observations, public contract-redline references, a Business Suite ownership gap, and accessibility/density/algorithm issues were added to dated component evidence and PLT-DS traceability. Requirements and published contracts were not changed.

## Change contract

Risk `R2`, evidence/docs only. Owners: PLT-DS component/package/Storybook; PLT-ERP workflow/consumer; PLT-OPS platform traceability. Roots changed: `design-system` packet/ledger and `platform` traceability. `business-suite` was read/search only. Rollback affects only this dated packet, its ledger row changes and its traceability paragraph. No L0/L2/L3/API/consumer/runtime changes; no tests/builds run; source code remains governed by the current freeze.

## Lifecycle states

- Designed: `NOT VERIFIED` as a component design; benchmark decision and candidate trait recorded only.
- Implemented: no component code changed this iteration.
- Tested: no automated checks run; local browser inspection only.
- Integrated: no ERP integration or end-to-end journey proven.
- Deployed: not performed or claimed.
- Released: not performed or claimed.

