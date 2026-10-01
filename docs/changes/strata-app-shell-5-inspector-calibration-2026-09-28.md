# AppShell-5 inspector calibration — R2 change contract — 2026-09-28

## Cycle status

- Status: `PARTIAL`
- Cycle objective: compare AppShell-5's dual workspace with direct online panel references and improve the provider story/layout where the task evidence supports it.
- Completed this cycle: reviewed authority and references; implemented the AppShell-5 selection/inspector story and dual layout calibration; captured desktop, tablet and mobile views; ran provider gates and browser interactions.
- Incomplete this cycle: complete accessibility/theme/density/direction/zoom matrix; Business Suite route proof; whole-catalog comparison and readiness.
- Verification evidence: `docs/evidence/component-benchmarks/2026-09-28/app-shell/comparison.md`, retained AppShell-5 viewport captures, provider checks, and browser geometry/interaction measurements below.
- Next required action: continue the component benchmark and consumer journey work; AppShell and overall goal remain unverified.
- Required honesty statement: **This is not done.**

| Claim | State | Evidence |
| --- | --- | --- |
| Designed | `PARTIAL` | Reference fit and responsive behavior reviewed; full matrix remains open. |
| Implemented | `YES — SCOPED` | Existing dual variant CSS and AppShell-5 illustrative story only; no public API change. |
| Tested | `PARTIAL` | Provider checks and selected browser interaction/viewport checks pass; full matrix remains open. |
| Integrated | `NOT VERIFIED` | No Business Suite consumer route is exercised. |
| Deployed | `NO` | No deployment. |
| Released | `NO` | No package publication or release. |

## 1. Request and outcome

- Human request: complete Strata reference comparisons and align components for end-to-end UniERP Business Suite readiness.
- User/business outcome: make the dual shell's right inspector usable as contextual information alongside its related workspace, with a clear selection flow and a layout that does not squeeze desktop content or overflow narrow viewports.
- In scope: `AppShell-5` story composition and the existing dual-variant CSS layout; comparison evidence, ledger and traceability.
- Out of scope: business data/permissions, consumer routes, new public props/exports/dependencies, package publication, deployment, release, and broad catalog elevation.
- Acceptance criteria:
  1. **AC-01 — Reference fit:** record the actual Shadcnblocks Dashboard 16 right-panel implementation as the closest visual reference; use SAP side-content guidance and shadcn Resizable as supplemental behavior/layout sources, recording their limits.
  2. **AC-02 — Related inspector:** Storybook's main work item selection opens matching illustrative details; a labelled close action hides the inspector and returns keyboard focus to the selected item; selecting another item updates the inspector.
  3. **AC-03 — Responsive layout:** when present on wide desktop, the inspector has at least 320 CSS px width; at 1200 CSS px and below it follows the workspace without horizontal document overflow; absence of an inspector does not leave an empty third grid track.
  4. **AC-04 — Semantic and token-safe story:** the main selection controls and complementary inspector expose their selected/label states; styles use semantic tokens/logical properties; no product authority or live data is implied.
  5. **AC-05 — Provider proof:** focused AppShell tests, package tests, Storybook standards, inventory, typecheck, lint and build pass on supported Node 22; browser inspection checks selection/close/focus and responsive geometry.
  6. **AC-06 — Honest readiness:** keep `app-shell` overall `NOT VERIFIED` until all shell states/matrices and Business Suite journey proof are complete.

## 2. Authority and ownership

- Risk class: `R2` — shared shell layout behavior and Storybook consumer.
- Accountable platform: PLT-DS. Business Suite journey owner: PLT-ERP.
- Data/contract owners: applications own record data, selection authorization and actions; no API/data contract change.
- Requirement IDs: DS-FR-002/005/006/007/010, DS-NFR-004/006/007/009/010, DS-UX-001/004/007/008/009.
- Applicable authority: accepted ADR-0009; PLT-DS `REQUIREMENTS.md` and `EXPERIENCE.md`; current 116-component benchmark program; frozen `STRATA_ELEVATION_PROTOCOL.md`; workspace/repository AI development protocol.
- Repositories/consumers: `design-system` Storybook and shared AppShell provider; no consumer source migration.
- Existing artifacts searched: AppShell source/module/test/stories, package exports/config, AppShell ledger/comparison, shell readiness contract, accepted shell and Strata protocols, platform traceability.
- Instruction or authority conflicts: the component benchmark program permits comparison and scoped component packets while broad catalog elevation remains gated on Input/DataTable/Breadcrumb. This packet changes one AppShell dual layout and story only; it does not activate bulk elevation. The separate `core/shell` 28-directory contract is not in this packet's filesystem scope.

## 3. Decisions and assumptions

- Inspected facts: current `inspector` slot is always visible when supplied and has a fixed 18rem (288px) basis; the desktop grid retains an 18rem third track even if no inspector is supplied; at the narrow mobile breakpoint the inspector follows the workspace. The current story has plain recent-work rows and a fixed unrelated-looking inspector with no selection/close interaction.
- Reference evidence: Shadcnblocks Dashboard 16 presents a navigation rail, dashboard, and persistent right bookings panel; SAP Dynamic Side Content guidance relates side content to main content, requires main-task access without the panel, and documents responsive behavior; shadcn Resizable presents keyboard-supported splitter panels. The SAP Side Panel guideline provides a 320px default and contextual content examples.
- Material assumption: AppShell's inspector remains caller-owned presentation and does not make a record authorization decision; the story's records are synthetic.
- Human decisions received: user's active full-catalog goal authorizes this scoped implementation work; no production, publication, deployment, release, or SCM action is authorized.
- Restricted actions: none planned.

## 4. Change design

- Current behavior: fixed 18rem inspector, no empty-track collapse when the inspector is omitted, and a static story details panel unrelated to interactive selection.
- Intended behavior: adaptive minimum-width inspector on wide layouts, workspace-following inspector at narrower desktop widths, correct grid collapse when absent, and a keyboard-operable illustrative selection/close flow in AppShell-5.
- Invariants and transaction boundary: no business mutation or persistent state; Storybook-only records; consumers supply data and callbacks; public API and exports remain unchanged.
- Failure/degraded/retry/reconciliation: not applicable; local story state resets on render.
- Concurrency/idempotency: not applicable.
- Contract/version/consumer impact: no public type/API change; CSS presentation behavior changes additively for existing dual layout.
- Schema/migration: none.
- Authentication/permission/tenant/record scope: no authority asserted; no tenant data.
- Data/privacy: synthetic names and sample data only.
- UI impact: selected row state, inspector open/close, responsive track sizing, keyboard focus restoration, Strata token/logical-property use. Localization and the full theme/density/RTL/zoom matrix remain open.
- Operations/performance: no production runtime or service impact.
- Dependencies/licenses/provenance: no dependency addition; external references are attribution/evidence only.

## 5. Delivery safety

- Feature flag/staged rollout: none; Storybook/provider-local.
- Compatibility: public API unchanged; preserve existing dual variant slot order and desktop navigation behavior.
- Rollback: restore only AppShell dual CSS/story and remove this packet's authored evidence updates. No data or consumer rollback.
- Owners/runbooks: none.

## 6. Verification plan

| Claim or requirement | Proof boundary | Test/check command | Expected result |
| --- | --- | --- | --- |
| Panel presence/absence and selection semantics | AppShell provider | `pnpm test -- src/shells/app-shell/app-shell.test.tsx` | Focused suite passes; regression test covers omitted inspector track. |
| Story source/metadata | Storybook provider | `pnpm check:storybook` | All current stories pass standards. |
| Provider package | Design system | `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm check:inventory`, `pnpm build` | All pass on supported Node 22. |
| Interaction/reflow | Browser Storybook | inspect AppShell-5 at desktop and 1024/390 CSS px; select, close, keyboard focus and overflow | Inspector follows selection, closes, focus returns; no document overflow. |
| Full readiness | All supported states and consumer | theme/density/direction/zoom/a11y matrices + real Business Suite journey | Not covered by this bounded packet; ledger remains `NOT VERIFIED`. |

Adversarial cases: no inspector/closed state; selection changes; keyboard open/close/focus restoration; narrow viewport; long selected record text. Authentication, cross-tenant, retries, mutation, and database cases are not applicable to a presentation-only Storybook example.

## 7. Completion evidence

### Final status

- Status: `PARTIAL`
- Completed acceptance criteria: AC-01, AC-02, AC-03, AC-04 and AC-05 for the bounded provider/story scope.
- Incomplete acceptance criteria: AC-06 explicitly preserves the `NOT VERIFIED` ledger state; broader accessibility/state matrices and Business Suite consumer journey remain open.
- Is this done? `NO`
- **This is not done.**

### Verification

| Status | Working directory | Exact command | Evidence/result |
| --- | --- | --- | --- |
| `PASS` | `design-system` | `pnpm test -- app-shell.test.tsx` | 21/21 AppShell tests passed. |
| `PASS` | `design-system` | `pnpm check:storybook` | 123 source story files / 116 component stories pass. |
| `PASS` | `design-system` | `pnpm check:inventory` | 116 components, 116/116 story coverage, 47 package exports. |
| `PASS` | `design-system` | `pnpm test` | 136 test files / 831 tests pass on Node 22.23.3. |
| `PASS` | `design-system` | `pnpm typecheck`; `pnpm lint`; `pnpm build` | All pass on Node 22.23.3. |
| `PASS` | `design-system/storybook` | `pnpm run build-storybook` | Production Storybook static build completes. |
| `PASS` | Storybook browser | AppShell-5 story at 1440×900, 1200×900, 1024×900, 390×844; select row, inspect details, close, verify focus | Inspector measures 360px at 1440; follows workspace at 1200/1024; stacks beneath at 390; document width equals viewport at every size; focus returns to selected row; no page errors. Captures retained in the comparison packet. |

### Compatibility and delivery

- Backward compatibility: no public API or export change.
- Rollout/feature flag: none; no deployment.
- Migration/backfill: none.
- Rollback: revert scoped AppShell dual story/CSS and evidence.

### Remaining risk and human action

- Pre-existing failures: business-suite linked package/type compatibility and route validation are tracked separately in the readiness evidence.
- Residual risks: actual consumer behavior and complete accessibility, theme, density, direction, zoom and assistive-technology matrices remain open. The primary reference is a published static preview, so the local capture is a visual comparison rather than a matched live viewport.
- Unverified assumptions: no consumer adoption inferred from Storybook.
- Human actions/approvals still required: none for this local packet; production/release/publish remains separately gated.

Knowledge delta: `UPDATED` for the component comparison and scoped layout decision; `REQUIRED-BUT-INCOMPLETE` for overall Strata/Business Suite readiness.
