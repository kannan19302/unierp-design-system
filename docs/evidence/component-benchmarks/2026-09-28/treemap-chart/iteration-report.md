# TreemapChart benchmark iteration — 2026-09-28

## STATUS

PARTIAL

## CHANGES

- Inspected the current component source, stories, tests, exports, package dependency and relevant UniERP analytics contract/route.
- Inspected live Recharts Nested Treemap, Apache ECharts Basic Treemap, and Google Charts Treemaps; verified a Recharts drilldown and tooltip interaction.
- Added the Treemap comparison packet, updated the ledger row, and recorded findings in PLT-DS traceability.
- No component implementation or consumer migration was made while the accepted calibration gate remains open.

## VALIDATION EXECUTED

- Read-only `rg` searches found no direct Business Suite use of Strata `TreemapChart`; `@kannan19302/contracts` allows the `TREEMAP` chart type; the inspected Business Suite reporting drilldown route renders `DataTable` results.
- Local Storybook story and manager browser stayed on a loading spinner. Read-only requests to the story iframe and `index.json` returned HTTP 200. No app terminal was attached, so no server/browser error log was available.
- Reconciled the ledger with Python's CSV parser; checked evidence files exist; scanned edited text/CSV for trailing whitespace; repository-scoped `git diff --check` passed. No test suites were run.

## RESULTS

- Ledger denominator remains 113 rows. The TreemapChart row is `NOT VERIFIED`; its status records that live references were inspected but local Storybook comparison is blocked.
- Source review identifies two implementation defects relevant to the component's declared purpose: nested `children` are unused, and the flex-grow row encodes values as strip widths rather than a hierarchical two-dimensional treemap.
- Accessibility source exposes one generic image name and hides visible cell details from assistive technology. Product integration remains unproven despite the L0 `TREEMAP` option.
- Reference usefulness ratings are provisional: Recharts 24/30, ECharts 23/30, Google Charts 21/30; none measures Strata readiness.

## ACCEPTANCE CRITERIA

- AC-01 inventory denominator: PASS for this update (113 rows retained).
- AC-02 reference provenance: PARTIAL (three live official references inspected and linked).
- AC-03 side-by-side evidence: BLOCKED/PARTIAL (local preview never left its spinner; matched screenshots/states unavailable).
- AC-04 Strata quality matrix: GAP and NOT VERIFIED as detailed in the comparison packet.
- AC-05 elevation gate: OPEN; no broad implementation started.
- AC-06 Business Suite readiness: NOT VERIFIED (contract allows TREEMAP, but no direct consumer or journey proof was found).
- AC-07 completion audit: OPEN across remaining ledger rows and product evidence.

## REMAINING WORK

Diagnose why the local Storybook preview remains in its loader state, confirm PLT-ERP's customer task and owner, contract the tree/measure/color/interaction semantics, then complete the local visual and accessibility matrix after calibration. If the capability is retained for Business Suite, implement the actual nested area layout and accessible alternative, then prove the consumer journey and provider/package gates.

## NEXT ACTION

Continue with `charts/waterfall-chart`; keep its ledger status unverified until its current story, actual reference, behavior, accessibility, and consumer task are inspected.

## Knowledge delta

UPDATED — the ledger and traceability now distinguish the declared Treemap capability from the current flat weighted-strip behavior, record its accessibility gaps, and note the Storybook preview blocker and unproven consumer.

This is not done.
