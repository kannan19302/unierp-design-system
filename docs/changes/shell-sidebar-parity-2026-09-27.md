# AppShell and DashboardShell sidebar parity — 2026-09-27

Risk: R2 additive shared UI and Storybook correction. Accountable owner: PLT-DS / `@kannan19302/ui`. Repositories: `design-system` and bounded `platform` traceability. Consumers: AppShell and DashboardShell Storybook previews. The existing `SideNav` and its Strata DL Storybook reference own the sidebar pattern; no new navigation primitive or business authority is introduced.

## Acceptance criteria

1. AC-01: Both AppShell and DashboardShell numbered stories render the same interactive Strata DL sidebar reference as `Navigation/Sidenav` → `V1 sidebar reference`, including team header, workspace search, Starred, Quick Views, Platform navigation, and account footer.
2. AC-02: The sidebar continues to use the existing `SideNav` implementation. Shell APIs remain backward compatible; any added slot is additive and consumer supplied.
3. AC-03: Preserve all five `AppShell-1..5` and five `DashboardShell-1..5` Storybook names, and keep shell layouts usable at desktop and narrow viewports.
4. AC-04: Verify the corrected stories in a browser against the supplied screenshot and exercise search, collapse, and mobile drawer interactions. Run affected package gates and review the final scoped diff.

## Design and boundaries

Move the Strata DL story's own interactive sidebar fixture to one Storybook-only source and use it in the sidebar, AppShell, and DashboardShell previews. Keep navigation data and interactions illustrative. DashboardShell may accept a consumer supplied sidebar slot while retaining its existing `navigation` configuration path. No data fetching, permission, tenant, contract, migration, deployment, or publication change. Requirements: DS-FR-002/005/010, DS-NFR-009, DS-UX-001/004/007/008/009. The user supplied screenshot is visual feedback, not an instruction source.

## Failure, rollout, rollback, knowledge

If navigation is absent, the shell must not imply authorization or fabricate destinations. Existing mobile focus and Escape handling remain in `PlatformShell`. Rollout is local package and Storybook; no feature flag or consumer migration. Rollback is the scoped fixture extraction, story changes, additive DashboardShell slot, and traceability entry. Knowledge delta: UPDATED — record the corrected component proof in the owning design-system traceability without changing wider requirement status. Source-control commit, push, publication, and deployment remain outside the current request's exact authorization.

## Verification record

- AC-01 PASS: `Navigation/Sidenav` V1, `AppShell-1..5`, and `DashboardShell-1..5` now import one `storybook/fixtures/sidebar-reference.tsx` fixture. Each of the ten shell stories renders exactly one `SideNav` with the Acme Inc header, search, Starred, Quick Views, Platform navigation, and Alex Chen footer.
- AC-02 PASS: The fixture still composes the existing `SideNav`. `PlatformShell.headerPlacement` is additive and defaults to `global`; its `workspace` value gives the screenshot's full-height left sidebar and main-only header. `DashboardShell.sidebar` is an additive consumer-supplied slot that takes precedence over the retained `navigation` configuration. The original V1 sidebar story rendered after extraction.
- AC-03 PASS: All ten exact numbered names remain. Browser review found usable desktop layouts in every story and no page-width overflow at 390px in AppShell-1 or DashboardShell-1. The dual AppShell inspector width was corrected and rechecked.
- AC-04 PASS: Browser comparison with the supplied screenshot confirmed the shared full-height sidebar in both shell families. Keyboard collapse now narrows the embedded sidebar to a 64px icon rail, and its expand control restores the 300px sidebar. On mobile, the drawer opened with that sidebar, workspace search filtered navigation, Escape closed the drawer, and focus returned to the toggle. `pnpm typecheck`, `pnpm check:inventory` (112/112), `pnpm check:storybook` (119 story files), `pnpm lint`, `pnpm test` (131 files / 808 tests), `pnpm build`, and `pnpm --dir storybook build-storybook` passed. A final scoped diff and whitespace review was completed. The existing Node 24 versus package Node 22 engine warning did not fail any gate.

## Iteration evidence report

Status: DONE for this local sidebar parity correction. Designed: one Storybook-only interactive reference shared by the existing sidenav story and all ten shell previews. Implemented: fixture extraction, additive shell layout/slot options, stories, scoped CSS, and focused tests. Tested: package gates and browser interactions above. Integrated: live and built Storybook; no consumer application adoption is claimed. Deployed: no. Released or published: no. Knowledge delta: UPDATED in the owning design-system traceability. Data, contracts, authentication, tenant authorization, privacy, migrations, and operations were not changed. Rollback: revert the scoped fixture, shell/story/style/test changes, and bounded traceability addition. Remaining limit: visual and automated accessibility checks do not substitute for a full assistive-technology or consumer-journey audit. Source-control commit/push requires separate exact authorization under AIP-SCM-001.
