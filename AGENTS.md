<!-- UniERP-Agent-Protocol: 1.1.0 -->
# UniERP Repository Agent Entrypoint — Design System (`@kannan19302/ui`)

This repository is one delivery unit in the UniERP polyrepo. Before analysis, planning, review, or mutation, every
AI agent from every provider MUST read and follow:

1. the workspace entrypoint at [`../AGENTS.md`](../AGENTS.md);
2. the canonical standard at
   [`../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md`](../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md);
3. the owning platform documents selected through
   [`../unierp-platform/docs/PLATFORM_CATALOG.md`](../unierp-platform/docs/PLATFORM_CATALOG.md).

If the workspace entrypoint or canonical standard is unavailable, the protocol bundle is incomplete. The agent
MUST stop before mutation and report the missing dependency. This bootstrap adds no weaker or conflicting rules.
Repository-specific additions may be appended below only when they narrow implementation behavior without
redefining platform ownership, security, contracts, or cross-platform standards.

---

## Design System Specific Rules & Governance Standards

### 1. Mandatory 5-File Uniform Component Anatomy
Every UI component directory under `src/<category>/<component-name>/` MUST contain exactly 5 co-located files:

```
src/<category>/<component-name>/
├── <component-name>.tsx         # Logic, Props, & TypeScript Interfaces
├── <component-name>.module.css  # Scoped CSS Module (DL 2.0 Tokens)
├── <component-name>.stories.tsx # Storybook Story (CSF 3.0)
├── <component-name>.test.tsx    # Vitest + vitest-axe Unit & A11y Test Suite
└── index.ts                     # Encapsulated Re-export
```

- **No flat component placement**: Components must never reside as loose files directly in category root directories.
- **No isolated test folders**: Do not create legacy `__tests__` subdirectories; co-locate `<name>.test.tsx` directly alongside `<name>.tsx`.
- **Public Exports**: Every category must provide a top-level `src/<category>/index.ts` barrel re-exporting all constituent component folders.

### 2. Design Language (DL) 2.0 Token Governance
- **Zero Raw Literals**: Hardcoded hex colors (`#ffffff`, `#1a1b2e`) and raw pixel lengths (`40px`, `12px`) outside token source files are prohibited and enforced by CI token gates (`scripts/check-tokens.mjs`).
- **Token Hierarchy**:
  - Colors: `var(--color-*)` (e.g., `var(--color-brand)`, `var(--color-surface-elevated)`, `var(--color-text-primary)`)
  - Spacing & Dimensions: `var(--space-*)` (e.g., `var(--space-2)`, `var(--space-4)`, `var(--space-8)`)
  - Typography: `var(--text-*)`, `var(--weight-*)`, `var(--leading-*)`
  - Radii & Elevation: `var(--radius-*)`, `var(--shadow-*)`
  - Layout & Density: `var(--density-*)`
- **Contrast Ratios**: All themes (`meridian`, `meridian-dark`, `high-contrast`) and all 8 platform accents must pass WCAG 2.2 AA (>= 4.5:1 for standard text, >= 3.0:1 for large text/graphical elements).

### 3. Accessibility (a11y) Standards (Non-Negotiable)
- **Zero A11y Violations**: Every component test suite MUST include a `vitest-axe` automated test:
  ```tsx
  it("has zero accessibility violations", async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  ```
- **Keyboard Navigation**: All interactive elements must support keyboard navigation (Tab, Arrow keys, Enter, Space, Escape) with visible focus indicators.
- **ARIA Semantics**: Use native HTML5 semantics first; apply explicit `role`, `aria-expanded`, `aria-controls`, and `aria-live` where dynamic state is presented.

### 4. Polyrepo Boundaries & Layering
- **Pure Presentation & UI Primitives**: `design-system` is strictly presentation and UX logic. No database connections, server actions, REST fetch calls, or business entity orchestration may be introduced here.
- **Package Exports**: All category packages are exported as subpath exports in `package.json` (e.g., `@kannan19302/ui/primitives`, `@kannan19302/ui/layout`, `@kannan19302/ui/shell`).

### 5. Mandatory Quality Gates & Verification Checklist
Before committing any changes to the design system, every agent MUST verify:
1. `pnpm typecheck` — 0 TypeScript errors (`tsc --noEmit`).
2. `pnpm test` — 100% Vitest test pass rate across all 139+ component suites.
3. `pnpm build` — Contrast, platform accent, density, and token gate checks pass cleanly.
4. `pnpm build-storybook` (in `../storybook`) — Storybook builds with 0 errors.

