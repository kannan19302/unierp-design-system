# DashboardShell numbered variants change contract — 2026-09-27

Risk: R2, additive shared UI. Accountable owner and public package owner: PLT-DS / `@kannan19302/ui`. Repositories: `design-system` implementation/evidence and `platform` owning traceability. Consumer: Storybook and future package consumers. Existing `PlatformShell` and `SideNav` are the owning primitives. No data, service, authorization, or L0 contract change.

## Outcome and acceptance

1. AC-01: Add one reusable `DashboardShell` composition with five visibly distinct layout variants, using the existing `SideNav` in every variant and preserving the existing shell APIs.
2. AC-02: Register five primary Storybook examples under `Shells/DashboardShell`, displayed exactly as `DashboardShell-1` through `DashboardShell-5`.
3. AC-03: Match the supplied Dashboard Shell 1 reference anatomy in variant 1: grouped sidebar, breadcrumb header, three KPI cards, insight/earnings panels, sales/goal panels, and a transaction table. Examples must identify all values and records as synthetic.
4. AC-04: Demonstrate responsive layouts and accessible navigation, chart alternatives, table overflow, and usable light/dark themes. Inspect and repair each story in a real browser at desktop and narrow viewports.
5. AC-05: Run the affected package gates, inspect the complete scoped diff, and record exact evidence and remaining limitations.

## Design and boundaries

`DashboardShell` accepts consumer-supplied navigation, content slots, actor/scope, and callbacks. It composes `PlatformShell` for global scope, menus, skip link, and mobile navigation and `SideNav` for the existing hierarchical sidebar. Variants change presentation only; no permission or business decision occurs in the shell. Synthetic Storybook fixtures illustrate layout and visual hierarchy, not real data. Requirements: DS-FR-002/005/010 and DS-UX-001/004/007/008/009. Supplied visual reference: Shadcn Studio Dashboard Shell 1.

## Invariants and failure behavior

Navigation remains supplied by the application and retains active, disabled, and href semantics. Empty slots simply do not render. The composition neither fetches data nor treats hidden navigation as authorization. If the consumer's data fails, the consumer must supply its own loading/error/empty state in the slots. Mobile navigation retains the existing focus trap and Escape behavior.

## Verification, rollout, rollback, knowledge

Run focused component tests, inventory, typecheck, lint, build, Storybook standards/build, and direct browser checks. No dependency, database migration, feature flag, package publication, or deployment is in scope. Rollback is the scoped `DashboardShell` component, Storybook, styles, tests, export, and traceability entry. Knowledge delta: UPDATED—existing design system requirements remain authoritative, and `platform/docs/platforms/design-system/TRACEABILITY.md` gains bounded implementation/test evidence. This contract is iteration evidence, not a new design authority.

## Approval state

Local implementation and verification are authorized by the request. Publication, deployment, and source-control push have no exact target authorization in this request.

## Verification record

- AC-01 PASS: `DashboardShell` exports five additive layout variants and composes the unchanged `PlatformShell` and `SideNav`. The consumer supplies the navigation tree, content, user, tenant, and callbacks. No app source import or business authorization logic was introduced.
- AC-02 PASS: Live and built Storybook `index.json` each list `DashboardShell-1` through `DashboardShell-5` under `Shells/DashboardShell`, plus generated Documentation. Names use the exact requested hyphen and numbers.
- AC-03 PASS: Browser review of variant 1 shows grouped sidebar, breadcrumb header, three KPI cards, product and earnings panels, sales and goal panels, cohort analysis, and transaction table, following the supplied Shadcn Studio Dashboard Shell 1 anatomy. Storybook labels the content as sample data. UniERP's global scope and account header remains visible above the workspace as required by the existing shell.
- AC-04 PASS: All five stories rendered in the browser at the default desktop viewport and at 390×844. At 390px, document width remained 390px; the transaction table scrolled inside its 327px container. The mobile drawer opened with the existing `SideNav`, closed on Escape, and restored focus to its toggle. Variant 1 also rendered in the Storybook `strata-dark` theme. The focused test found zero automated axe violations. This is bounded component evidence, not a complete screen-reader or consumer journey audit.
- AC-05 PASS: In `design-system`, `pnpm typecheck`, `pnpm check:inventory`, `pnpm exec vitest run src/shells/dashboard-shell/dashboard-shell.test.tsx` (8 tests), `pnpm lint`, `pnpm test` (131 files, 806 tests), `pnpm build`, `pnpm check:storybook`, and `pnpm --dir storybook build-storybook` passed. The initial inventory attempt failed because the test file had not yet been added; it passed after the five-file anatomy was complete. The initial live preview used a stale Storybook import map; restarting the existing dev server resolved it and all stories then rendered. Node 24 produced the repository's existing Node 22 engine warning but did not fail checks. `git diff --check` passed in both affected repositories.
- Knowledge delta UPDATED: a bounded traceability entry was added to `platform/docs/platforms/design-system/TRACEABILITY.md` without altering the other in-progress edits there. The optional enterprise-brain validator was also run and failed because the unrelated `banking-service` repository has no `AGENTS.md`; no banking-service file was changed. Wider design-system requirement statuses remain as recorded by their owner.

## Iteration evidence report

Status: DONE for this local DashboardShell component and Storybook objective. Designed: five layouts. Implemented: shared composition, stories, styles, tests, export. Tested: package gates and browser checks above. Integrated: package shell export and live/built Storybook. Deployed: no. Released or published: no. Schema/migration, authentication, tenant authorization, privacy, and operations changes: none. Backward compatibility: additive; existing shell props and exports remain. Rollout: consumers may adopt the new public export; no feature flag or migration. Rollback: remove this scoped component/export/story/test and the bounded traceability entry. Remaining limits: no consumer application adoption, release, or full assistive-technology audit is claimed. Source-control commit/push awaits exact human authorization under `AIP-SCM-001` and the workspace entrypoint.

## Sidebar correction (2026-09-27)

The later user screenshot identified that the configured `SideNav` in these previews did not match the Strata DL V1 sidebar. The correction recorded in `shell-sidebar-parity-2026-09-27.md` supersedes that part of the evidence above: all five DashboardShell stories now use the same interactive V1 fixture as `Navigation/Sidenav` and AppShell. The component retains its `navigation` configuration and adds a consumer-supplied `sidebar` slot for this composition. Desktop and narrow browser review and the updated package gates are recorded in the correction contract.
