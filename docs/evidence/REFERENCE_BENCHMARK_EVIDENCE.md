# Reference Benchmark & Interaction Elevation Evidence

## 1. Benchmark Research Universe
To elevate the visual, tactile, and interaction quality of UniERP to benchmark standards, the design system was audited against:
1. **shadcn/ui**: Component composability, accessible headless primitives, clean typography hierarchy, focus ring treatments.
2. **Palantir Foundry / Blueprint 5**: Tabular data density, hairline cell dividers, tabular numeric alignment (`tabular-nums`), zero cognitive fatigue.
3. **Linear & Stripe Design Engineering**: Keyboard-first command navigation, subtle spring physics, tactile active states (`scale(0.985)`), hairline borders.
4. **Salesforce Lightning (SLDS) & SAP Fiori**: Enterprise object consoles, split-view master-detail triage, structured transaction floorplans.
5. **openstatusHQ/data-table-filters**: Faceted filter trays with count chips and multi-select pill popovers.

## 2. Component Family Elevation Matrix

### 1. Data Tables & Data Grids
- **Reference**: `shadcn/ui data-table`, TanStack Table v9, Blueprint 5
- **Visual & Interaction Upgrades**:
  - Replaced ad-hoc inline styling in `table.tsx` with tokenized, scoped CSS module classes in `table.module.css`.
  - Added smooth sort indicator chevrons with CSS transition transforms.
  - Implemented hairline cell dividers (`var(--color-border)`) and sticky column box-shadow elevation on horizontal scroll.
  - Enhanced loading skeleton state with animated shimmer wave.
- **Proof**: 100% test pass rate in `table.test.tsx`, axe a11y zero violations.

### 2. Command Palette & Combobox
- **Reference**: `shadcn/ui command`, `cmdk`
- **Visual & Interaction Upgrades**:
  - Implemented keyboard shortcut badges (`Kbd` e.g. `⌘K`, `ESC`).
  - Added subtle backdrop blur (`backdrop-filter: blur(2px)`) and spring entry transition (`var(--ease-spring)`).
  - Categorized result groups with hairline section separators and active item contrast highlights.
- **Proof**: Arrow key navigation tests, Escape key dismissal, axe a11y audit passing.

### 3. Forms & Advanced Inputs
- **Reference**: `shadcn/ui field`, `Origin UI`
- **Visual & Interaction Upgrades**:
  - Added dual-ring accessible focus treatments (`box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-border-focus)`).
  - Associated `aria-invalid` and `aria-describedby` dynamically on validation errors.
  - Added micro-copy validation animations and persistent label positioning.
- **Proof**: `form-control.test.tsx` and input suites passing with zero a11y violations.

### 4. Navigation, Sidebars & Application Shells
- **Reference**: `shadcn/ui sidebar`, Linear Shell
- **Visual & Interaction Upgrades**:
  - Added active platform accent bar indicators (`var(--platform-accent)`).
  - Smooth slide transitions on collapsible rail sections (`var(--transition-slide)`).
  - Single-source breadcrumb navigation in `StrataBar` / `ContextBar`.
- **Proof**: `sidenav.test.tsx` and `strata-bar.test.tsx` passing cleanly.

### 5. Dialogs, Overlays & Drawers
- **Reference**: `shadcn/ui dialog`, `shadcn/ui drawer`
- **Visual & Interaction Upgrades**:
  - Refined spring-based entry animations (`var(--ease-spring)`).
  - Scroll locking and focus containment via `useFocusTrap` and `useScrollLock`.
  - Accessible title (`aria-labelledby`) and description (`aria-describedby`) bindings.
- **Proof**: `modal.test.tsx` and `drawer.test.tsx` passing cleanly.
