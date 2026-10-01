# Strata shell responsive and accessibility remediation — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — coordinated shared UI, Storybook evidence, downstream consumers`. Accountable platform: PLT-DS; Business Suite journey owner: PLT-ERP. Shared package/API owner: `@kannan19302/ui`; Storybook is a validation consumer. No business authority, persistence, identity, permission, data, HTTP/event contract, package version, consumer lockfile, publication, deployment, or release change is authorized by this packet.

## Outcome and acceptance criteria

Repair the observed shell usability and accessibility defects from the 371-scenario consolidated matrix, then establish clean evidence on supported Node 22.

1. **AC-01 — DataWorkspace mobile containment:** at 390px and supported zoom, page chrome fits the viewport; intrinsically wide data stays inside its named, keyboard-reachable table region and exposes an accessible narrow-screen alternative where needed.
2. **AC-02 — EditorialShell reflow:** synthetic editorial story and reusable shell content reflow at 390px without page-level horizontal scrolling or clipped controls.
3. **AC-03 — Manifest reflow:** navigation tree presentation fits supported narrow viewports without page-level horizontal overflow; names remain visible/readable.
4. **AC-04 — WCAG contrast and target size:** resolve the current shell-story color-contrast failures across all supported themes and the Meridian copy control's 23×19px target; no axe failure is waived without owner-approved exception.
5. **AC-05 — Full consolidated shell proof:** all nine required shell groups and story states pass their matrix, with zero runtime, horizontal-overflow, axe, or missing-target failures.
6. **AC-06 — Supported-runtime/provider and consumer handoff:** run relevant design-system gates on Node 22 and report consumer compatibility separately; no Business Suite integration is implied by Storybook proof.
7. **AC-07 — Knowledge/diff:** update dated evidence and PLT-DS traceability with exact results, remaining gaps, rollback, and separate designed/implemented/tested/integrated/deployed/released status.
8. **AC-08 — Token gate debt:** replace the comfortable MeridianBar's two literal 40px minimum heights with the existing density row-height token and a 40px fallback. Confirm comfortable mode still computes to 40px and the file no longer exceeds its recorded token-gate baseline; do not change the baseline.

## Authority, source boundary, rollback

Inspected for this packet: prior matrix JSON and failing selectors, design-system local instructions, current shell source and stories, `DS-FR-002`, `DS-FR-005`, `DS-FR-006`, `DS-FR-007`, `DS-FR-008`, `DS-NFR-004`, `DS-NFR-006`, `DS-NFR-007`, `DS-NFR-009`, `DS-UX-001`, `DS-UX-004`, `DS-UX-006`, `DS-UX-009`, ADR-0009 and ADR-0012, and existing working diffs. Changes stay in `design-system`; the inspected source uses synthetic content. Existing uncommitted files remain protected.

Fix canonical layout/interaction in L1 components when their behavior is defective; fix only synthetic content in `.stories.tsx` when findings come from fixtures. Wide business tables may retain two-dimensional scrolling only inside an accessible labeled/focusable region and need an accessible small-screen alternative. All colors must use approved theme-aware semantic tokens or contrast-safe treatment. Preserve public APIs and semantics. Rollback is a reviewed source/story CSS reversal; no persisted records or migrations exist.

Knowledge delta: `UPDATED`; the existing owning requirement and traceability are sufficient, while this packet and dated evidence carry implementation facts. Auth/tenant/data/API/privacy impact: none. UX/accessibility: direct impact. Consumer integration: must be checked after provider proof. Human goal request authorizes this remediation and validation; distribution, release, and SCM changes remain outside this packet.

## Verification plan

- Focused shell unit/a11y tests for every canonical component changed.
- `pnpm check:storybook`, package typecheck/lint/tests/build, and static Storybook build on Node 22.
- Nine-shell browser matrix and keyboard checks on fresh static Storybook; inspect all previously failing nodes and dimensions.
- Business Suite token/typecheck and representative journey checks only after the provider package source is validated; preserve its current uncommitted edits.

No check passes from zero targets, unsupported runtime, or waived axe rules.

## Supported-runtime completion evidence — 2026-09-28

Validation used Node `v22.23.3` and pnpm `9.15.4` against a newly generated Storybook production build served from `http://127.0.0.1:6006`.

| Check | Result |
| --- | --- |
| `pnpm check:storybook` | PASS — 120 source stories parsed; 113 component stories conform. |
| `pnpm typecheck` | PASS. |
| Focused DataShell, EditorShell and RecordShell tests | PASS — 3 files, 41 tests. |
| DataShell browser matrix | PASS — 40 scenarios, 0 failures. |
| EditorShell browser matrix | PASS — 40 scenarios, 0 failures after changing the footer mark to `--color-primary-text`; 9 axe samples across stories/themes, no violations. |
| Fresh `pnpm --dir storybook build-storybook` | PASS — Storybook 8 static production build. Upstream Storybook runtime `eval` warnings remain. |
| Consolidated required-shell matrix | PASS — 9 groups, 47 stories, 371 scenarios, 92 axe scans, 63 screenshots, 0 failures. Report: ignored local `test-results/strata-shell-remediation-2026-09-28-node22/full/matrix.json`. |

The consolidated run supersedes the earlier 55-failure and 20-failure browser runs in this packet. DataShell's former 91px document overflow and EditorialShell's 279px overflow are absent in the current supported-runtime matrix; Manifest and RecordShell also remain clear. The final run has no reported page overflow, axe, target-size, runtime, or missing-target failures. This result proves only the configured Storybook shell scenarios and axe samples. It does not establish true 200% browser zoom, screen-reader use, forced-colour/reduced-motion OS modes, broad Business Suite journeys, provider-to-published-package compatibility, or the full component catalog comparison.

### Updated acceptance state

| Criterion | State | Evidence/remaining |
| --- | --- | --- |
| AC-01 | PASS for configured viewport scenarios | Fresh nine-shell matrix reports zero document-overflow failures. Table content is tested within the named scroll region; separate small-screen business workflows remain a consumer requirement. |
| AC-02 | PASS for configured viewport scenarios | EditorShell was rebuilt after the last source change and passed its 40-scenario focused matrix; the complete run includes all 47 shell stories. |
| AC-03 | PASS for configured viewport scenarios | Manifest passed all included viewport/theme/density cases in the complete matrix. |
| AC-04 | PASS for current Storybook axe and target-size samples | 92 axe scans and configured target-size checks completed with 0 failures. OS accessibility modes and assistive-technology use remain unverified. |
| AC-05 | PASS for the consolidated shell matrix | 371/371 scenarios, nine required groups, zero failures. This is not a provider-wide or consumer integration pass. |
| AC-06 | PARTIAL | Node 22 Storybook/typecheck and focused tests passed; Business Suite compatibility and journeys remain separately unresolved. |
| AC-07 | PARTIAL | This record and the benchmark program/ledger are updated. PLT-DS traceability is refreshed for the current shell result; the full 113-component benchmark and PLT-ERP journey evidence remain open. |

Designed: shell structure and Strata tokens. Implemented: responsive containment, fixture contrast fixes, shell story discovery and validator corrections. Tested: provider typecheck, Storybook standards/build, 41 focused tests, and the 371-scenario shell matrix. Integrated: Storybook provider only; Business Suite integration is not complete. Deployed: no. Released/published: no.

## Token-gate recovery and compatibility proof — 2026-09-28

AC-08 is complete. The two comfortable `MeridianBar` minimum-height declarations now use the local `--density-row-height` token with the existing 40px fallback. No token baseline changed. `MeridianCompatibility` was added as a Storybook sample for the separately exported legacy component still imported as a Business Suite fallback.

| Check | Result |
| --- | --- |
| Node 22 `pnpm check:tokens` | PASS — 155 pre-existing violations across 19 baselined files; no new violations; baseline unchanged. |
| Node 22 `pnpm build` | PASS — foundations, inventory, contrast, density, tokens, logical properties, governance, token generation, package TypeScript build and 113-component inventory. |
| Node 22 `pnpm lint` | PASS — layer, density, contrast, accent and TypeScript gates included. |
| Node 22 `pnpm exec vitest run src/shells/strata-bar/strata-bar.test.tsx` | PASS — 9/9. |
| Node 22 typecheck and Storybook standards | PASS — 120 source story files and 113 component story files. |
| Node 22 Storybook production build | PASS — fresh static build including `MeridianCompatibility`. |
| Storybook browser sample | PASS for this token criterion — `shells-stratabar--meridian-compatibility`, comfortable mode; at 1046px the local density token, min-height, min-block-size and rendered height are all 40px. At 320px the minimum remains 40px, content height is 82.4px, and document/body widths stay 320px. Captures: `docs/evidence/component-benchmarks/2026-09-28/strata-bar/`. |

Current acceptance update: AC-08 PASS. AC-06 remains PARTIAL: provider build/lint pass, but Business Suite typecheck, token debt, journeys and published-artifact compatibility are still open. `pnpm list`/`pnpm why` show Business Suite's direct UI dependency linked to `../design-system`, while `@kannan19302/framework@0.1.4` brings `@kannan19302/ui@1.0.15` transitively. The earlier statement that the app's direct UI dependency was locked to 1.0.15 was inaccurate and is corrected in the separate Business Suite readiness packet. Its current local-source typecheck still has broad missing-export/prop failures; its supported Node 22 token check reports 161 violations across six files.
