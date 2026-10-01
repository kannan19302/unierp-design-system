# DataTable small-screen alternative — change contract — 2026-09-28

Status: R2 coordinated shared UI change. Owner: PLT-DS. Contract owner: `@kannan19302/ui`. Downstream owners: PLT-ERP for Business Suite records and journeys; other observed DataTable consumers retain their own task/data presentation. This contract extends the existing Strata calibration and shell responsive/accessibility packets. Local source and Storybook changes are authorized; package publication, consumer migration, deployment and release are not included.

## Outcome and authority

The fresh `compositions-table--enterprise-workbench` matrix shows that horizontal overflow is contained at 320px, but invoice identifiers and customer labels wrap heavily. `DS-NFR-007` requires an accessible small-screen alternative for complex grids. The frozen Strata protocol also requires a small-screen alternative when a grid scrolls horizontally. Provide an optional, caller-owned responsive presentation slot in the existing DataTable so each L4 app can show its task-appropriate mobile view without transferring business data or action authority into L1.

Research: the [official shadcn Table](https://ui.shadcn.com/docs/components/base/table) demonstrates a simple responsive table. For dense enterprise records, official [SAP Fiori responsive-table guidance](https://experience.sap.com/fiori-design-web/responsive-table/) uses labeled value pop-ins and protects the identifier column; SAP's [table overview](https://experience.sap.com/fiori-design-web/table-overview/) distinguishes moderate line-item tables from desktop-centric complex grids and recommends task-adapted mobile solutions. Strata will not impose one automatic mobile transformation on all DataTable consumers; each caller supplies the data presentation and semantics appropriate to its user task.

## Acceptance criteria

1. **AC-01 — Additive API:** add an optional `mobileAlternative?: ReactNode` slot to `DataTableProps<T>`. It accepts presentation only. Existing props, table markup, sort/selection/edit authority, default scrolling, row/windowing behavior, and public subpaths remain unchanged when omitted.
2. **AC-02 — Responsive switch:** when a non-null alternative is provided, the scrollable table is hidden from visual and accessibility trees and the alternative is shown when the DataTable's available inline size is at or below 48rem. Above that size the alternative is hidden and the existing table is shown. Use a container query so embedded/narrow workspaces respond to their actual width.
3. **AC-03 — Consumer-owned demo:** update the Enterprise Workbench story to provide an accessible invoice-list/card alternative at narrow size, retaining identifier, customer, status, amount, selection, and row actions. Search/filter/page/selection/action status remain driven by the same Storybook state. The demo does not mutate business data.
4. **AC-04 — Browser evidence:** at 320px/740px, all three themes and all four densities show the mobile alternative without document overflow, hidden duplicate table content, clipped controls, or page errors; keyboard can reach the alternative controls and activate selection/action. At 1280px/720px the existing desktop table remains visible and equivalent to its current capture. Capture at least the representative narrow and wide cases and record a full requested theme/density matrix result.
5. **AC-05 — Provider proof:** add focused tests for slot presence and preserve existing no-slot behavior; run DataTable tests, axe on the Storybook mobile alternative, Node 22.23.3 typecheck/lint/inventory/Storybook standards/package build/static Storybook build. No zero-target or stale result counts as PASS.
6. **AC-06 — Evidence and handoff:** update the DataTable ledger, dated comparison/evidence, and PLT-DS traceability with exact command/browser results and remaining limits. Keep DataTable overall `NOT VERIFIED` until RTL, zoom/OS, screen-reader, complete state, published-package, and affected consumer journey gates pass. Business Suite migration remains a separate PLT-ERP-owned packet after provider validation.

## Owners and dependency graph

- L1 provider: PLT-DS owns the DataTable slot, breakpoint behavior, token-compatible wrapper, and provider tests.
- L4 validation consumer: Storybook owns the illustrative invoice list and interaction fixture.
- L4 product consumer: Business Suite owns deciding which routes need an alternative and its truthful mobile task/data presentation. Do not invent a one-size-fits-all Business Suite behavior in DataTable.
- No L0 contract, persisted data, service, permission, tenant scope, authentication, API, or dependency change.

## Invariants, failure and rollback

- The scroll region remains named, keyboard reachable, and unchanged when the optional slot is absent.
- Only one presentation is exposed to visual and assistive-technology navigation at a time. The caller must keep both presentations synchronized when the slot is used.
- The alternative remains caller-owned and may not claim DataTable sort/filter/export/selection state unless that caller wires it to the same source of truth.
- The story's mobile alternative is illustrative synthetic data and must maintain its own meaningful loading, empty, error and forbidden states if those are shown.
- Revert the optional prop, wrapper/container-query styles, focused test, and story fixture to roll back; no persisted state or migration exists.

## Current acceptance state

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 — Additive API | PASS | Optional `mobileAlternative` prop; existing tests confirm the original table remains rendered and the no-slot behavior is unchanged. |
| AC-02 — Responsive switch | PASS for tested widths | Container query shows the list at 320px and the table at 1280px in all canonical theme/density combinations. Intermediate widths and actual browser zoom remain unverified. |
| AC-03 — Consumer-owned demo | PASS for Storybook fixture | Invoice ID/customer/status/amount, selection and actions are supplied by the story and share filter/page/selection/action state. Loading/error/forbidden story alternatives remain open. |
| AC-04 — Browser evidence | PASS for configured 24-case matrix | 12 narrow alternatives and 12 desktop tables; no page errors or document overflow. Keyboard selection/action pass in the mobile story. Screenshot and axe results are in `../evidence/component-benchmarks/2026-09-28/table/matrix-captures.md`. |
| AC-05 — Provider proof | PASS | Node 22.23.3: DataTable tests 22/22; lint, typecheck, inventory, Storybook standards, package build and static Storybook build pass; narrow axe 12/12 zero violations. |
| AC-06 — Evidence and handoff | PARTIAL | Benchmark and PLT-DS traceability updated. RTL, real 200% zoom, OS modes, manual screen-reader use, full states, published-package behavior, and Business Suite route adoption remain unverified. |

## Knowledge delta

`UPDATED` — the existing DS-NFR-007 and frozen protocol define the obligation; this packet records the additive slot semantics, responsive switch, owner boundary, rollback and proof plan. Update the requirement only if implementation proves it insufficient; do not weaken it to bless existing scroll-only behavior.
