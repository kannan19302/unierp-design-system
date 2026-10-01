# Strata density token cascade correction — 2026-09-28

## Cycle status

- Status: `PARTIAL`
- Cycle objective: Correct and verify the shared density token cascade exposed by live Input calibration.
- Completed this cycle: Corrected the root fallback specificity; repaired current-source, fail-closed density checks; added regression coverage; passed design-system package gates; remeasured all 12 Input theme × density combinations; refreshed the evidence packet, ledger and traceability.
- Incomplete this cycle: Full Input calibration, remaining DataTable/Breadcrumb gates, downstream route proof, true zoom/OS-mode/screen-reader evidence and the 113-row component program.
- Verification evidence: Local Storybook now measures Input `sm`/`md`/`lg` at 20/24/28, 24/28/32, 28/32/40, and 32/40/48px across four densities and three themes; five all-state examples remain without document overflow in all 12 theme × density samples. Node 22.23.3 package tests pass 132 files / 822 tests; lint, typecheck, inventory, Storybook standards, package build and production Storybook build pass.
- Next required action: Continue the frozen Input/DataTable/Breadcrumb calibration and Business Suite consumer evidence; do not claim the design system is ready until all required criteria close.
- Required honesty statement: **This is not done.**

| Claim | State | Evidence |
| --- | --- | --- |
| Designed | `YES` | This contract; existing DS-FR-007 and published `data-density` contract |
| Implemented | `YES` | Root fallback selector and density gate corrected; regression test added |
| Tested | `YES` | Node 22.23.3 package checks and live 12-sample Storybook matrix recorded in `docs/evidence/component-benchmarks/2026-09-28/input/iteration-report.md` |
| Integrated | `NOT VERIFIED` | Shared package consumers are listed below; no consumer is changed in this packet |
| Deployed | `NOT APPLICABLE` | Local source correction only |
| Released | `NOT APPLICABLE` | No package publication or release authorized |

## 1. Request and outcome

- Human request: Make the Strata design system end-to-end ready for the UniERP Business Suite.
- User/business outcome: Shared controls consistently honor the selected four-tier density in Business Suite and other package consumers.
- In scope: The cascade collision between root standard defaults and explicit density selectors; a focused regression proof; Input's live density recalibration; dated evidence, benchmark-ledger status and Design Platform traceability.
- Out of scope: Changing density sizes, Input API, colors, typography, radius, migrating consumers, publishing the package, or declaring the frozen calibration gate open.
- Acceptance criteria:
  - **AC-01:** PASS — root fallback has zero selector weight; each explicit density sets its accepted value.
  - **AC-02:** PASS — default md Input measures 24/28/32/40 CSS px in the four density globals.
  - **AC-03:** PASS — all five gallery states render in 12/12 theme × density samples without document overflow.
  - **AC-04:** PASS — focused regression and applicable design-system checks pass on Node 22.23.3.
  - **AC-05:** PASS — current evidence, the 113-component ledger and PLT-DS traceability are updated; overall calibration remains `NOT VERIFIED`.

## 2. Authority and ownership

- Risk class: `R2 — shared package token behavior`
- Accountable platform(s): `PLT-DS`; consuming product platform: `PLT-ERP` (Business Suite).
- Contract/data owner(s): Design Platform owns CSS tokens; no data owner applies.
- Applicable requirement IDs: `DS-FR-001`, `DS-FR-002`, `DS-FR-007`, `DS-FR-009`, `DS-NFR-004`, `DS-NFR-006`, `DS-NFR-007`, `DS-NFR-009`; `DS-PKG-001`, `DS-PKG-002`, `DS-PKG-005`.
- Applicable ADRs and standards: ADR-0009; AI Agent Development Protocol 1.1.0; AI Knowledge Lifecycle; Design Platform Requirements, Contracts and Strata Elevation Protocol.
- Repositories/consumers affected: `design-system` token source and Storybook proof; all web consumers of the published `@kannan19302/ui` token stylesheet are potentially affected. Business Suite is the priority downstream consumer; no consumer source change is planned.
- Existing artifacts searched before creating anything new: `density.css`, text-field CSS and tests, current token checks, Input Storybook packet, the dated benchmark ledger, Design Platform calibration protocol/evidence and existing R2 change contracts.
- Instruction or authority conflicts: None. Existing source contradicts DS-FR-007 and the published density contract; authority is preserved by correcting the cascade rather than changing the requirement.

## 3. Decisions and assumptions

- Inspected facts: The comfortable rule sets `--density-control-height: 40px`; the later `:root, [data-density="standard"]` rule had equal selector specificity, so its root arm won on `<html data-density="comfortable">`. Live Storybook confirmed 32px before the correction. The density gate used obsolete paths and skipped checks when those paths were absent.
- Material assumptions: Standard density is applied explicitly by the shell/Storybook; bare `:root` still needs a 32px fallback when no density is specified. The live four-mode matrix and foundation regression pass with `:where(:root)` fallback.
- Human decisions received: The user authorized completion work, including local shared UI corrections and evidence. No authorization to publish, deploy, release, or perform a breaking change was provided.
- Restricted actions and exact authorization status: Publication/deployment/release are R3 and not authorized; no such action is planned.

## 4. Change design

- Current behavior: The root standard fallback overrode comfortable, making standard-sized controls render 32px under comfortable density. The density script looked at obsolete `src/core/...` paths and silently skipped minimum-size/touch/row checks when the sources were absent.
- Intended behavior: Root fallback has zero selector weight, while an explicit density selector controls the token; the four accepted control and row values remain 24/28/32/40px. The density gate reads canonical current-source paths and fails when required token sources are missing.
- Invariants and transaction boundary: CSS-only presentation tokens; no persistent mutation, transaction, auth, tenant or record-scope impact.
- Failure/degraded/retry/reconciliation behavior: Not applicable to static token CSS; stale or unsupported attributes retain the standard fallback.
- Concurrency and idempotency: Not applicable.
- Contract/version/consumer impact: Public token names and values remain stable. The shared package visual result changes only where a nonstandard explicit density was incorrectly overridden.
- Schema/migration/backfill impact: None.
- Authentication/permission/tenant/record scope: None; density does not grant or remove actions.
- Data classification, privacy, retention, residency, erasure, and audit: None.
- UI states, design-system impact, accessibility, localization, and responsive behavior: Verify current Input gallery states, all 3 themes × 4 densities, direction/reflow where existing matrix supports it; retain the 11px type floor and existing semantic theme tokens. True browser zoom, OS forced colors/reduced motion and live screen-reader evidence remain separate calibration gates.
- Observability, performance budget, capacity, and operational impact: No runtime telemetry or measurable capacity change; CSS selector correction.
- Dependencies, licenses, provenance, and supply-chain impact: None.

## 5. Delivery safety

- Feature flag or staged rollout: None; correction is deterministic and additive to existing density selectors.
- Compatibility window: No public API/token removal or rename.
- Rollback or roll-forward: Revert the scoped token selector correction and this evidence delta; no data rollback.
- Data recovery/reconciliation: None.
- Owners/runbooks/dashboards affected: PLT-DS evidence and traceability; consumer applications only require package artifact refresh through their normal release workflow.

## 6. Verification plan

| Claim or requirement | Proof boundary | Test/check command | Expected result |
| --- | --- | --- | --- |
| AC-01 token fallback and explicit density cascade | Foundation token CSS | `pnpm lint` and focused token/density checks | Explicit modes resolve their named values; unspecified root stays standard |
| AC-02 density geometry | Live Storybook default and all-state Input | Real browser Storybook measurement in all four globals | 24/28/32/40px |
| AC-03 visual state/theme matrix | Live Storybook gallery | Browser matrix for 3 themes × 4 densities; check document widths and five field states | 12/12 samples stable, no page overflow |
| AC-04 package regression and quality | `design-system` | Focused Vitest, typecheck, lint, build, Storybook standards/build as required by package rules | All applicable gates pass; zero-target/skipped checks are not passes |
| AC-05 traceability and ledger | PLT-DS authorities | Inspect links, source paths, criterion states and denominator | Current-source evidence, 113 rows retained; no false PASS |

Required adversarial cases:

- invalid and boundary input: Not applicable; density attribute is selected by the host shell, and unsupported values use root fallback.
- unauthenticated/unauthorized/record-scope denial: Not applicable; no authority change.
- tenant A/tenant B/no-context isolation: Not applicable; visual preference only.
- duplicate/retry/concurrency: Not applicable.
- dependency failure/timeout/degraded behavior: Not applicable to static stylesheet delivery; verify token asset is loaded by Storybook/package checks.
- migration forward/recovery/production-shaped volume: Not applicable; no migration.
- keyboard/screen reader/zoom/reflow where user-facing: Verify Input focus and existing live accessibility sample; retain explicit NOT VERIFIED status for true 200% zoom, OS modes and screen-reader output if not directly observed.

## 7. Completion evidence

### Final status

- Status: `PARTIAL`
- Completed acceptance criteria for this bounded correction: AC-01–AC-05.
- Incomplete overall Strata readiness work: Input's broader calibration, DataTable and Breadcrumb calibration, consumer route/published-package proof, and the remaining 113-row program.
- Is this done? `NO`
- If no: **This is not done.**

### Outcome

The R2 scope corrects the shared density fallback behavior and supplies current evidence for Input calibration. It does not certify the whole Strata catalog or remove the three-component elevation freeze.

### Changed platforms, repositories, and important files

`design-system/src/foundation/tokens/density.css`, `design-system/scripts/check-density.mjs`, `design-system/scripts/check-foundations.test.mjs`, this R2 contract, `design-system/docs/evidence/component-benchmarks/2026-09-28/input/comparison.md`, `design-system/docs/evidence/component-benchmarks/2026-09-28/input/iteration-report.md`, the 113-row design-system benchmark ledger, and `platform/docs/platforms/design-system/TRACEABILITY.md`.

### Impact assessment

- Contracts/API/events/SDK: No public API or token-name changes.
- Database/migration/data lifecycle: None.
- Authentication/authorization/tenant isolation/security/privacy: None.
- UI/UX/accessibility/localization: Shared density behavior; see AC-02/03 and unresolved operating-mode gates above.
- Operations/observability/performance/resilience: No runtime service impact.
- Dependencies/supply chain: None.

### Verification

| Status | Working directory | Exact command | Evidence/result |
| --- | --- | --- | --- |
| `PASS` | `design-system` | Node 22.23.3 `pnpm test` | 132 files / 822 tests passed |
| `PASS` | `design-system` | Node 22.23.3 `pnpm lint`, `pnpm typecheck`, `pnpm check:inventory`, `pnpm check:storybook`, `pnpm build` | All exited 0; inventory discovers 113 components |
| `PASS` | `design-system` | Node 22.23.3 `pnpm --dir storybook build-storybook` | 2316 modules; exited 0; upstream Storybook runtime emitted `eval` warnings |
| `PASS` | Local Storybook | Default and all-states stories in all 12 theme × density globals | md heights 24/28/32/40px; all five states retained; no document overflow |
| `PASS` | `design-system` | `git diff --check` scoped to changed source and evidence packet | No whitespace errors; unrelated dirty files remain outside this packet |

### Compatibility and delivery

- Backward compatibility: Token names and expected values preserved; only erroneous cascade precedence changes.
- Rollout/feature flag: No flag; local package validation only.
- Migration/backfill: None.
- Rollback/roll-forward: Revert the scoped CSS/evidence patch; no persistent state.

### Remaining risk and human action

- Pre-existing failures: Existing workspace changes in multiple unrelated design-system files must be preserved and not attributed to this packet.
- Residual risks: Input calibration also needs the separately recorded true zoom, OS accessibility mode, live screen-reader and consumer integration evidence.
- Unverified assumptions: Exact consumer versions and rendered Business Suite end-to-end usage remain outside this bounded token correction.
- Human actions/approvals still required: Exact target authorization before package publication, deployment or release.

Knowledge delta: `UPDATED` for this correction. Overall Strata readiness remains `REQUIRED-BUT-INCOMPLETE`.
