# Strata DL TopNav reusable component and shell parity — 2026-09-27

Risk: R2, additive shared UI and Storybook alignment. Accountable owner and public package owner: PLT-DS / `@kannan19302/ui`. Repositories: `design-system` implementation/evidence and bounded `platform` traceability. Consumers: AppShell, DashboardShell, Storybook, and package consumers. Existing `PlatformShell` header and navigation primitives own the prior pattern. No database, service, backend authorization, or L0 contract change.

## Outcome and acceptance criteria

1. **AC-01: Reusable Strata DL TopNav Component**:
   Build one canonical, reusable `TopNav` component in `src/navigation/top-nav/` with 100% conformant 5-file uniform anatomy (`top-nav.tsx`, `top-nav.module.css`, `top-nav.stories.tsx`, `top-nav.test.tsx`, `index.ts`), exported from `src/navigation/index.ts` and `@kannan19302/ui`.
2. **AC-02: Single Owning Component & Zero Header Duplication**:
   Extend the owning component architecture so `PlatformShell` (`AppShell`) and `DashboardShell` use `TopNav` as the authoritative single top bar. Eliminate duplicate top bars (such as in `AppShell-4`); instead, `TopNav` natively supports horizontal navigation items/tabs, page context/breadcrumbs, actions, scope, theme toggle, and account menu.
3. **AC-03: Shared Strata DL Sidebar Integration**:
   `TopNav` includes a clear, accessible sidebar toggle button that integrates seamlessly with the shared Strata DL sidebar reference (`SidebarReference` / `SideNav`) across desktop and mobile drawer modes.
4. **AC-04: Storybook Story Parity & Exact Names**:
   Attach the same `TopNav` component across all ten stories: exactly `AppShell-1` through `AppShell-5` and `DashboardShell-1` through `DashboardShell-5`, plus `Navigation/TopNav` standalone stories. Keep all Storybook names unchanged.
5. **AC-05: Tokens, A11y, Keyboard, and Responsive Mobile Parity**:
   All styles use approved design tokens with zero raw color or pixel literals, meeting WCAG 2.2 AA contrast. Support full keyboard navigation with visible focus rings (`:focus-visible`), Escape handling, and responsive mobile layout with zero viewport overflow at 390px.
6. **AC-06: Verification & Protocol Evidence**:
   Pass all package and repository gates (`pnpm check:inventory`, `pnpm check:tokens`, `pnpm check:density`, `pnpm check:contrast`, `pnpm check:logical-properties`, `pnpm typecheck`, `pnpm test`, `pnpm check:storybook`, `pnpm build`), inspect all 10 stories in a real browser at desktop (1440×900) and mobile (390×844) viewports, and produce an iteration evidence report.

## Design and boundaries

`TopNav` is a pure presentation component in `@kannan19302/ui/navigation`. It accepts consumer-supplied brand, platform name/icon, navigation items, breadcrumbs, search slot, actions, tenant scope, user profile, theme toggle, and callbacks. It does not perform data fetching or business authorization. `PlatformShell` delegates top-bar rendering to `TopNav` and accepts a consumer-supplied `topNav?: ReactNode` slot. `DashboardShell` composes `PlatformShell` and inherits `TopNav`.

Requirements: DS-FR-002/005/010, DS-NFR-006/009, DS-UX-001/004/006/007/008/009. Reference patterns: Strata Workbench Navigation, Palantir Blueprint 5 header, Salesforce SLDS global header.

## Invariants and failure behavior

- Exactly one top bar per shell layout; no stacked redundant headers.
- All actions and content are consumer supplied; the shell makes no authorization decisions.
- Empty slots do not render extra whitespace or broken dividers.
- Full keyboard operability: Tab navigation, visible focus rings, Escape dismisses open dropdowns (tenant menu, user menu), and focus returns to the invoking trigger.
- Mobile viewports (< 768px): The sidebar toggle remains accessible, horizontal navigation scrolls cleanly within its container, and the layout never induces page-level horizontal scrolling.

## Verification, rollout, rollback, knowledge

Run inventory check, token/density/contrast/logical-properties gates, typecheck, vitest unit and a11y tests, storybook standards, package build, and direct browser inspection at 1440×900 and 390×844 across all 10 shell stories and TopNav stories. Rollback is the scoped `top-nav` directory, story updates, and shell integration patch. Knowledge delta: UPDATED in `platform/docs/platforms/design-system/TRACEABILITY.md`.

## Execution and verification evidence

### 1. Architectural & Token Gates
- `pnpm check:inventory`: 113/113 conformant components, 100% story/test coverage, 46 subpath exports.
- `pnpm check:tokens`: 0 new violations (155 baselined, all new code strictly tokenized).
- `pnpm check:density`: Passed across all 4 density tiers (`ultra-compact`, `compact`, `standard`, `comfortable`).
- `pnpm check:contrast`: Passed across all 3 themes (`strata`, `strata-dark`, `strata-high-contrast`).
- `pnpm check:logical-properties`: 0 new physical directional CSS violations.
- `pnpm check:ui-governance`: 6/6 test fixtures passed, all 537 source files conformant.
- `pnpm typecheck`: Clean (`tsc --noEmit` exited with code 0).

### 2. Unit and Accessibility Tests
- `vitest run "src/navigation/top-nav" "src/shells"`: 10 test files passed, 130/130 tests passed:
  - `src/navigation/top-nav/top-nav.test.tsx`: 8 passed (includes axe a11y, keyboard Escape, tenant dropdown, sidebar toggle, density scaling).
  - `src/shells/app-shell/app-shell.test.tsx`: 21 passed (includes `topNav` prop and automated sidebar wiring).
  - `src/shells/dashboard-shell/dashboard-shell.test.tsx`: 9 passed (includes shared shell composition).
  - `src/shells/data-shell/data-shell.test.tsx`: 18 passed.
  - `src/shells/catalog-shell/catalog-shell.test.tsx`: 20 passed.
  - `src/shells/settings-shell/settings-shell.test.tsx`: 13 passed.
  - `src/shells/editor-shell/editor-shell.test.tsx`: 10 passed.
  - `src/shells/record-shell/record-shell.test.tsx`: 13 passed.
  - `src/shells/strata-bar/strata-bar.test.tsx`: 9 passed.
  - `src/shells/manifest/manifest.test.ts`: 9 passed.

### 3. Storybook Standards and Static Build
- `pnpm check:storybook`: 120 story files compiled with zero syntax or JSX transform errors.
- `pnpm --filter @kannan19302/storybook build-storybook`: Built statically in 31.68s to `storybook/storybook-static`.

### 4. Real Browser DevTools Inspection (Desktop 1440×900 & Mobile 390×844)
Inspected all 10 stories via Chrome DevTools MCP on live Storybook server:

| Story Name | Story ID | Desktop (1440×900) | Mobile (390×844) | Single Top Bar | Key Verifications |
|---|---|---|---|---|---|
| `AppShell-1` | `shells-appshell--app-shell-1` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Sidebar toggle, BrandMark, Business Suite, Breadcrumbs, Tenant, Theme, User |
| `AppShell-2` | `shells-appshell--app-shell-2` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Inset workspace, identical unified TopNav |
| `AppShell-3` | `shells-appshell--app-shell-3` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Floating workspace, identical unified TopNav |
| `AppShell-4` | `shells-appshell--app-shell-4` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | **Duplicate bar eliminated**; horizontal tabs ("Overview", "Work orders", "Inventory", "Reports", "Documents") embedded in TopNav; interactive tab switching with `aria-current="page"` verified |
| `AppShell-5` | `shells-appshell--app-shell-5` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Dual variant with inspector panel, identical unified TopNav |
| `DashboardShell-1` | `shells-dashboardshell--dashboard-shell-1` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Standard dashboard, attached identical TopNavReference |
| `DashboardShell-2` | `shells-dashboardshell--dashboard-shell-2` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Inset dashboard, attached identical TopNavReference |
| `DashboardShell-3` | `shells-dashboardshell--dashboard-shell-3` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Floating dashboard, attached identical TopNavReference |
| `DashboardShell-4` | `shells-dashboardshell--dashboard-shell-4` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Analytics center, attached identical TopNavReference |
| `DashboardShell-5` | `shells-dashboardshell--dashboard-shell-5` | PASS (0 overflow) | PASS (0 overflow) | Yes (1 bar) | Operations dashboard, attached identical TopNavReference; mobile sidebar toggle clicked -> drawer opens (`data-open="true"`, `aria-expanded="true"`) -> Escape key pressed -> drawer closes (`data-open="false"`) and focus returned to toggle button |

- **Dropdown & Modal Interactions**:
  - Tenant scope dropdown: clicked -> expanded with options ("Acme Inc", "Apex Logistics", "Zenith Global") -> selected "Apex Logistics" -> scope updated immediately to "Apex Logistics/Demo" and menu closed.
  - User account menu: clicked -> opened with user details ("Alex Chen") -> Escape pressed -> dismissed cleanly.

### 5. Benchmark Layout & Collapsible Sidebar Verification
- **Reference Image Alignment**:
  - Left cluster: Hamburger toggle button `☰` immediately followed by vertically stacked page title (`Dashboard`, font-weight 600) and breadcrumbs (`Home > Analytics > Overview` with subtle chevron `>` separators).
  - Right cluster: Search icon button (`🔍`), Dark/Light mode theme switch icon button (`🌙` / `☀️`), Notification bell (`🔔`) with top-right red badge dot, and circular user avatar with "JD" initials.
- **UniERP Branding Parity**:
  - Sidebar header uses `<BrandMark size="sm" compact />` with company name `UniERP` and workspace `Enterprise`.
- **Collapsible Sidebar Verification**:
  - On Desktop (1440×900): Clicking the hamburger button collapses `SideNav` / `SidebarReference` from 300px to 64px icon rail (`data-collapsed="true"`, `data-variant="icon"`). Clicking again smoothly expands back to 300px (`data-collapsed="false"`, `data-variant="sidebar"`).
  - On Mobile (390×844): Clicking the hamburger button opens the navigation drawer (`data-open="true"`, `aria-expanded="true"`) with backdrop; clicking backdrop or pressing Escape closes it and returns focus.
- **Shell Parity**:
  - Connected across all five `AppShell` stories (`AppShell-1` through `AppShell-5`) and all five `DashboardShell` stories (`DashboardShell-1` through `DashboardShell-5`).

