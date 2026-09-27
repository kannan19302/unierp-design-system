# AppShell numbered variants change contract — 2026-09-27

Risk: R2, additive shared UI. Accountable owner and public package owner: PLT-DS / `@kannan19302/ui`. Consumer: Storybook and existing package consumers. Data, service, and authorization contracts: none.

## Outcome and acceptance

1. AC-01: Keep the existing `PlatformShell`/`AppShell` API compatible and provide five visibly distinct, reusable layouts within one component.
2. AC-02: Register exactly five primary Storybook examples under `Shells/AppShell`, displayed as `AppShell-1` through `AppShell-5`, with clearly synthetic demo content.
3. AC-03: Match the supplied shell references by preserving recognizable navigation, header, scope, workspace, responsive, and accessible interaction patterns in Strata tokens.
4. AC-04: Prove the package gates and inspect every numbered story in a real browser at desktop and narrow viewports; repair rendering or interaction defects found.
5. AC-05: Review the scoped diff and report remaining gates, consumer impact, and rollback.

## Design and boundaries

Existing `standard`, `inset`, and `floating` variants stay compatible. Add `topbar` for horizontal navigation and `dual` for a right detail panel. The consumer supplies navigation, content, actor, tenant, and callbacks; the shell makes no permission or business decision. No real account, metric, or production claim belongs in stories. Mobile navigation remains keyboard operable and must not cover content permanently. Requirements: DS-FR-002/005/010 and DS-UX-001/004/007/008/009. Reference patterns: Shadcn Studio dashboard shell, shadcn/ui sidebar blocks, Shadcn UI Blocks Dashboard Home Shell.

## Verification, rollout, rollback, knowledge

Run inventory, typecheck, focused tests, lint, build, Storybook standards, and direct browser checks. No package publication or deployment is in scope. Rollback is the scoped component/story/style patch; no data migration. Knowledge delta: NONE—these layouts implement existing shell and Storybook requirements without changing product intent or ownership. This record is iteration evidence, not a new design authority.

## Verification record

- AC-01 PASS: Three prior variants retained; two additive variants and slots compile under the existing public export. The observed direct `PlatformShell` consumer in `developer-platform/src/app/(platform)/layout.tsx` uses unchanged props. No consumer migration is required.
- AC-02 PASS: Both live and built Storybook `index.json` list exactly `AppShell-1` through `AppShell-5` below `Shells/AppShell` (plus generated Documentation).
- AC-03 PASS: Browser inspection at 1440×900 confirmed side navigation, inset and floating workspaces, horizontal navigation, dual panel, greeting, KPI strip, recent work, and chart slot. The stories label all records and metrics as sample data. Strata dark and high contrast previews rendered.
- AC-04 PASS: At 390×844, the top navigation scrolls inside its own region without page-wide horizontal overflow. The dual layout scrolls its workspace and details in one flow. Mobile drawer focus moves to navigation, wraps on Tab/Shift+Tab, and returns to its toggle on Escape. Browser issues found in the first pass were corrected and rechecked. `pnpm check:inventory`, `pnpm lint`, `pnpm build`, `pnpm check:storybook`, and `pnpm --dir storybook build-storybook` passed; the full `pnpm test` run passed 130 files / 798 tests before the final focus-loop refinement, and the final focused AppShell run passed 19 tests. Node 24 emitted the existing package engine warning (`>=22 <23`) but did not fail checks.
- AC-05 PASS: The diff is limited to the AppShell implementation, styles, stories, tests, and this change record. `git diff --check` passed. No data, auth, tenancy, contract, or operations change was needed.
