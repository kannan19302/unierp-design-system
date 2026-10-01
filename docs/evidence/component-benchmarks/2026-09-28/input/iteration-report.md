# Input density correction iteration report — 2026-09-28

## Cycle status

- **Status:** `PARTIAL`
- **Objective:** Fix the current Input calibration defect in the shared Strata density-token cascade and make its gate observe authoritative sources.
- **Completed:** Root density fallback no longer overrides explicit density values; the density checker reads current paths, fails on missing sources, checks all four row heights and small/medium/large control heights and asserts zero-specificity fallback; all 12 theme × density Input size and state samples reverified; dated comparison, ledger and PLT-DS traceability refreshed.
- **Incomplete:** Overall Input calibration, DataTable and Breadcrumb calibration, all 113 element packets, true 200% zoom, forced-colour/reduced-motion OS settings, live screen-reader output and authenticated Business Suite route/published package proof remain open.
- **Designed / implemented / tested / integrated / deployed / released:** Designed `YES`; implemented `YES`; tested `YES` for this scoped packet; integrated `NOT VERIFIED` in consuming apps; deployed `NO`; released `NO`.
- **Knowledge delta:** `UPDATED` for the density cascade/gate correction and current Input evidence. The overall readiness knowledge remains `REQUIRED-BUT-INCOMPLETE` until the frozen gates close.

## Acceptance criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| AC-01 explicit density selectors override root fallback; standard stays 32px | PASS | Browser computed values; foundation regression test; current-source density gate |
| AC-02 Input sizes follow every density token | PASS | `Sizes` story measured in all 12 theme × density combinations: sm/md/lg = 20/24/28px ultra-compact, 24/28/32px compact, 28/32/40px standard, 32/40/48px comfortable |
| AC-03 12 theme × density samples retain five states and avoid page overflow | PASS | Live Storybook all-states gallery; each of 12 samples measured at 1707px viewport; all-state field heights follow md values |
| AC-04 focused regression and design-system quality gates | PASS | Node 22.23.3 checks listed below |
| AC-05 ledger and traceability updated without promoting overall readiness | PASS | 113-row benchmark ledger; PLT-DS Traceability entry; overall Input remains `NOT VERIFIED` |

## Validation executed

| Result | Working directory | Command / boundary | Evidence |
| --- | --- | --- | --- |
| PASS | `design-system` | `node --test scripts/check-foundations.test.mjs` | 11/11 foundation tests; includes explicit root-fallback/density regression |
| PASS | `design-system` | `node scripts/check-density.mjs --test-negative` | Current paths found; all four row heights and `sm`/`md`/`lg` control-height values, 44px touch target and zero-specificity fallback pass; negative row-height proof passes |
| PASS | `design-system` | Node 22.23.3 `pnpm lint` | All package lint/governance/type gates pass |
| PASS | `design-system` | Node 22.23.3 `pnpm typecheck` | Exit 0 |
| PASS | `design-system` | Node 22.23.3 `pnpm check:inventory` | 113 components, 113 stories/tests and 46 registered exports |
| PASS | `design-system` | Node 22.23.3 `pnpm check:storybook` | 120 story files parsed; 113 component stories conform |
| PASS | `design-system` | Node 22.23.3 `pnpm test` before final density-gate assertion expansion | 132 files / 822 tests passed; final updated foundation test was rerun 11/11 by `pnpm lint` and `pnpm build` |
| PASS | `design-system` | Node 22.23.3 `pnpm build` after final density-gate update | Foundation, token, density, contrast, layer, governance and package build gates pass; generated inventory has 113 components |
| PASS | `design-system` | Node 22.23.3 `pnpm --dir storybook build-storybook` | Storybook built 2316 modules, exit 0; upstream Storybook runtime `eval` warnings observed |
| PASS | Local Storybook browser | `inputs-input--default`; all-state gallery; themes `[strata,strata-dark,strata-high-contrast]` × densities `[ultra-compact,compact,standard,comfortable]` | 12/12 samples; md field is 24/28/32/40px; five states preserved; `documentElement.scrollWidth` and `body.scrollWidth` equal 1707px viewport |
| PASS | Local Storybook browser | `inputs-input--sizes`; themes `[strata,strata-dark,strata-high-contrast]` × densities `[ultra-compact,compact,standard,comfortable]` | 12/12 samples; sm/md/lg tuples are (20/24/28), (24/28/32), (28/32/40), (32/40/48)px; no document overflow |
| NOT RUN | `design-system` | Full `git diff --check` | Not used as a packet pass because the current worktree already contains unrelated dirty files; scoped changed-source check passed before evidence refresh. Full diff still requires final review. |

## Remaining work

This packet closes only the shared token-cascade defect and its direct Input density matrix. It does not close the Strata readiness objective. Continue with the frozen Input/DataTable/Breadcrumb calibration gates, then proceed through all current 113 benchmark rows, update evidence and consumer mappings, and complete the required platform and route-level proof. No package publication, deployment or release occurred.

## Visual matrix global correction and retained captures — 2026-09-28

The reference matrix URL helper previously joined theme and density with a comma. Live Storybook warned that the URL args were unsafe and applied its default `strata`/`standard` values, so a requested matrix could silently render the wrong mode. The generator now uses semicolon-separated globals; the visual regression spec asserts the document actually applied both requested values before snapshotting. `discover-stories.test.mjs` passes all 12 URL combinations. Playwright test discovery parses the updated spec and enumerates 546 stories / 6,553 tests; this is discovery evidence only, not a full matrix run.

The all-states Input story now sets the existing `fullWidth` prop on the leading-icon example after browser measurements showed that wrapper was narrower than the other four controls. This changes only the story fixture. A fresh Chromium run at 1280×800 (Node 22.23.3) applied every one of the 12 theme × density pairs; all five controls measure 312px at the expected 24/28/32/40px heights, document/body widths stay 1280px, and no page errors occur. Twelve matrix screenshots plus exact conditions are recorded in `matrix-captures.md`.

Focused Input tests pass 8/8; Storybook standards (123 source stories / 116 component stories), typecheck, lint, package build (116 components, 155 token baseline violations and zero new ones), and production Storybook build (2,326 modules) pass on Node 22.23.3. The full provider test suite, 6,553 visual snapshots, Business Suite package compatibility and end-to-end route are not verified in this iteration. Input and all catalog rows remain `NOT VERIFIED` overall.

Designed: `PARTIAL`; Implemented: matrix URL/assertion plus comparison fixture correction; Tested: focused provider test and 12 live browser combinations; Integrated: `NOT VERIFIED`; Deployed: `NO`; Released: `NO`. Knowledge delta: `UPDATED`; overall readiness `REQUIRED-BUT-INCOMPLETE`.
