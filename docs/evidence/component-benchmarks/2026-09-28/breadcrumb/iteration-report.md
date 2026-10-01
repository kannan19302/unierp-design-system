# Breadcrumb theme/density browser matrix — iteration evidence report

Date: 2026-09-28. Owner: PLT-DS. Primary reference: [official shadcn Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb). Local story: `navigation-breadcrumb--collapsed-long-path`.

## STATUS

`PARTIAL` — the lower-risk Breadcrumb received documented pairwise theme/density/direction coverage. This is not done: the frozen element gate still lacks complete consumer, zoom, screen-reader and OS-mode proof.

## CHANGES

- No runtime source or API changed.
- Added live browser observations to the existing reference packet and component ledger; the existing matched desktop/narrow screenshot pair remains the persisted visual comparison.

## VALIDATION EXECUTED

| Browser combination | Result |
| --- | --- |
| `strata / ultra-compact / LTR` | PASS — collapsed path shows Home, named disclosure, Journal Entries and current invoice; tree exposes the current page as text. |
| `strata-dark / compact / LTR` | PASS — same collapsed structure and visible contrast in the live screenshot. |
| `strata-high-contrast / standard / RTL` | PASS — sequence mirrors with current invoice at the leading visual edge and Home at the trailing edge; accessibility tree remains ordered and named. |
| `strata / comfortable / RTL` | PASS — mirrored sequence remains intact; comfortable sizing renders without clipping in the 1280×720 browser. |
| Existing matched comparison | PASS — saved official/local screenshots at 1046×714 desktop and 320×714 narrow; Strata narrow LTR/RTL and expanded disclosure captures are retained in this folder. |

Each canonical theme, each density, and both directions appears in this documented pairwise set. The browser screenshots from the new pairwise visits were inspected in-session and not saved. Existing test and provider-gate results are recorded in the [Breadcrumb calibration contract](../../../../changes/strata-breadcrumb-collapsed-reference-match-2026-09-28.md); no tests were rerun for this evidence-only pass.

## RESULTS

The opt-in disclosure remains visible and accessible across the sampled theme/density/direction combinations. The current page stays noninteractive, and the hidden-ancestor disclosure retains its accessible name. Existing narrow screenshots demonstrate wrapping at 320px without page overflow. This pairwise sample does not establish a full Cartesian theme × density × direction × viewport matrix, a true 200% browser zoom, or forced-colors/reduced-motion behavior.

## ACCEPTANCE CRITERIA

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 — compatibility/default behavior | PASS | Existing contract and focused tests. |
| AC-02 — long-path disclosure | PASS | Existing desktop screenshots and current browser state. |
| AC-03 — accessible disclosure | PARTIAL | Browser AX and keyboard/axe unit evidence recorded; no real screen-reader session. |
| AC-04 — responsive, RTL, theme/density | PARTIAL | Saved 320px LTR/RTL evidence plus four pairwise desktop combinations; zoom/OS-mode and full matrix remain open. |
| AC-05 — matched reference evidence | PASS | Existing 1046×714 and 320×714 saved side-by-side composition. |
| AC-06 — provider gates | PASS | Prior Node 22 provider and Storybook gate results in the contract. |
| Consumer journey and package compatibility | NOT VERIFIED | The Business Suite linked-package test attempt remains blocked by Vitest's separate React resolution; the Next transpilation path has not been exercised in an authenticated route. |

## REMAINING WORK

- Validate the actual DataTable/Breadcrumb package in the Business Suite's Next bundle and an authenticated customer route.
- Verify screen-reader output, true 200% zoom, forced colors/reduced motion, and consumer-owned navigation authority.
- Keep the Breadcrumb ledger row `NOT VERIFIED` overall until its consumer and accessibility proof pass.

## NEXT ACTION

Continue through a Next-compatible Business Suite consumer harness, then close the screen-reader/zoom/OS-mode and any required narrow theme/density pairs before requesting calibration PASS.

Knowledge delta: `UPDATED` — theme/density/direction browser coverage is now documented; no implementation, consumer integration, deployment or release claim is made.
