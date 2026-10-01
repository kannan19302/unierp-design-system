# Strata Business Suite readiness iteration — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — coordinated shared UI and downstream consumer readiness`. Accountable platform: PLT-DS for the shared package; PLT-ERP owns Business Suite journeys and route composition. Package/contract owner: `@kannan19302/ui`. Consumers: Storybook and `business-suite`. No API, event, data, identity, permission, schema, migration, production, publication, or deployment changes.

## Objective and acceptance criteria

Make the current Strata shell work discoverable and prove it against the package's actual Storybook build, then assess the exact Business Suite dependency graph and distinguish local-source results from published-artifact compatibility.

1. **AC-01 — Package integrity:** required source anatomy, public exports, type safety, lint, tests, token/density/contrast/logical-property governance and package build pass on Node 22.
2. **AC-02 — Shell interaction:** AppShell, TopNav and DashboardShell interaction/accessibility tests pass; mobile drawer focus/escape proof uses an explicit mobile viewport fixture.
3. **AC-03 — Story discovery:** AppShell and DashboardShell retain their five numbered variants and expose a canonical default preview for shell tooling.
4. **AC-04 — Browser evidence:** exact final Storybook output passes per-shell 42-scenario matrices for AppShell and DashboardShell across three themes, four densities, three viewports, axe samples and document overflow assertions.
5. **AC-05 — Consumer integration:** Business Suite builds/types against its current dependency graph and representative routes pass applicable design/accessibility gates; record whether the tested UI package is a local link or published artifact.
6. **AC-06 — Authority traceability:** owning traceability records the exact pass/fail/remaining states without promoting package proof into consumer adoption or release readiness.

## Changes in this iteration

- Added canonical `Default` story IDs which reuse, rather than duplicate, AppShell-1 and DashboardShell-1. The ten requested numbered story names remain unchanged.
- Updated the mobile navigation unit test to supply a mobile `matchMedia` result. This models the actual browser breakpoint in JSDOM.
- Changed the shell browser validator to serialize scenarios when axe is active; parallel navigation raced with axe's asynchronous runtime and caused intermittent false failures.
- Added a dated evidence record and an owning PLT-DS traceability handoff. Existing unrelated edits and evidence remain untouched.

## Verification

Node `v22.23.3`, pnpm `9.15.4`.

| Check | Result |
| --- | --- |
| `pnpm check:inventory` | PASS — 113/113 components, stories and tests conform; 6/6 canonical shell floorplans; 46 package exports |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS — foundations, tokens, logical CSS, UI governance, layers, density, contrast, accents and TypeScript |
| `pnpm test` | PASS — 132 files, 817 tests |
| `pnpm build` | PASS — package output and generated inventory |
| `pnpm check:storybook` | PASS — 120 story files parsed, 113 component stories conform |
| `pnpm --dir storybook build-storybook` | PASS — Storybook 8 production build |
| Shell-focused tests | PASS — 38/38 TopNav, AppShell and DashboardShell tests, including axe and keyboard flows |
| AppShell browser matrix | PASS — 42/42, final build, serialized axe, three themes × four densities × desktop/tablet/mobile; no runtime or overflow failures |
| DashboardShell browser matrix | PASS — 42/42, same scope; no runtime or overflow failures |
| Existing full shell validator (before 2026-09-28 correction) | FAIL CLOSED — stale eight-group assertion against nine discovered groups; this assertion is corrected in the later consolidated validation packet below. |
| Business Suite `pnpm typecheck` | FAIL — current package graph links the app's direct `@kannan19302/ui` dependency to `../design-system`; `@kannan19302/framework@0.1.4` separately brings transitive `@kannan19302/ui@1.0.15`. Broad missing exports/prop incompatibilities include `StatusBadge`, `SubTabBar`, `DashboardChart`, `TabbedConsole`, `ModuleTabLayout`, and `@kannan19302/ui/platforms/business-suite`. |
| Business Suite `pnpm check:tokens` | FAIL — six files exceed zero-violation baselines (161 pixel-length violations in the supported Node 22 run). |
| Business Suite focused interaction/E2E, build, route a11y/screen-reader, 200% zoom, forced-colours and reduced-motion OS mode | NOT VERIFIED — no representative run in this iteration |

Browser reports are generated under ignored `design-system/test-results/strata-shell-current/`; they are current local run output, not committed release evidence. The previous tracked shell screenshot archive is not updated by this iteration.

## Acceptance state and handoff

| Criterion | State | Evidence/remaining |
| --- | --- | --- |
| AC-01 | PASS | Node 22 package gates listed above |
| AC-02 | PASS | 38 focused component tests; all pass |
| AC-03 | PASS | Fresh static index has default IDs and all ten numbered stories |
| AC-04 | PASS | Fresh per-shell matrices each have 42 scenarios, zero failures |
| AC-05 | FAIL | Direct UI source link typecheck fails on broad API shape mismatch; Framework also brings UI 1.0.15 transitively. Route adoption and journey evidence are absent. |
| AC-06 | PASS | Platform traceability updated with scoped evidence and all remaining gaps |

Knowledge delta: `UPDATED`. No platform behavior requirement changed; the existing DS-FR-002/005/010, DS-UX-001/004/007/008/009 and DS-NFR-009 evidence is refreshed only for the changed shell samples. Consumer-side ERP-UX-006/007/008/009 conformance remains `PARTIAL`/`UNVERIFIED`; no Business Suite integration is claimed.

Designed: shared shell contracts and fixture behavior. Implemented: default story discovery and the browser-test serialization correction. Tested: package gates and two current browser matrices as above. Integrated: Storybook package only; Business Suite consumer integration is not complete. Deployed: no. Released/published: no. Production readiness: not established.

Next actions in dependency order: resolve package API/consumer compatibility under PLT-DS/PLT-ERP ownership; establish a deliberately authorized package distribution/version path; validate Business Suite module/Finance/POS shell adaptations against ERP navigation and context requirements; close route matrix, user-preference, live journey, screen-reader, zoom/reflow and OS accessibility proof; correct and rerun the global shell validator's discovered-count contract. Package publication, lockfile refresh, source-control push and release require exact human authorization under current governance.

## Consolidated nine-shell matrix — 2026-09-28

The explicit required-group assertion now covers nine groups: `app-shell`, `catalog-shell`, `dashboard-shell`, `data-shell`, `editor-shell`, `manifest`, `record-shell`, `settings-shell`, and `strata-bar`. A fresh Storybook build produced 47 shell stories. The consolidated browser run completed 371 scenarios with 92 axe scans and 63 screenshots; the validator correctly failed on 55 scenarios.

Observed failures:

- 36 document-overflow failures: `data-shell` mobile +91px (12 combinations), `editor-shell` mobile +279px (12), `manifest` mobile +122px (12). These remain unresolved. The DataWorkspace table is intrinsically wide and lives in an intended horizontal scroll region, but the document still extends beyond the viewport; a named, keyboard-reachable contained region and accessible narrow-screen alternative must be confirmed.
- 21 `color-contrast`-only scenario failures, three `target-size`-only failures, and one scenario containing both. Contrast targets include hard-coded demo status colors in DataWorkspace and EditorialShell; Storybook surfaces are currently assessed against the WCAG 2.2 AA axe rules. The touch target is the 23×19px Meridian context copy button.
- Failures appeared in `data-shell`, `editor-shell`, `manifest`, and `record-shell`; other required groups completed without matrix errors.

The exact machine report is `design-system/test-results/strata-shell-consolidated-2026-09-28/matrix.json` (ignored local output). This consolidated result supersedes the earlier statement that the global validator only needed its expected group count updated. The stale-count defect is corrected, but the browser matrix is now the binding failure and AC-03 is `FAIL`.

Validation environment: `pnpm check:storybook` passed and the fresh Storybook production build passed with Node `v24.14.0`, but the repository requires Node `>=22 <23`; these results are environment-mismatched and are not Node 22 proof. The Node 22 package gates and earlier per-shell matrices recorded above are earlier evidence from this same date and do not supersede the new full matrix. Business Suite package API and route-level consumer gaps remain open.

Next work: repair shell demo contrast and mobile layout/touch-target issues under a new scoped R2 packet, rerun the consolidated matrix on supported Node 22, then proceed to exact Business Suite upstream-to-consumer compatibility and representative journey validation. No publication, deployment, release, lockfile refresh, or SCM mutation was done.

## Superseding supported-runtime shell evidence — 2026-09-28

The later R2 responsive/accessibility remediation rebuilt Storybook and reran the complete shell matrix on supported Node `v22.23.3`. DataShell and EditorShell each passed 40/40 focused scenarios (the latter after correcting footer-brand contrast). The consolidated result is **371/371 scenarios, 92 axe scans, 63 screenshots, zero failures** across all nine required shell groups and 47 stories. Exact report: `design-system/test-results/strata-shell-remediation-2026-09-28-node22/full/matrix.json`; focused reports are in the same ignored result directory. The earlier failure counts above remain as history and are superseded for current configured Storybook shell scenarios.

This closes shell browser-matrix evidence only for those configured scenarios. Business Suite AC-05 remains failed: published-package compatibility is unresolved and representative consumer routes, screen-reader, true zoom/reflow, and OS accessibility-mode proof remain open. The separate 113-component reference benchmark is scoped in `docs/changes/strata-113-component-benchmark-program-2026-09-28.md`; its generated ledger contains 113 inventory-linked rows, but only three carry recorded prior research and all overall statuses remain `NOT VERIFIED` until direct comparisons and all applicable evidence are refreshed.

| Criterion | Current state | Evidence |
| --- | --- | --- |
| Provider package/type safety | PASS | Node 22 `pnpm typecheck`; see same-day provider gates above. |
| Story discovery/build | PASS | `pnpm check:storybook` and fresh Node 22 Storybook production build. |
| Required shell matrix | PASS | Nine groups, 47 stories, 371 scenarios, 92 axe scans, 63 screenshots, zero failures. |
| Business Suite package compatibility | FAIL | The app directly links to `../design-system`, but its framework dependency brings UI 1.0.15 and app typecheck reports broad missing-export/prop mismatches. Published-distribution compatibility is unverified. No lockfile or publication change was made. |
| Business Suite token gate | FAIL | Supported Node 22 `pnpm check:tokens` reports 161 hard-coded pixel-length violations across six files, including existing dirty `strata-home` and `HomeSidebar` styles. |
| Business Suite end-to-end journeys | NOT VERIFIED | Module, Finance and POS workflows; screen reader, true zoom, forced-colour and reduced-motion OS proof remain open. |
| 113-component comparisons | PARTIAL | All current components and Storybook IDs indexed; refreshed reference/Storybook side-by-side evidence is incomplete. |

Designed: shells, comparison rubric and initial evidence ledger. Implemented: scoped provider shell corrections and generated 113-row index. Tested: Node 22 provider typecheck, focused tests, Storybook standards/build and the complete shell matrix. Integrated: Storybook only; Business Suite is not integrated against the current package. Deployed: no. Released/published: no. **This is not done.**

### Current package-graph correction — 2026-09-28

Correction to the earlier statement that Business Suite's direct UI dependency was locked to 1.0.15: current `pnpm list` and `pnpm why @kannan19302/ui` show the direct app dependency is a local link to `../design-system`; `@kannan19302/framework@0.1.4` separately depends on UI `1.0.15`. The broad typecheck failure remains when checked against the local provider source. The direct published-package compatibility question is still open because this graph does not prove a published artifact or release distribution.

### Current consumer recheck — supported Node 22

Read-only checks against the current working tree show:

| Check | Current result |
| --- | --- |
| `pnpm list @kannan19302/ui --depth 0` / `pnpm why @kannan19302/ui` | Direct app dependency is `link:../design-system`; `@kannan19302/framework@0.1.4` also resolves transitive `@kannan19302/ui@1.0.15`. |
| `pnpm typecheck` | FAIL — 746 diagnostics: 335 TS2305, 325 TS2322, 83 TS2724, 3 TS2307. The diagnostics include 18 distinct missing named exports, repeated Input prop shape mismatches, and 3 imports from the absent `@kannan19302/ui/platforms/business-suite` subpath. |
| `pnpm check:tokens` | FAIL — 161 hard-coded pixel-length violations across six files against zero-violation baselines. |

The distinct missing names are `StatusBadge`, `SubTabBar`, `SubTab`, `ModuleTab`, `ModuleTabLayoutProps`, `DashboardChart`, `ModuleTabLayout`, `ChangeHistory`, `DashboardKPICard`, `SubTabBarProps`, `StatCardItem`, `StatCardRow`, `TransactionWorkspace`, `DrillDownModal`, `DemoBanner`, `TabbedConsole`, `TransactionSummaryItem`, and `TrialCountdown`. These diagnostics do not authorize adding application-specific exports to the L1 design-system package. PLT-ERP must own the consumer migration map: use public shared primitives for generic UI and keep domain/application capabilities in Business Suite. Consumer files were not edited in this recheck; existing working-tree changes are preserved.

The follow-up ownership and dependency sequence is specified in [`strata-business-suite-consumer-alignment-2026-09-28.md`](strata-business-suite-consumer-alignment-2026-09-28.md). It records that `StatCardItem`/`StatCardRow` already exist on the public root/compositions exports but are imported from the wrong `layout` subpath, while `StatusBadge` exists in source but lacks a public barrel export. All app migrations and end-to-end acceptance criteria remain open.

