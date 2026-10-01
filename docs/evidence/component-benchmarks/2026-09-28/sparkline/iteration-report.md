# Sparkline benchmark iteration — 2026-09-28

## STATUS

PARTIAL

## CHANGES

- Compared the live `charts-sparklinegrid--default` Storybook story with MUI X's Sparkline and AG Grid's in-cell sparkline reference pattern.
- Added the Sparkline comparison packet, updated the `sparkline` row in the 113-component benchmark ledger, and recorded the result in design-system traceability.
- Recorded the current public API mismatch: Tenant Admin calls `Sparkline` as a primitive, Strata exports a table alias, and Business Suite analytics has a private SVG primitive.
- No component implementation or consumer migration was made because the Input/DataTable/Breadcrumb calibration gate remains open.

## VALIDATION EXECUTED

- Reconciled ledger row count and row state with Python's CSV parser.
- Checked evidence files exist and scanned all three edited evidence/traceability files for trailing whitespace.
- `git diff --check` passed separately in the design-system and platform repositories for the edited files. Git reported a line-ending normalization warning for platform traceability; no whitespace errors were reported. No test suites were run.

## RESULTS

- Ledger denominator: 113 rows; live comparison records: 15; Overall PASS/VERIFIED rows: 0.
- Sparkline Overall remains `NOT VERIFIED`; direct comparison content/viewport matching, accessibility and consumer journeys remain open.
- Evidence files exist, the whitespace scans are clean, and both repository-scoped Git whitespace checks passed.

## ACCEPTANCE CRITERIA

- AC-01 inventory denominator: PASS for this ledger update (113 rows preserved).
- AC-02 reference provenance: PARTIAL (two official references identified and inspected; scores are provisional).
- AC-03 side-by-side evidence: PARTIAL (live local/reference views inspected; viewports/content unmatched and screenshots not retained).
- AC-04 Strata quality matrix: NOT VERIFIED / GAP as detailed in the comparison packet.
- AC-05 elevation gate: OPEN; no bulk implementation started.
- AC-06 Business Suite readiness: GAP (consumer API mismatch and duplicate private primitive documented; journey not integrated or verified).
- AC-07 completion audit: OPEN across the 113-component ledger and required product proof.

## REMAINING WORK

Complete reference and quality evidence for remaining ledger rows, clear the calibration gate through its owning acceptance criteria, resolve primitive/composite naming and consumer contracts, integrate approved components into Business Suite journeys, then run the owning package and consumer checks. The overall goal is incomplete.

## NEXT ACTION

Continue the row-by-row benchmark with `charts/treemap-chart`; retain `NOT VERIFIED` until its actual story, task fit, states, accessibility and relevant consumer use are evidenced.

## Knowledge delta

UPDATED — the ledger and owning traceability now capture Sparkline's distinct primitive/composite requirements and observed Tenant Admin and Business Suite consumer gap.

This is not done.
