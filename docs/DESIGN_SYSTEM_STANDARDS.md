# UniERP Strata Design Language: The 10 Pillars of Enterprise Design System Excellence

This document is the authoritative standard for `@kannan19302/ui` in `design-system`.
For the platform-wide standard across all 31 repositories, refer to [`platform/workspace/.agents/standards/STRATA_DESIGN_SYSTEM_STANDARDS.md`](../../platform/workspace/.agents/standards/STRATA_DESIGN_SYSTEM_STANDARDS.md).

---

## The 10 Inviolable Pillars

1. **Foundations & Tokens**: W3C DTCG 3-tier hierarchy, WCAG 2.2 AA/AAA contrast across 6 themes, typography triad with `tabular-nums` for financials, text truncation with tooltip/title guarantees, 4-tier density scale, standardized z-index scale, dark mode surface elevation tinting.
2. **Component Architecture & API Ergonomics**: 5-file uniform anatomy (`.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, `index.ts`), universal `React.forwardRef`, polymorphic `asChild` composition via `@radix-ui/react-slot`, universal prop enums (`size`, `tone`), controlled/uncontrolled patterns, RSC/SSR safety, and idempotent `useId()` accessibility bindings.
3. **Inclusive Design & a11y**: W3C ARIA APG keyboard matrices, 2px accessible focus ring appearance, Windows High Contrast Mode (`@media (forced-colors: active)`) system colors, vestibular reduced motion collapse, color independence, and automated `vitest-axe` assertions.
4. **BiDi & Localization**: Inviolable CSS Logical Properties law (`margin-inline-start/end`), directional icon mirroring, LTR tabular numbers for enterprise accounting in RTL locales, and zero hardcoded English UI strings.
5. **The 5 Enterprise States (Zero Dead-Ends)**: Explicit implementation and storybook documentation for *Default*, *Loading/Skeleton (CLS < 0.05)*, *Actionable Empty*, *Diagnostic Error (INC-...)*, and *Unauthorized/403 (FLS)*.
6. **Component Lifecycle & Governance**: Formal 4-tier lifecycle (`Experimental` $\rightarrow$ `Beta` $\rightarrow$ `Stable` $\rightarrow$ `Deprecated`), minimum 1-major deprecation grace periods, dev-mode console warnings, and SemVer breaking change rules.
7. **Packaging, Performance & Hygiene**: Mandatory `"sideEffects": ["*.css", "**/*.css"]`, granular subpath exports, component gzip budgets (< 5KB primitives, < 35KB grids), heavy dependency isolation (`@kannan19302/ui/charts`), and Core Web Vitals protections.
8. **Storybook Workshop Standards**: CSF 3.0, Autodocs, Anatomy & Composition story, AllStatesGallery matrix, interactive simulation playgrounds, and pre-commit AST compilation gate.
9. **Automated CI Gate Fleet**: 10 automated CI scripts enforcing token purity, theme contrast, density constraints, logical properties, story compilation, cross-platform tokens, TypeScript typechecking, and axe-core a11y.
10. **Downstream Consuming Polyrepo Application Contract**: Single-source `ContextBar` breadcrumbs, zero-mock production telemetry mandate, and downstream token purity enforcement.
